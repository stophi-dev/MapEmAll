/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

'use strict';

var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var requirejsModuleName = '../' + file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(requirejsModuleName);
        console.log('Add test file: ' + file);
        console.log('RequireJS path: ' + requirejsModuleName);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/src',
    // dynamically load all test files
    deps: allTestFiles,
    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
