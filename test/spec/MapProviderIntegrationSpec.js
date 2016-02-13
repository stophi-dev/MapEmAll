/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global expect, assert */

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

            it('get the area (geo coordinates) of the visible view port', function (done) {                
                var area = map.getArea();

                var northEast = area.northEast;
                expect(northEast.latitude).to.be.greaterThan(center.latitude);
                expect(northEast.longitude).to.be.greaterThan(center.longitude);

                var southWest = area.southWest;
                expect(southWest.latitude).to.be.lessThan(center.latitude);
                expect(southWest.longitude).to.be.lessThan(center.longitude);
                done();
            });

            it('add a click listener to the map', function (done) {
                expect(map.addListener).to.be.a('function');

                var clickListener = function (geoPosition) {                    
                    assert.closeTo(geoPosition.latitude, center.latitude, 8);
                    assert.closeTo(geoPosition.longitude, center.longitude, 8);
                    done();
                };
                
                map.addListener('click', clickListener);
                map._triggerMouseClick(center);
            });

            it('add a marker to the map', function (done) {
                expect(map.addMarker).to.be.a('function');

                var marker = map.addMarker(center, 'marker_title');
                expect(marker).to.be.an('object');
                expect(marker.getGeoPosition).to.be.a('function');
                expect(marker.setGeoPosition).to.be.a('function');
                expect(marker.getTitle).to.be.a('function');
                expect(marker.setTitle).to.be.a('function');
                expect(marker.getTitle()).to.equal('marker_title');
                assert.closeTo(marker.getGeoPosition().latitude, center.latitude, 8);
                assert.closeTo(marker.getGeoPosition().longitude, center.longitude, 8);
                done();
            });

            it('set the position of a marker on the map', function (done) {
                var marker = map.addMarker(center, 'marker2');
                var newPosition = {latitude: center.latitude + 0.01, longitude: center.longitude + 0.01};
                marker.setGeoPosition(newPosition);

                assert.closeTo(marker.getGeoPosition().latitude, newPosition.latitude, 8);
                assert.closeTo(marker.getGeoPosition().longitude, newPosition.longitude, 8);
                done();
            });

            it('set the title of a marker on the map', function (done) {
                var marker = map.addMarker(center, 'old title');
                marker.setTitle('new title');

                expect(marker.getTitle()).to.equal('new title');
                done();
            });
        });
    });

});


