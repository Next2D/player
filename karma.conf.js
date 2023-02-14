// Karma configuration
// Generated on Mon Feb 22 2021 16:38:05 GMT+0900 (JST)

module.exports = function (config)
{
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        "basePath": "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        "frameworks": ["jasmine"],

        // list of files / patterns to load in the browser
        "files": [
            "src/util/Global.js",
            "src/util/Util.replaced.js",
            "src/next2d/events/*.js",
            "src/next2d/geom/*.js",
            "src/next2d/display/DisplayObject.js",
            "src/next2d/display/InteractiveObject.js",
            "src/next2d/display/DisplayObjectContainer.js",
            "src/next2d/display/Sprite.js",
            "src/next2d/display/MovieClip.js",
            "src/next2d/display/*.js",
            "src/next2d/filters/BitmapFilter.js",
            "src/next2d/filters/BitmapFilterType.js",
            "src/next2d/filters/BitmapFilterQuality.js",
            "src/next2d/filters/DisplacementMapFilterMode.js",
            "src/next2d/filters/BlurFilter.js",
            "src/next2d/filters/*.js",
            "src/next2d/text/TextFormatAlign.js",
            "src/next2d/text/TextFieldAutoSize.js",
            "src/next2d/text/*.js",
            "src/next2d/**/*.js",
            "src/util/CacheStore.js",
            "src/webgl/**/*.js",
            "src/player/Player.js",
            "src/player/Next2D.js",
            "test/**/*.js"
        ],

        // list of files / patterns to exclude
        "exclude": [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // "preprocessors": {
        //     "src/**/*.js": ["coverage"]
        // },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // "reporters": ["progress", "coverage"],

        // "coverageReporter": {
        //     "type" : "html",
        //     "dir" : "coverage/"
        // },

        // web server port
        "port": 9876,

        // enable / disable colors in the output (reporters and logs)
        "colors": true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        "logLevel": config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        "autoWatch": true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        "browsers": ["ChromeHeadless", "FirefoxHeadless"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        "singleRun": false,

        // Concurrency level
        // how many browser should be started simultaneous
        "concurrency": Infinity
    });
};
