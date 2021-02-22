const gulp        = require('gulp');
const concat      = require("gulp-concat");
const uglify      = require("gulp-uglify-es").default;
const browserSync = require('browser-sync').create();
const TestServer  = require("karma").Server;


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
        .pipe(gulp.dest("dist/"));
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
 * @description テストを実行
 * @public
 */
function test (done)
{
    new TestServer({
        "configFile": __dirname + "/karma.conf.js",
        "singleRun": false
    }, done).start();
}

exports.default = gulp.series(
    buildJavaScript,
    browser,
    watchFiles
);

exports.test = gulp.series(test);