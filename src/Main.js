/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Philip Stöhrer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

define([], function () {
    'use strict';
    var providers = {
        bing: 'provider/Bing',
        google: 'provider/Google',
        osm: 'provider/OSM'
    };

    var result = {
        center: {latitude: 48.163166, longitude: 11.58289},
        provider: 'osm',
        htmlContainerId: 'MapEmAll'
    };

    result.loadMap = function (onMapReadyCallback) {

        var htmlContainer = document.getElementById(result.htmlContainerId);
        if (htmlContainer === null) {
            throw new Error('Did not find element with id "' + result.htmlContainerId + "'");
        }

        var options = {
            center: result.center,
            credentials: result.credentials,
            htmlContainer: htmlContainer
        };
        require([providers[result.provider]], function (mapProvider) {
            mapProvider.loadMap.apply(mapProvider, [options, onMapReadyCallback]);
        });
    };

    return result;
});