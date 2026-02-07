<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

class SyncFromDevCommand extends Command
{
    protected $signature = 'sync:dev 
                            {--tables= : Comma-separated list of tables to sync (default: all)}
                            {--truncate : Truncate tables before importing}
                            {--dry-run : Show what would be synced without making changes}';

    protected $description = 'Download and sync all data from dev server to local database via API';

    /**
     * Tables to sync in order (respecting foreign key dependencies)
     */
    protected array $syncOrder = [
        'users',
        'customers',
        'suppliers',
        'masters',
        'settings',
        'pets',
        'notifications',
        'notification_users',
    ];

    public function handle(): int
    {
        $devUrl = env('DEV_SERVER_URL');
        $syncToken = env('SYNC_TOKEN');

        if (! $devUrl) {
            $this->error('DEV_SERVER_URL is not set in .env file');
            $this->info('Add DEV_SERVER_URL=https://your-dev-server.com to your .env file');

            return 1;
        }

        if (! $syncToken) {
            $this->error('SYNC_TOKEN is not set in .env file');
            $this->info('Add SYNC_TOKEN=your-secret-token to your .env file (must match dev server)');

            return 1;
        }

        $tablesToSync = $this->option('tables')
            ? explode(',', $this->option('tables'))
            : $this->syncOrder;

        $truncate = $this->option('truncate');
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be made');
        }

        $this->info("Connecting to dev server: {$devUrl}");
        $this->newLine();

        // Fetch all data at once or per table
        if (count($tablesToSync) === count($this->syncOrder)) {
            return $this->syncAllTables($devUrl, $syncToken, $truncate, $dryRun);
        }

        return $this->syncSpecificTables($devUrl, $syncToken, $tablesToSync, $truncate, $dryRun);
    }

    protected function syncAllTables(string $devUrl, string $syncToken, bool $truncate, bool $dryRun): int
    {
        $this->info('Fetching all data from dev server...');

        try {
            $response = Http::timeout(120)
                ->withHeaders(['X-Sync-Token' => $syncToken])
                ->get("{$devUrl}/api/sync/export-all");

            if (! $response->successful()) {
                $this->error("Failed to fetch data: HTTP {$response->status()}");
                $this->error($response->body());

                return 1;
            }

            $allData = $response->json();

            if (isset($allData['error'])) {
                $this->error("API Error: {$allData['error']}");

                return 1;
            }

            $this->info('Data fetched successfully!');
            $this->newLine();

            // Disable foreign key checks for truncate
            if ($truncate && ! $dryRun) {
                Schema::disableForeignKeyConstraints();
            }

            foreach ($this->syncOrder as $table) {
                if (! isset($allData[$table])) {
                    $this->warn("Table '{$table}' not found in response, skipping...");

                    continue;
                }

                $records = $allData[$table];
                $this->syncTable($table, $records, $truncate, $dryRun);
            }

            // Re-enable foreign key checks
            if ($truncate && ! $dryRun) {
                Schema::enableForeignKeyConstraints();
            }

            $this->newLine();
            $this->info('✓ Sync completed successfully!');

            return 0;

        } catch (\Exception $e) {
            $this->error("Error: {$e->getMessage()}");

            return 1;
        }
    }

    protected function syncSpecificTables(string $devUrl, string $syncToken, array $tables, bool $truncate, bool $dryRun): int
    {
        if ($truncate && ! $dryRun) {
            Schema::disableForeignKeyConstraints();
        }

        foreach ($tables as $table) {
            $table = trim($table);

            if (! in_array($table, $this->syncOrder)) {
                $this->warn("Unknown table '{$table}', skipping...");

                continue;
            }

            $this->info("Fetching '{$table}' from dev server...");

            try {
                $response = Http::timeout(60)
                    ->withHeaders(['X-Sync-Token' => $syncToken])
                    ->get("{$devUrl}/api/sync/export/{$table}");

                if (! $response->successful()) {
                    $this->error("Failed to fetch {$table}: HTTP {$response->status()}");

                    continue;
                }

                $records = $response->json();

                if (isset($records['error'])) {
                    $this->error("API Error for {$table}: {$records['error']}");

                    continue;
                }

                // Handle paginated response
                if (isset($records['data'])) {
                    $records = $records['data'];
                }

                $this->syncTable($table, $records, $truncate, $dryRun);

            } catch (\Exception $e) {
                $this->error("Error syncing {$table}: {$e->getMessage()}");
            }
        }

        if ($truncate && ! $dryRun) {
            Schema::enableForeignKeyConstraints();
        }

        $this->newLine();
        $this->info('✓ Sync completed!');

        return 0;
    }

    protected function syncTable(string $table, array $records, bool $truncate, bool $dryRun): void
    {
        $count = count($records);

        if ($dryRun) {
            $this->line("  [DRY RUN] Would sync {$count} records to '{$table}'");
            if ($truncate) {
                $this->line("  [DRY RUN] Would truncate '{$table}' first");
            }

            return;
        }

        if ($truncate) {
            DB::table($table)->truncate();
            $this->line("  Truncated '{$table}'");
        }

        if (empty($records)) {
            $this->line("  '{$table}': No records to sync");

            return;
        }

        $bar = $this->output->createProgressBar($count);
        $bar->setFormat("  Syncing '{$table}': %current%/%max% [%bar%] %percent:3s%%");

        // Use chunked insert for better performance
        $chunks = array_chunk($records, 100);

        foreach ($chunks as $chunk) {
            // Clean up records - remove any non-existent columns
            $cleanedChunk = array_map(function ($record) use ($table) {
                return $this->cleanRecord($table, $record);
            }, $chunk);

            try {
                DB::table($table)->upsert(
                    $cleanedChunk,
                    ['id'],
                    array_keys($cleanedChunk[0] ?? [])
                );
            } catch (\Exception $e) {
                // Fallback to individual inserts/updates
                foreach ($cleanedChunk as $record) {
                    try {
                        DB::table($table)->updateOrInsert(
                            ['id' => $record['id']],
                            $record
                        );
                    } catch (\Exception $innerE) {
                        $this->newLine();
                        $this->warn("  Failed to sync record ID {$record['id']}: {$innerE->getMessage()}");
                    }
                }
            }

            $bar->advance(count($chunk));
        }

        $bar->finish();
        $this->newLine();
    }

    protected function cleanRecord(string $table, array $record): array
    {
        // Get table columns
        static $tableColumns = [];

        if (! isset($tableColumns[$table])) {
            $tableColumns[$table] = Schema::getColumnListing($table);
        }

        // Only keep columns that exist in the table
        $cleaned = array_intersect_key($record, array_flip($tableColumns[$table]));

        // JSON encode any array/object values (for JSON columns like 'data')
        foreach ($cleaned as $key => $value) {
            if (is_array($value) || is_object($value)) {
                $cleaned[$key] = json_encode($value);
            }
            // Convert ISO 8601 datetime strings to MySQL format
            elseif (is_string($value) && preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/', $value)) {
                try {
                    $cleaned[$key] = \Carbon\Carbon::parse($value)->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    // Keep original value if parsing fails
                }
            }
        }

        return $cleaned;
    }
}
