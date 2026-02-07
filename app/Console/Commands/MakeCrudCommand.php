<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use Illuminate\Support\Str;
use Illuminate\Filesystem\Filesystem;

class MakeCrudCommand extends Command
{
    protected $signature = 'make:crud {name}';
    protected $description = 'Generate CRUD operations, controller, model, and Inertia views for a table.';

    public function handle()
    {
        $name = Str::studly($this->argument('name'));
        $table = Str::plural(Str::snake($name));
        $migrationFile = $this->findMigrationFile($table);
        if (!$migrationFile) {
            $this->error("Migration for table '{$table}' not found.");
            return 1;
        }
        $fields = $this->parseMigrationFields($migrationFile);
        $this->info('Fields: ' . json_encode($fields));
        // 1. Generate model
        $this->call('make:model', ['name' => $name]);
        // 2. Generate controller
        $this->generateController($name, $fields);
        // 3. Generate Inertia views
        $this->generateInertiaViews($name, $fields);
        $this->info('CRUD generated successfully!');
        return 0;
    }

    protected function findMigrationFile($table)
    {
        $files = glob(database_path('migrations/*create_' . $table . '_table.php'));
        return $files[0] ?? null;
    }

    protected function parseMigrationFields($migrationFile)
    {
        $content = file_get_contents($migrationFile);
        preg_match_all('/\$table->(\w+)\(([^)]+)\)([^;]*)/', $content, $matches, PREG_SET_ORDER);

        $fields = [];
        foreach ($matches as $match) {
            $type = $match[1]; // e.g., string, integer
            $args = str_replace(['"', "'"], '', $match[2]); // remove quotes
            $chain = $match[3]; // the rest of the chained call (e.g., ->nullable()->default(0))

            $parts = array_map('trim', explode(',', $args));
            $field = $parts[0];

            if (!in_array($field, ['id', 'timestamps'])) {
                $nullable = str_contains($chain, 'nullable()');
                $fields[] = [
                    'name' => $field,
                    'type' => $type,
                    'nullable' => $nullable,
                ];
            }
        }

        return $fields;
    }


    protected function generateController($name, $fields)
    {
        $stub = file_get_contents(resource_path('stubs/crud/controller.stub'));
        $model = $name;
        $modelLower = Str::camel($name);
        $modelPlural = Str::plural($name);
        $modelPluralLower = Str::camel($modelPlural);
        $validationRules = collect($fields)->map(function ($field) {
            if ($field['name'] === '') return '';
            if ($field['name'] === 'id') return '';
            if ($field['name'] === 'created_at') return '';
            if ($field['name'] === 'updated_at') return '';

            $rule = "'{$field['name']}' => " . ($field['nullable'] ? "'nullable" : "'required");
            switch ($field['type']) {
                case 'string':
                    $rule .= "|string";
                    break;
                case 'integer':
                    $rule .= "|integer";
                    break;
                case 'boolean':
                    $rule .= "|boolean";
                    break;
                case 'date':
                    $rule .= "|date";
                    break;
                    // Add more types as needed
            }
            switch ($field['name']) {
                case 'email':
                    $rule .= "|email";
                    break;
                case 'password':
                    $rule .= "|min:8";
                    break;
                // Add more specific rules as needed
                case 'phone':
                    $rule .= "|regex:/^\\+?[0-9]{10,15}$/"; // Example regex for phone numbers
                    break;
                case 'id':
                    $rule = ''; // Skip 'id' field
                    break;
                case 'created_at':
                case 'updated_at':
                    $rule = ''; // Skip timestamps
                    break;
            }
            $rule .= "',";
            return $rule;
        })->implode("\n            ");


        $controller = str_replace([
            '{{model}}',
            '{{modelLower}}',
            '{{modelPlural}}',
            '{{modelPluralLower}}',
            '{{validationRules}}'
        ], [
            $model,
            $modelLower,
            $modelPlural,
            $modelPluralLower,
            $validationRules
        ], $stub);
        $controllerPath = app_path("Http/Controllers/Admin/{$modelPlural}Controller.php");
        file_put_contents($controllerPath, $controller);
        $this->info("Controller created: {$controllerPath}");
    }

    protected function generateInertiaViews($name, $fields)
    {
        $model = $name;
        $modelLower = Str::camel($name);
        $modelPlural = Str::plural($name);
        $modelPluralLower = Str::camel($modelPlural);
        $viewDir = resource_path("js/pages/Admin/{$modelPlural}");
        if (!is_dir($viewDir)) mkdir($viewDir, 0777, true);
        $stubs = [
            'Index.tsx.stub' => 'Index.tsx',
            'Create.tsx.stub' => 'Create.tsx',
            'Edit.tsx.stub' => 'Edit.tsx',
            'DynamicForm.stub' => 'DynamicForm.tsx',
        ];
        foreach ($stubs as $stubFile => $targetFile) {
            $stubPath = resource_path("stubs/crud/{$stubFile}");
            if (!file_exists($stubPath)) continue;
            $stub = file_get_contents($stubPath);
            $fieldsCode = '';
            if ($stubFile === 'form.stub') {
                foreach ($fields as $field) {
                    $fieldsCode .= "<div><label>{$field['name']}</label><input name=\"{$field['name']}\" /></div>\n      ";
                }
            }

            $tableColumns = [
                "{ key: 'id',  label: 'ID', sortable: true }"
            ];

            $tableColumns = array_merge($tableColumns, collect($fields)->map(function ($field) use ($modelLower, $modelPluralLower) {
                if ($field['name'] === 'id' || $field['name'] === '') return null; // Skip 'id' if it already exists
                if ($field['name'] === 'title' || $field['name'] === 'name') {
                    return "{
                        key: '{$field['name']}',
                        label: '" . ucfirst($field['name']) . "',
                        sortable: true,
                        render: ($modelLower: any) => (
                            <Link href={route('$modelPluralLower.edit', {$modelLower}.id)} className=\"font-medium hover:underline\">
                                { {$modelLower}.{$field['name']} }
                            </Link>
                        )
                    }";
                }

                return "{ key: '{$field['name']}',  label: '" . ucfirst($field['name']) . "', sortable: true }";
            })->filter()->values()->toArray());

            $tableColumns[] = "{
                    key: 'action',
                    label: 'Action',
                    sortable: false,
                    render: ( {$modelLower} : any) => (
                    
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant=\"ghost\" className=\"h-8 w-8 p-0\">
                                <MoreVertical className=\"h-4 w-4\" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align=\"end\">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/{$modelPluralLower}/\${{$modelLower}.id}/edit`} className=\"flex items-center gap-2\">
                                    <Edit className=\"h-4 w-4\" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete({$modelLower}.id)} className=\"text-red-600\">
                                <Trash2 className=\"h-4 w-4\" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    ),
                }";

            $tableColumnsString = "[\n    " . implode(",\n    ", $tableColumns) . "\n]";

            $view = str_replace([
                '{{model}}',
                '{{modelLower}}',
                '{{modelPlural}}',
                '{{modelPluralLower}}',
                '{{fields}}',
                '{{tableColumns}}'
            ], [
                $model,
                $modelLower,
                $modelPlural,
                $modelPluralLower,
                $fieldsCode,
                $tableColumnsString
            ], $stub);
            if ($stubFile === 'DynamicForm.stub') {
                $initialData = '';
                foreach ($fields as $field) {
                    if ($field['name'] !== 'id') {
                        if ($field['name'] != '')
                            $initialData .= "{$field['name']}: {$modelLower}?.{$field['name']} || '',\n        ";
                    }
                }
                $initialData = rtrim($initialData, ",\n        ");
                $initialData = "{\n        {$initialData}\n    }";

                $formFields = '';
                foreach ($fields as $field) {
                    if ($field['name'] !== 'id' && $field['name'] !== '') {
                        if ($field['type']  === 'text') {
                            $formFields .= "
                            <div className=\"mb-4 col-span-3\">\n            
                                <label className=\"block mb-1 font-medium capitalize\">{$field['name']}</label>\n            
                                <Textarea
                                    placeholder=\"Type your message here.\"
                                    name=\"{$field['name']}\"
                                    value={data.{$field['name']}}
                                    onChange={(e) => setData({ ...data, {$field['name']}: e.target.value })}
                                    className=\"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500\"
                                />
                                {errors.{$field['name']} && <div className=\"text-red-500 text-xs mt-1\">{errors.{$field['name']}}</div>}\n
                            </div>\n";
                        } else if ($field['type'] === 'foreignId') {
                            // split the field name to get the related model
                            $relatedModel = explode('_', $field['name'])[0];

                            $formFields .= "
                            <div className=\"mb-4\">\n            
                                <label className=\"block mb-1 font-medium capitalize\">{$relatedModel}</label>\n            
                                <ComboBox router=\"search/$relatedModel\" value={data.{$field['name']}} onChange={(val) => setData('{$field['name']}', val)} />
                                {errors.{$field['name']} && <div className=\"text-red-500 text-xs mt-1\">{errors.{$field['name']}}</div>}\n
                            </div>\n";
                        } else if ($field['type'] === 'boolean') {
                            $formFields .= "
                            <div className=\"mb-4\">\n            
                                <label className=\"block mb-1 font-medium capitalize\">{$field['name']}</label>\n            
                                <Checkbox name=\"{$field['name']}\" defaultChecked={data.{$field['name']}== 1} 
                                onCheckedChange={(e) => setData({ ...data, {$field['name']}: e })} className=\"mt-1  border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500\" />
                                {errors.{$field['name']} && <div className=\"text-red-500 text-xs mt-1\">{errors.{$field['name']}}</div>}\n
                            </div>\n";
                        } else if ($field['name'] === 'image') {
                            $formFields .= "
                             <div className=\"mb-4 col-span-3\">\n            
                                <label className=\"block mb-1 font-medium capitalize\">{$field['name']}</label>\n            
                                <ImageUpload
                                    onFileChange={(file) => setData({ ...data, {$field['name']}: file })}
                                    previewUrl={data?.image}
                                />
                                {errors.{$field['name']} && <div className=\"text-red-500 text-xs mt-1\">{errors.{$field['name']}}</div>}\n
                            </div>\n";
                        } else {
                            $formFields .= "
                            <div className=\"mb-4\">\n            
                                <label className=\"block mb-1 font-medium capitalize\">{$field['name']}</label>\n            
                                <Input type=\"text\" name=\"{$field['name']}\" value={data.{$field['name']}} onChange={(e) => setData({ ...data, {$field['name']}: e.target.value })} className=\"mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500\" />
                                {errors.{$field['name']} && <div className=\"text-red-500 text-xs mt-1\">{errors.{$field['name']}}</div>}\n
                            </div>\n";
                        }
                    }
                }


                $view = str_replace(
                    [
                        '{{initialData}}',
                        '{{formFields}}'
                    ],
                    [$initialData, $formFields],
                    $view
                );
            }
            file_put_contents("{$viewDir}/{$targetFile}", $view);
            $this->info("View created: {$viewDir}/{$targetFile}");
        }
    }
}
