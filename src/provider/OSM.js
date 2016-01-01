/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define(['JSLoader', 'provider/OSMap'], function (loader, OSMap) {
    'use strict';

    return {
        loadMap: function (options, callback) {
            loader.loadjsfile('http://www.openlayers.org/api/OpenLayers.js', function () {
                callback(new OSMap(options));
            });
        }
    };

});