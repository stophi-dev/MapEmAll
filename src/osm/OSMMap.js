/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global OpenLayers */

define(['osm/OSMConverter', 'osm/OSMMarker'], function (OSMConverter, OSMMarker) {
    'use strict';

    var OSMMap = function (options) {
        var self = this;

        self._nativeMap = new OpenLayers.Map(options.htmlContainer.getAttribute('id'));
        self._nativeMap.displayProjection = new OpenLayers.Projection("EPSG:4326");
        self._nativeMap.addLayer(new OpenLayers.Layer.OSM());

        var zoom = options.zoomLevel;
        var markers = [];

        var nativeMarkerLayer = new OpenLayers.Layer.Markers("Markers");
        self._nativeMap.addLayer(nativeMarkerLayer);

        var osmConverter = new OSMConverter(self._nativeMap);
        self._nativeMap.setCenter(osmConverter.toOsmLonLat(options.center), zoom);

        this.getArea = function () {
            // this only works when map is not rotated (north at top)
            var bounds = self._nativeMap.getExtent();

            return {
                northEast: osmConverter.toGeoPosition(new OpenLayers.LonLat(bounds.right, bounds.top)),
                southWest: osmConverter.toGeoPosition(new OpenLayers.LonLat(bounds.left, bounds.bottom))
            };
        };

        var clickListeners = [];
        var clickControl;
        function getClickControl() {
            if (!clickControl) {
                OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                    defaultHandlerOptions: {
                        'single': true,
                        'double': false,
                        'pixelTolerance': 0,
                        'stopSingle': false,
                        'stopDouble': false
                    },
                    initialize: function (options) {
                        this.handlerOptions = OpenLayers.Util.extend(
                                {}, this.defaultHandlerOptions
                                );
                        OpenLayers.Control.prototype.initialize.apply(
                                this, arguments
                                );
                        this.handler = new OpenLayers.Handler.Click(
                                this, {
                                    'click': this.trigger
                                }, this.handlerOptions
                                );
                    },
                    trigger: function (event) {
                        var lonlat = self._nativeMap.getLonLatFromPixel(event.xy);
                        for (var i = 0; i < clickListeners.length; i++) {
                            clickListeners[i](osmConverter.toGeoPosition(lonlat));
                        }
                    }

                });
                clickControl = new OpenLayers.Control.Click();
                self._nativeMap.addControl(clickControl);
                clickControl.activate();
            }
            return clickControl;
        }

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                self._nativeMap.events.register("moveend", self._nativeMap, listener);
                self._nativeMap.events.register("zoomend", self._nativeMap, listener);
            } else if (event === 'click') {
                getClickControl();
                clickListeners.push(listener);
            } else {
                throw 'unknown event: ' + event;
            }
        };

        // TODO remove listener function

        this.addMarker = function (geoPosition, title) {
            var marker = new OSMMarker(osmConverter, nativeMarkerLayer, geoPosition, title);
            markers.push(marker);
            return marker;
        };

        this.getMarkers = function () {
            return markers.slice();
        };

        this.clearAllMarkers = function () {
            // TODO could be improved ?!
            self._nativeMap.removeLayer(nativeMarkerLayer);
            nativeMarkerLayer.destroy();
            nativeMarkerLayer = new OpenLayers.Layer.Markers("Markers");
            self._nativeMap.addLayer(nativeMarkerLayer);
            markers = [];
        };

        this._triggerMouseClick = function (geoPosition) {
            var lonLat = osmConverter.toOsmLonLat(geoPosition);
            var pixel = self._nativeMap.getPixelFromLonLat(lonLat);
            self._nativeMap.events.triggerEvent('click', {xy: pixel});
        };
    };

    return OSMMap;
});


