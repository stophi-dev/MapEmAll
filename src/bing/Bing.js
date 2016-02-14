/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define(['JSLoader', 'bing/BingMap'], function (loader, BingMap) {
    'use strict';

    function preventMapToBeGloballyAbsolute(htmlElement) {
        var style = window.getComputedStyle(htmlElement, null);
        if (style.position === 'static') {
            htmlElement.style.position = 'relative';
        }
    }

    return {
        loadMap: function (options, callback) {
            var callbackName = 'initBingMap_' + loader.makeId(10);

            // Bing maps positions the map absolute.
            // To prevent overlaps and to get a similar behavior like
            // other providers, we adjust the position of htmlContainer:
            preventMapToBeGloballyAbsolute(options.htmlContainer);

            window[callbackName] = function () {
                delete window[callbackName];
                callback(new BingMap(options));
            };
            loader.loadjsfile('https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1&onscriptload=' + callbackName);
        }
    };
});