<?php
$logFile = __DIR__.'/../storage/logs/laravel.log';

// Handle Clear Action
if (isset($_POST['action']) && $_POST['action'] === 'clear') {
    file_put_contents($logFile, '');
    header('Location: '.$_SERVER['PHP_SELF']);
    exit;
}

// Read Log
$content = file_exists($logFile) ? file_get_contents($logFile) : '';
$rawLines = explode("\n", trim($content));

// Group log entries: a new entry starts with [YYYY-MM-DD HH:MM:SS], continuation lines are appended
$entries = [];
$currentEntry = '';

foreach ($rawLines as $line) {
    // Check if line starts with a timestamp pattern (new log entry)
    if (preg_match('/^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/', $line)) {
        // Save previous entry if exists
        if (!empty($currentEntry)) {
            $entries[] = $currentEntry;
        }
        $currentEntry = $line;
    } else {
        // Continuation line - append to current entry
        $currentEntry .= "\n" . $line;
    }
}
// Don't forget the last entry
if (!empty($currentEntry)) {
    $entries[] = $currentEntry;
}

// Reverse for latest first
$entries = array_reverse($entries);

// Helper to parse log level
function getLevelColor($line)
{
    if (strpos($line, '.ERROR') !== false || strpos($line, '.CRITICAL') !== false) {
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    }
    if (strpos($line, '.WARNING') !== false) {
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
    }
    if (strpos($line, '.INFO') !== false) {
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
    if (strpos($line, '.DEBUG') !== false) {
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800/50';
    }

    return 'text-gray-700 dark:text-gray-300';
}

function parseEntry($entry)
{
    $lines = explode("\n", $entry);
    $firstLine = $lines[0];
    
    // Regex for default Laravel log format: [2023-01-01 12:00:00] Env.LEVEL: Message
    if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+)\.(\w+): (.*)/', $firstLine, $matches)) {
        $message = $matches[4];
        
        // If there are continuation lines, append them
        if (count($lines) > 1) {
            $continuation = implode("\n", array_slice($lines, 1));
            $message .= "\n" . $continuation;
        }
        
        return [
            'date' => $matches[1],
            'env' => $matches[2],
            'level' => $matches[3],
            'message' => $message,
            'raw' => $entry,
        ];
    }

    return ['raw' => $entry]; // Stack traces or unstructured lines
}
?>
<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Viewer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
        }
    </script>
    <style>
        .log-entry { font-family: 'Consolas', 'Monaco', monospace; }
    </style>
</head>
<body class="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-200">
    <div class="container mx-auto p-4 max-w-7xl">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div>
                <h1 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    System Logs
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Viewing: storage/logs/laravel.log</p>
            </div>

            <div class="flex items-center gap-3">
                <!-- Theme Toggle -->
                <button onclick="toggleTheme()" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <!-- Sun -->
                    Theme
                    <!-- Moon -->
                    
                </button>

                <!-- Refresh -->
                <button onclick="window.location.reload()" class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Refresh
                </button>
                
                <!-- Clear Button -->
                <form method="POST" onsubmit="return confirm('Are you sure you want to clear the logs?');" class="m-0">
                    <input type="hidden" name="action" value="clear">
                    <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Clear Log
                    </button>
                </form>
            </div>
        </div>

        <!-- Log Viewer Content -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
               <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Latest Events First</span>
               <span class="text-xs text-gray-400"><?php echo count($entries); ?> entries</span>
            </div>
            
            <div class="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <?php if (empty($content)) { ?>
                    <div class="p-8 text-center text-gray-400 dark:text-gray-500 italic">
                        No logs found in file.
                    </div>
                <?php } else { ?>
                    <?php foreach ($entries as $entry) {
                        if (empty(trim($entry))) {
                            continue;
                        }
                        $parsed = parseEntry($entry);
                        $colorClass = getLevelColor($entry);
                        ?>
                        <div class="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors p-3 text-sm log-entry break-words leading-relaxed border-l-4 <?php echo str_replace(['text-', 'bg-'], ['border-', 'border-transparent '], $colorClass); ?> border-transparent hover:border-current">
                            <?php if (isset($parsed['date'])) { ?>
                                <div class="flex flex-col sm:flex-row gap-1 sm:gap-3">
                                    <div class="flex-shrink-0 flex gap-2 items-baseline w-48 text-xs text-gray-400 select-none">
                                        <span><?php echo $parsed['date']; ?></span>
                                    </div>
                                    <div class="flex-1 <?php echo $colorClass; ?> rounded px-2 -ml-2 py-0.5 inline-block w-fit">
                                        <span class="font-bold opacity-75 mr-1 text-xs uppercase tracking-wide px-1.5 py-0.5 rounded border border-current text-[10px]"><?php echo $parsed['level']; ?></span>
                                        <pre class="whitespace-pre-wrap inline font-mono text-xs"><?php echo htmlspecialchars($parsed['message']); ?></pre>
                                    </div>
                                </div>
                            <?php } else { ?>
                                <!-- Stack trace or raw line -->
                                <div class="text-gray-500 dark:text-gray-400 pl-48 sm:pl-52 text-xs font-mono whitespace-pre-wrap">
                                    <?php echo htmlspecialchars($parsed['raw']); ?>
                                </div>
                            <?php } ?>
                        </div>
                    <?php } ?>
                <?php } ?>
            </div>
        </div>
    </div>

    <script>
        // Check local storage for theme
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        function toggleTheme() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    </script>
</body>
</html>
