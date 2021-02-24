const gulp        = require('gulp');
const concat      = require("gulp-concat");
const uglify      = require("gulp-uglify-es").default;
const browserSync = require('browser-sync').create();
const TestServer  = require("karma").Server;
const jsdoc       = require("gulp-jsdoc3");

/**
 * @description JavaScriptをまとめてminifyして出力
 * @public
 */
function buildJavaScript()
{
    return gulp.src([
            "src/**/*.js"
        ])
        .pipe(concat("next2d.js"))
        // .pipe(uglify({ "output": { "comments": /^!/ } }))
        .pipe(gulp.dest("."));
}

/**
 * @description local serverを起動
 * @return {void}
 * @public
 */
function browser (done)
{
    browserSync.init({
        "server": {
            "baseDir": ".",
            "index": "index.html"
        },
        "reloadOnRestart": true,
    });
    done();
}

/**
 * @description local serverを再読込
 * @return {void}
 * @public
 */
function reload (done)
{
    browserSync.reload();
    done();
}

/**
 * @description ファイルを監視、変更があればビルドしてlocal serverを再読込
 * @public
 */
function watchFiles ()
{
    return gulp.watch("src/**/*.js")
        .on("change", gulp.series(buildJavaScript, reload));
}

/**
 * @public
 */
function createHTML (done)
{
    return gulp
        .src([
            "src/**/*.js",
            "!src/util/*.js",
            "README.md"
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
                "applicationName": "Next2D",
                "disqus": "",
                "googleAnalytics": "",
                "favicon": "",
                "openGraph": {
                    "title": "Next2D Player API Documentation",
                    "type": "website",
                    "image": "",
                    "site_name": "Next2D Player API Documentation",
                    "url": "https://next2d.app/"
                },
                "meta": {
                    "title": "Next2D Player API Documentation",
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
                "destination": "../next2d/doc/player/",
                "template": "node_modules/@pixi/jsdoc-template"
            }
        }, done));
}

/**
 * @description テストを実行
 * @public
 */
function test (done)
{
    new TestServer({
        "configFile": __dirname + "/karma.conf.js",
        "singleRun": true
    }, done).start();
}


exports.default = gulp.series(
    buildJavaScript,
    browser,
    watchFiles
);
exports.test  = gulp.series(test);
exports.jsdoc = gulp.series(createHTML);