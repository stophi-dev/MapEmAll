# MapEmAll 
[![Build Status](https://api.travis-ci.org/stophi-dev/MapEmAll.svg?branch=master)](https://travis-ci.org/stophi-dev/MapEmAll)
[![Coverage](https://codecov.io/github/stophi-dev/MapEmAll/coverage.svg?branch=master)](https://codecov.io/github/stophi-dev/MapEmAll?branch=master)

One API for multiple map providers. 
Currently supported: 
* [Google Maps (JavaScript API V3)](https://developers.google.com/maps/documentation/javascript/)
* [Bing Maps (Ajax Control, Version 7.0)](https://msdn.microsoft.com/de-de/library/gg427610.aspx) 
* [OpenStreetMap (OpenLayers 2)](http://openlayers.org/two/)

**The API is very limited at this stage and is likely to change in the future.**

## Why
If you want to include a map in your web application, you must depend on an external service, which 
provides the maps for you. To reduce the dependency on a specific provider, it is a good practice,
to write an abstraction layer. This makes it easy to replace your provider when needed.

MapEmAll is such an abstraction layer to make you more independent. 
And it is open source (MIT License). You have full control to extend or modify it as you need it.

## Features
TBD

## Restrictions
TBD

## Downloads

* [Current development version](https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/dist/MapEmAll.js)
* [Current development version (minified)](https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/dist/MapEmAll.min.js)

## Usage

Have a look at the examples:
* [HelloWorld](https://github.com/stophi-dev/MapEmAll/tree/master/examples/HelloWorld/public_html)
