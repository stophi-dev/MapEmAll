/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define(['JSLoader', 'osm/OSMMap'], function (loader, OSMMap) {
    'use strict';

    return {
        loadMap: function (options, callback) {
            loader.loadjsfile(options.osm.url, function () {
                callback(new OSMMap(options));
            });
        }
    };

});