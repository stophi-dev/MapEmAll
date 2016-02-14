# MapEmAll 
[![Build Status](https://api.travis-ci.org/stophi-dev/MapEmAll.svg?branch=master)](https://travis-ci.org/stophi-dev/MapEmAll)
[![Coverage](https://codecov.io/github/stophi-dev/MapEmAll/coverage.svg?branch=master)](https://codecov.io/github/stophi-dev/MapEmAll?branch=master)

One API for multiple map providers. 
Currently supported: 
* [Google Maps (JavaScript API V3)](https://developers.google.com/maps/documentation/javascript/)
* [Bing Maps (Ajax Control, Version 7.0)](https://msdn.microsoft.com/de-de/library/gg427610.aspx) 
* [OpenStreetMap (OpenLayers 2)](http://openlayers.org/two/)
 
This test application demonstrates what is possible with MapEmAll: [MapEmAll Demo](https://rawgit.com/stophi-dev/MapEmAll/master/test/system/index.html)

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

## Pitfalls

### MapEmAll with OpenStreetMap on HTTPS website 
If you select the 'OSM' map provider on a HTTPS website, you might get an error like this:

*Mixed Content: The page at [...] was loaded over HTTPS, but requested an insecure script 'http://www.openlayers.org/api/OpenLayers.js'. This request has been blocked; the content must be served over HTTPS.*

To solve this problem, you should serve the OpenLayer 2 files locally on your server. You can find them here:
[Download OpenLayers2](http://github.com/openlayers/ol2/releases/download/release-2.13.1/OpenLayers-2.13.1.zip)

Then you can change the URL to your local OpenLayers.js, e.g. like this:
```javascript
MapEmAll.osm.url = 'lib/openlayers/OpenLayers.js';
```

## Downloads

* [Current development version](https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/dist/MapEmAll.js)
* [Current development version (minified)](https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/dist/MapEmAll.min.js)

## Usage

Have a look at the examples:
* [HelloWorld](https://github.com/stophi-dev/MapEmAll/tree/master/examples/HelloWorld/public_html)
