/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define([], function () {
    'use strict';

    // helper function: make random IDs
    function makeId(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    // helper function: load JS file
    function loadjsfile(filename, onload) {

        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        if (typeof onload === 'function') {
            fileref.onload = onload;
        }
        fileref.setAttribute("src", filename);

        if (typeof fileref !== "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }

    return {
        loadjsfile: loadjsfile,
        makeId: makeId
    };
});

