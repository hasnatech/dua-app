<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- <link rel="icon" href="/logo.ico" sizes="any"> --}}
    <link rel="icon" href="/images/light.png" type="image/png">
    {{-- <link rel="apple-touch-icon" href="/apple-touch-icon.png"> --}}
    <link rel="apple-touch-icon" href="/dark.png">


    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#644f29">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
