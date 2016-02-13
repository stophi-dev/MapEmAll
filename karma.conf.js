// Karma configuration

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'requirejs', 'chai-sinon'],
        // list of files / patterns to load in the browser
        files: [
            'test/TestMain.js',
            {pattern: 'src/**/*.js', included: false, served: true},
            {pattern: 'test/**/*.js', included: false, served: true}
        ],
        // list of files to exclude
        exclude: [
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {'src/**/*.js': ['coverage']},
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'html', 'coverage'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
        coverageReporter: {
            dir: 'results/coverage/',
            reporters: [
                {type: 'html', subdir: 'html'},
                {type: 'lcovonly', subdir: 'lcov'},
                {type: 'cobertura', subdir: 'cobertura'}
            ]
        },
        htmlReporter: {
            outputFile: 'results/TestSpec.html',
            pageTitle: 'MapEmAll Test Specification',
            subPageTitle: 'One Map API for Google, Bing and OpenStreetMap'
        }
    });
};
