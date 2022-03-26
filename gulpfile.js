"use strict";

const gulp        = require("gulp");
const concat      = require("gulp-concat");
const uglify      = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const TestServer  = require("karma").Server;
const jsdoc       = require("gulp-jsdoc3");
const preprocess  = require("gulp-preprocess");
const minimist    = require("minimist");
const replace     = require("gulp-replace");
const rename      = require("gulp-rename");
const eslint      = require("gulp-eslint");
const fs          = require("fs");

const options = minimist(process.argv.slice(2), {
    "boolean": ["prodBuild", "glErrorCheck", "glTrace"],
    "string": ["distPath", "version"],
    "default": {
        "prodBuild": false,
        "glErrorCheck": false,
        "glTrace": false,
        "version": "1.11.2",
        "distPath": "."
    }
});

/**
 * @description フッターの書き出し
 * @public
 */
const buildFooterVersion = () =>
{
    return gulp
        .src("src/Footer.file")
        .pipe(replace("###BUILD_VERSION###", options.version))
        .pipe(rename("src/Footer.build.file"))
        .pipe(gulp.dest("."));
};

/**
 * @description ヘッダーの書き出し
 * @public
 */
const buildHeaderVersion = () =>
{
    return gulp
        .src("src/Header.file")
        .pipe(replace("###BUILD_VERSION###", options.version))
        .pipe(replace("###BUILD_YEAR###", new Date().getFullYear()))
        .pipe(rename("src/Header.build.file"))
        .pipe(gulp.dest("."));
};

/**
 * @description Workerファイルをminifyにして書き出し
 * @public
 */
const buildWorkerFile = () =>
{
    return gulp
        .src([
            "src/worker/*.js",
            "!src/worker/*.min.js"
        ])
        .pipe(uglify())
        .pipe(rename({ "extname": ".min.js" }))
        .pipe(gulp.dest("src/worker"));
};

/**
 * @description Util.jsの書き出し
 * @public
 */
const buildUtilFile = () =>
{
    return gulp
        .src("src/util/Util.js")
        .pipe(replace("###UNZIP_WORKER###",
            fs.readFileSync("src/worker/UnzipWorker.min.js", "utf8")
                .replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/\n/g, ""))
        )
        .pipe(rename("src/util/Util.replaced.js"))
        .pipe(gulp.dest("."));
};

/**
 * @description ESLintを実行
 * @public
 */
const lint = () =>
{
    return gulp
        .src([
            "src/util/Global.js",
            "src/util/Util.js",
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
            "src/player/Next2D.js"
        ])
        .pipe(eslint({ "useEslintrc": true }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
};

/**
 * @description JavaScriptをまとめてminifyして出力
 * @public
 */
const buildJavaScript = () =>
{
    // setup
    const preprocessContext = {};

    preprocessContext.DEBUG = !options.prodBuild;

    if (options.glErrorCheck) {
        preprocessContext.GL_ERROR_CHECK = true;
    }

    if (options.glTrace) {
        preprocessContext.TRACE_GL = true;
    }

    if (options.prodBuild) {
        preprocessContext.GL_ERROR_CHECK = false;
        preprocessContext.TRACE_GL       = false;
    }

    const build = gulp
        .src([
            "src/Header.build.file",
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
            "src/Footer.build.file"
        ])
        .pipe(concat("next2d.js"))
        .pipe(preprocess({ "context": preprocessContext }));

    if (options.prodBuild) {
        build
            .pipe(uglify({ "output": { "comments": /^!/ } }));
    }

    return build
        .pipe(gulp.dest(options.distPath));
};

/**
 * @description local serverを起動
 * @return {void}
 * @public
 */
const browser = (done) =>
{
    browserSync.init({
        "server": {
            "baseDir": ".",
            "index": "index.html"
        },
        "reloadOnRestart": true
    });
    done();
};

/**
 * @description local serverを再読込
 * @return {void}
 * @public
 */
const reload = (done) =>
{
    browserSync.reload();
    done();
};

/**
 * @description ファイルを監視、変更があればビルドしてlocal serverを再読込
 * @public
 */
const watchFiles = () =>
{
    return gulp
        .watch([
            "src/**/*.js",
            "!src/worker/**/*min.js",
            "!src/util/Util.replaced.js"
        ])
        .on("change", gulp.series(
            lint,
            buildWorkerFile,
            buildUtilFile,
            buildJavaScript,
            reload
        ));
};

/**
 * @public
 */
const createHTML = (done) =>
{
    return gulp
        .src([
            "src/next2d/**/*.js",
            "src/player/**/*.js",
            "!src/util/*.js",
            "!src/webgl/**/*.js",
            "!src/worker/**/*.js",
            "DOCS.md"
        ], { "read": false })
        .pipe(jsdoc({
            "plugins": [
                "plugins/markdown"
            ],
            "markdown": {
                "hardwrap": true
            },
            "templates": {
                "cleverLinks"   : false,
                "monospaceLinks": false,
                "applicationName": "Next2D Player",
                "path": "../../../",
                "openGraph": {
                    "title": "Player API Documentation",
                    "description": "Player API Documentation.",
                    "type": "website",
                    "image": "https://next2d.app/assets/img/ogp.png",
                    "url": "https://next2d.app/"
                },
                "meta": {
                    "title": "Player API Documentation",
                    "description": "Next2D Player API Documentation.",
                    "keyword": "Next2D, WebGL, WebGL2, JavaScript, HTML5"
                },
                "linenums": true,
                "default" : {
                    "outputSourceFiles" : true
                }
            },
            "opts": {
                "encoding": "utf8",
                "recurse": true,
                "private": false,
                "lenient": true,
                "destination": "../next2d/dist/docs/player/",
                "template": "node_modules/@next2d/jsdoc-template"
            }
        }, done));
};

/**
 * @description テストを実行
 * @public
 */
const test = (done) =>
{
    return new TestServer({
        "configFile": __dirname + "/karma.conf.js",
        "singleRun": true
    }, function (error)
    {
        console.log(error);
        done();
    }).start();
};

exports.default = gulp.series(
    buildHeaderVersion,
    buildFooterVersion,
    buildWorkerFile,
    buildUtilFile,
    buildJavaScript,
    browser,
    watchFiles
);
exports.test  = gulp.series(test);
exports.jsdoc = gulp.series(createHTML);
exports.lint  = gulp.series(lint);
exports.build = gulp.series(
    buildHeaderVersion,
    buildFooterVersion,
    buildWorkerFile,
    buildUtilFile,
    buildJavaScript
);
