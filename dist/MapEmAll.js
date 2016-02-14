(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define([], factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.
        root.MapEmAll = factory();
    }
}(this, function () {
    // all modules will be inlined here
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../build/almond", function(){});

/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define('Main',[], function () {
    'use strict';
    var providers = {
        bing: 'bing/Bing',
        google: 'google/Google',
        osm: 'osm/OSM'
    };

    var result = {
        center: {latitude: 0, longitude: 0},
        zoomLevel: 5,
        provider: 'osm',
        htmlContainerId: 'MapEmAll',
        osm: {
            url: 'http://www.openlayers.org/api/OpenLayers.js'
        },
        getMapProviders: function () {
            return Object.keys(providers);
        }
    };

    result.loadMap = function (onMapReadyCallback) {
        onMapReadyCallback = typeof onMapReadyCallback === 'function'
                ? onMapReadyCallback
                : function () {};
        var htmlContainer = document.getElementById(result.htmlContainerId);
        if (htmlContainer === null) {
            throw new Error('Did not find element with id "' + result.htmlContainerId + "'");
        }

        var options = {
            center: result.center,
            zoomLevel: result.zoomLevel,
            credentials: result.credentials,
            htmlContainer: htmlContainer,
            osm: {
                url: result.osm.url
            }
        };
        require([providers[result.provider]], function (mapProvider) {
            mapProvider.loadMap.apply(mapProvider, [options, onMapReadyCallback]);
        });
    };

    return result;
});
/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define('JSLoader',[], function () {
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

        document.getElementsByTagName("head")[0].appendChild(fileref);
    }

    return {
        loadjsfile: loadjsfile,
        makeId: makeId
    };
});


/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define('bing/BingMarker',['JSLoader'], function (loader) {
    'use strict';

    var BingMarker = function (util, geoPosition, title) {
        var self = this;
        var pinId = 'bing_pushpin_' + loader.makeId(20);

        var location = toBingLocation(geoPosition);
        self._nativeMarker = new Microsoft.Maps.Pushpin(location, {id: pinId});
        util._nativeMap.entities.push(self._nativeMarker);

        addTooltipToPin(pinId, title);


        self.setGeoPosition = function (geoPosition) {
            self._nativeMarker.setLocation(toBingLocation(geoPosition));
        };

        self.getGeoPosition = function () {
            return toGeoPosition(self._nativeMarker.getLocation());
        };

        self.getTitle = function () {
            return getTooltipFromPin(pinId);
        };

        self.setTitle = function (title) {
            addTooltipToPin(pinId, title);
        };

        self.addListener = function (eventName, listener) {
            if (eventName === 'click') {
                Microsoft.Maps.Events.addHandler(self._nativeMarker, 'click', function () {
                    listener(self);
                });
            } else {
                throw new Error('unknown event: ' + eventName);
            }
        };

        self._triggerMouseClick = function () {
            util.invokeClickEventOnPushpin(self._nativeMarker, getMarkerPixel());
        };

        function getMarkerPixel() {
            return util._nativeMap.tryLocationToPixel(self._nativeMarker.getLocation());
        }
    };


    function addTooltipToPin(pinId, tooltipText) {
        var pinElement = document.getElementById(pinId);
        var children = Array.prototype.slice.call(pinElement.childNodes);
        children.forEach(function (child) {
            child.setAttribute('title', tooltipText);
            child.style.cursor = 'pointer';
        });
    }

    function getTooltipFromPin(pinId) {
        var pinElement = document.getElementById(pinId);
        var children = Array.prototype.slice.call(pinElement.childNodes);
        for (var i = 0; i < children.length; i++) {
            var title = children[i].getAttribute('title');
            if (title) {
                return title;
            }
        }
        return '';
    }

    function toBingLocation(geoPosition) {
        return new Microsoft.Maps.Location(geoPosition.latitude, geoPosition.longitude);
    }

    function toGeoPosition(bingLocation) {
        return {latitude: bingLocation.latitude, longitude: bingLocation.longitude};
    }

    return BingMarker;
});



/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define('bing/BingMapUtil',[],function () {

    var BingMapUtil = function (nativeBingMap) {
        var self = this;
        self._nativeMap = nativeBingMap;

        self.toGeoPosition = function (bingLocation) {
            return {
                latitude: bingLocation.latitude,
                longitude: bingLocation.longitude
            };
        };

        self.pixelToGeoPosition = function (pixelX, pixelY) {
            var point = new Microsoft.Maps.Point(pixelX, pixelY);
            var bingLocation = self._nativeMap.tryPixelToLocation(point);
            return self.toGeoPosition(bingLocation);
        };

        self.invokeClickEventOnMap = function (pixel) {
            invokeClickEvent(self._nativeMap, 'map', pixel);
        };

        self.invokeClickEventOnPushpin = function (pushpin, pixel) {
            invokeClickEvent(pushpin, 'pushpin', pixel);
        };

        /**
         * Invoke a mouse click event (used for testing)
         * 
         * @param {type} targetBingElement element that should be clicked
         * @param {type} targetType The type of the object that fired the event. 
         * Valid values include the following: ‘map’, ‘polygon’, ‘polyline’, or ‘pushpin’
         * @param {type} pixel where the click event should be invoked
         * @returns {undefined}
         */
        function invokeClickEvent(targetBingElement, targetType, pixel) {
            Microsoft.Maps.Events.invoke(targetBingElement, 'click', {
                eventName: 'click',
                getX: function () {
                    return pixel.x;
                },
                getY: function () {
                    return pixel.y;
                },
                isPrimary: true,
                isSecondary: false,
                isTouchEvent: false,
                mouseMoved: false,
                originalEvent: null,
                pageX: 0,
                pageY: 0,
                target: targetBingElement,
                targetType: targetType,
                wheelDelta: 0
            });
        }
        ;
    };

    return BingMapUtil;
});

/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define('bing/BingMap',['./BingMarker', './BingMapUtil'], function (BingMarker, BingMapUtil) {
    'use strict';

    var BingMap = function BingMap(options) {
        var self = this;
        var markers = [];

        var mapOptions = {
            credentials: options.credentials,
            center: new Microsoft.Maps.Location(options.center.latitude, options.center.longitude),
            zoom: options.zoomLevel
        };

        self._nativeMap = new Microsoft.Maps.Map(options.htmlContainer, mapOptions);

        var util = new BingMapUtil(self._nativeMap);

        self.getArea = function () {
            var bounds = self._nativeMap.getBounds();
            return {
                northEast: {
                    latitude: bounds.getNorth(),
                    longitude: bounds.getEast()
                },
                southWest: {
                    latitude: bounds.getSouth(),
                    longitude: bounds.getWest()
                }
            };
        };

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                var wrappedListener = function () {
                    listener();
                };
                Microsoft.Maps.Events.addHandler(self._nativeMap, 'viewchangeend', wrappedListener);

            } else if (event === 'click') {
                var wrappedListener = function (event) {
                    if (event.targetType === "map") {
                        listener(util.pixelToGeoPosition(event.getX(), event.getY()));
                    }
                };
                Microsoft.Maps.Events.addHandler(self._nativeMap, 'click', wrappedListener);
            } else {
                throw 'unknown event: ' + event;
            }
        };

        self.getMarkers = function () {
            return markers.slice();
        };

        self.addMarker = function (geoPosition, title) {
            var result = new BingMarker(util, geoPosition, title);
            markers.push(result);
            return result;
        };

        self.clearAllMarkers = function () {
            self._nativeMap.entities.clear();
            markers = [];
        };

        self._triggerMouseClick = function (geoPosition) {
            var pixel = self._nativeMap.tryLocationToPixel(geoPosition);
            util.invokeClickEventOnMap(pixel);
        };
    };

    return BingMap;
});



/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define('bing/Bing',['JSLoader', 'bing/BingMap'], function (loader, BingMap) {
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
/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global google */

define('google/GoogleMarker',[],function () {
    'use strict';

    function GoogleMarker(providerMap, geoPosition, title) {
        var self = this;

        self._nativeMarker = new google.maps.Marker({
            position: {lat: geoPosition.latitude, lng: geoPosition.longitude},
            map: providerMap,
            title: title
        });

        self.setGeoPosition = function (geoPosition) {
            self._nativeMarker.setPosition({
                lat: geoPosition.latitude,
                lng: geoPosition.longitude});
        };

        self.getGeoPosition = function () {
            return {
                latitude: self._nativeMarker.position.lat(),
                longitude: self._nativeMarker.position.lng()};
        };

        self.getTitle = function () {
            return self._nativeMarker.getTitle();
        };

        self.setTitle = function (title) {
            self._nativeMarker.setTitle(title);
        };

        self.addListener = function (eventName, listener) {
            if (eventName === 'click') {
                self._nativeMarker.addListener('click', function () {
                    listener(self);
                });
            } else {
                throw new Error('unknown event: ' + eventName);
            }
        };

        self._triggerMouseClick = function () {
            google.maps.event.trigger(self._nativeMarker, 'click', {
                latLng: self._nativeMarker.position
            });
        };
    }

    return GoogleMarker;

});




/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global google */

define('google/GoogleMap',['./GoogleMarker'], function (GoogleMarker) {
    'use strict';

    var GoogleMap = function (options) {
        var self = this;
        var markers = [];

        this._nativeMap = new google.maps.Map(options.htmlContainer, {
            center: {lat: options.center.latitude, lng: options.center.longitude},
            zoom: options.zoomLevel
        });

        this.getArea = function () {
            var northEast = self._nativeMap.getBounds().getNorthEast();
            var southWest = self._nativeMap.getBounds().getSouthWest();
            return {
                northEast: {
                    latitude: northEast.lat(),
                    longitude: northEast.lng()
                },
                southWest: {
                    latitude: southWest.lat(),
                    longitude: southWest.lng()
                }
            };
        };

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                var timeout;
                var wrappedListener = function () {
                    // - debounces google maps event
                    // - hides potential arguments from google API from this API
                    clearTimeout(timeout);
                    timeout = setTimeout(listener, 100);
                };
                self._nativeMap.addListener('bounds_changed', wrappedListener);
            } else if (event === 'click') {
                var wrappedListener = function (location) {
                    listener({latitude: location.latLng.lat(),
                        longitude: location.latLng.lng()});
                };
                self._nativeMap.addListener('click', wrappedListener);
            } else {
                throw 'unknown event: ' + event;
            }
        };


        // TODO function to remove listeners

        this.addMarker = function (geoPosition, title) {
            var newMarker = new GoogleMarker(self._nativeMap, geoPosition, title);
            markers.push(newMarker);
            return newMarker;
        };

        this.getMarkers = function () {
            return markers.slice();
        };

        this.clearAllMarkers = function () {
            for (var i = 0; i < markers.length; i++) {
                markers[i]._nativeMarker.setMap(null);
            }
            markers = [];
        };

        this._triggerMouseClick = function (geoPosition) {
            google.maps.event.trigger(self._nativeMap, 'click', {
                latLng: new google.maps.LatLng(geoPosition.latitude, geoPosition.longitude)
            });
        };
    };

    return GoogleMap;
});



/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global google */

define('google/Google',['JSLoader', './GoogleMap'], function (loader, GoogleMap) {
    'use strict';

    return {
        loadMap: function (options, callback) {
            var callbackName = 'initGoogleMap_' + loader.makeId(10);
            window[callbackName] = function () {
                delete window[callbackName];
                var googleMap = new GoogleMap(options);

                google.maps.event.addListenerOnce(googleMap._nativeMap, "bounds_changed", function () {
                    // for compatibility with other APIs: getArea() should be ready immediately:
                    callback(googleMap);
                });
            };
            var keyStr = options.credentials ? 'key=' + options.credentials + '&' : '';
            loader.loadjsfile('https://maps.googleapis.com/maps/api/js?' + keyStr + 'callback=' + callbackName);
        }
    };

});
/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global OpenLayers */

define('osm/OSMConverter',[],function () {
    'use strict';

    function OSMConverter(osmMap) {
        var self = this;
        self.osmMap = osmMap;

        self.toOsmLonLat = function (geoPosition) {
            return new OpenLayers.LonLat(geoPosition.longitude, geoPosition.latitude)
                    .transform(
                            osmMap.displayProjection, // transform from WGS 1984
                            osmMap.getProjectionObject() // to Spherical Mercator Projection
                            );
        };

        self.toGeoPosition = function (osmLonLat) {
            // Need new lonlat so that original osmLonLat is not affected by transformation
            var lonLatClone = new OpenLayers.LonLat(osmLonLat.lon, osmLonLat.lat);

            var position = lonLatClone.transform(
                    osmMap.getProjectionObject(),
                    osmMap.displayProjection);
            return {
                latitude: position.lat,
                longitude: position.lon
            };

        };
    }
    ;

    return OSMConverter;
});

/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global OpenLayers */

define('osm/OSMMarker',[],function () {
    'use strict';

    function OSMMarker(osmConverter, nativeMarkerLayer, geoPosition, initialTitle) {
        var self = this;
        var markerTitle = initialTitle;

        self._nativeMarker = new OpenLayers.Marker(osmConverter.toOsmLonLat(geoPosition));
        nativeMarkerLayer.addMarker(self._nativeMarker);

        self.setGeoPosition = function (geoPosition) {
            nativeMarkerLayer.removeMarker(self._nativeMarker);
            self._nativeMarker.lonlat = osmConverter.toOsmLonLat(geoPosition);
            nativeMarkerLayer.addMarker(self._nativeMarker);
        };

        self.getGeoPosition = function () {

            var geoPosition = osmConverter.toGeoPosition(self._nativeMarker.lonlat);
            return geoPosition;
        };

        self.getTitle = function () {
            var children = getImageElements();
            for (var i = 0; i < children.length; i++) {
                var title = children[i].getAttribute('title');
                if (title) {
                    return title;
                }
            }
            return '';
        };

        self.setTitle = function (title) {
            getImageElements().forEach(function (child) {
                child.setAttribute('title', title);
                child.style.cursor = 'pointer';
            });
        };

        function getImageElements() {
            var imageDiv = self._nativeMarker.icon.imageDiv;
            return Array.prototype.slice.call(imageDiv.childNodes);
        }

        self.addListener = function (eventName, listener) {
            if (eventName === 'click') {
                self._nativeMarker.events.register('click', null, function () {
                    listener(self);
                });
            } else {
                throw new Error('unknown event: ' + eventName);
            }
        };

        self._triggerMouseClick = function () {
            var pixel = osmConverter.osmMap.getPixelFromLonLat(self._nativeMarker.lonlat);
            self._nativeMarker.events.triggerEvent('click', {xy: pixel});
        };

        self.setTitle(initialTitle);
    }

    return OSMMarker;

});
/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global OpenLayers */

define('osm/OSMMap',['osm/OSMConverter', 'osm/OSMMarker'], function (OSMConverter, OSMMarker) {
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



/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define('osm/OSM',['JSLoader', 'osm/OSMMap'], function (loader, OSMMap) {
    'use strict';

    return {
        loadMap: function (options, callback) {
            loader.loadjsfile(options.osm.url, function () {
                callback(new OSMMap(options));
            });
        }
    };

});
    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('Main');
}));
