/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global expect */

define(['Main'], function (MapEmAll) {
    'use strict';

    var center = {latitude: 48.163166, longitude: 11.58289};

    MapEmAll.getMapProviders().forEach(function (mapProvider) {

        describe('A loaded ' + mapProvider + ' map', function () {
            var map;

            beforeEach(function (done) {
                this.timeout(10000);

                var mapContainer = document.createElement('div');
                mapContainer.setAttribute('id', 'MapEmAll');
                mapContainer.setAttribute('style', 'height: 100px');

                var body = document.getElementsByTagName('body')[0];
                body.setAttribute('style', 'height: 100px');
                body.appendChild(mapContainer);

                MapEmAll.provider = mapProvider;
                MapEmAll.center = center;
                MapEmAll.loadMap(function (loadedMap) {
                    map = loadedMap;
                    done();
                });
            });

            afterEach(function (done) {
                var element = document.getElementById("MapEmAll");
                element.parentNode.removeChild(element);
                done();
            });

            it('should be able to give the area (geo coordinates) of the visible view port', function (done) {
                expect(map.getArea).to.be.a('function');

                var area = map.getArea();
                expect(area).to.be.an('object');

                var northEast = area.northEast;
                expect(northEast).to.be.an('object');
                expect(northEast).to.have.property('latitude');
                expect(northEast).to.have.property('longitude');
                expect(northEast.latitude).to.be.greaterThan(center.latitude);
                expect(northEast.longitude).to.be.greaterThan(center.longitude);

                var southWest = area.southWest;
                expect(southWest).to.be.an('object');
                expect(southWest).to.have.property('latitude');
                expect(southWest).to.have.property('longitude');
                expect(southWest.latitude).to.be.lessThan(center.latitude);
                expect(southWest.longitude).to.be.lessThan(center.longitude);
                done();
            });
        });
    });

});


