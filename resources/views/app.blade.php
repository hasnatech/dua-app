<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Dua App') }}</title>

    {{--
    <link rel="icon" href="/logo.ico" sizes="any"> --}}
    <link rel="icon" href="/images/icon.png" type="image/png">
    {{--
    <link rel="apple-touch-icon" href="/apple-touch-icon.png"> --}}
    <link rel="apple-touch-icon" href="/images/icon.png">


    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <link rel="manifest" href="/build/manifest.webmanifest">
    <meta name="theme-color" content="#07461fff">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Dua App">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>