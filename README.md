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
You want to have a map on your website. Therefore, you can use external map providers 
like Google Maps or Bing Maps. 
But you want to be flexible. You don't want to depend too much on these map providers. It should be simple to replace them, if you wish to.

What you need is a common API for all map providers and MapEmAll provides this.
In addition, MapEmAll is open source (MIT License). You have full control to extend or modify it as you need it.

## Features
* Load a map (Google, Bing or OpenStreetMap)
* Add markers on the map
* Remove all markers
* Get notified when user changes the map area (zoom or scroll) 

This is a very minimal subset of the functionality what the APIs of those map providers offer. So if you need more than the listed functionality, you probably don't want to use MapEmAll.

## Restrictions

### MapEmAll with OpenStreetMap on HTTPS website 
OpenStreetMap cannot be used in a web page which is encrypted with HTTPS. 
This makes it unusable in a production application.

E.g. the Chrome Browser gives the following error message:

*Mixed Content: The page at [...] was loaded over HTTPS, but requested an insecure script 'http://www.openlayers.org/api/OpenLayers.js'. This request has been blocked; the content must be served over HTTPS.*

As a solution, MapEmAll should give the possibility to configure your own OSM tile server.

## Downloads

* [Current development version](https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/dist/MapEmAll.js)
* [Current development version (minified)](https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/dist/MapEmAll.min.js)

## Usage

Have a look at the examples:
* [HelloWorld](https://github.com/stophi-dev/MapEmAll/tree/master/examples/HelloWorld/public_html)
