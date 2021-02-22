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
            "!src/util/*.js"
        ], { "read": false })
        .pipe(jsdoc({
            "opts": {
                "destination": "docs/"
            },
            "plugins": [
                "plugins/markdown"
            ],
            "markdown": {
                "hardwrap": true
            },
            "templates": {
                "footer": "version: 1.0.0",
                "copyright": "(c) 2021 Next2D.",
                "systemName": "Next2D",
                "outputSourceFiles": true,
                "outputSourcePath": true,
                "path": "ink-docstrap",
                "theme": "slate",
                "navType": "vertical",
                "linenums": true
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