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


const options = minimist(process.argv.slice(2), {
    "string": ["distPath"],
    "boolean": ["debugBuild", "prodBuild", "glErrorCheck", "glTrace"],
    "default": {
        "debugBuild": true,
        "prodBuild": false,
        "glErrorCheck": false,
        "glTrace": false,
        "distPath": "."
    }
});

const date = new Date();
const time = Math.round(date.getTime() / 1000);

/**
 * @description 書き出した時間でバージョンを書き出す
 * @public
 */
function buildFooterVersion()
{
    return gulp.src("src/Footer.file")
        .pipe(replace("###BUILD_VERSION###", time))
        .pipe(rename("src/Footer.build.file"))
        .pipe(gulp.dest("."));
}

/**
 * @description 書き出した時間でバージョンを書き出す
 * @public
 */
function buildHeaderVersion()
{
    return gulp.src("src/Header.file")
        .pipe(replace("###BUILD_VERSION###", time))
        .pipe(replace("###BUILD_YEAR###", date.getFullYear()))
        .pipe(rename("src/Header.build.file"))
        .pipe(gulp.dest("."));
}

/**
 * @description JavaScriptをまとめてminifyして出力
 * @public
 */
function buildJavaScript()
{
    const preprocessContext = {};
    if (options.debugBuild) {
        preprocessContext.DEBUG = true;
    }
    if (options.glErrorCheck) {
        preprocessContext.GL_ERROR_CHECK = true;
    }
    if (options.glTrace) {
        preprocessContext.TRACE_GL = true;
    }



    const build = gulp.src([
            "src/Header.build.file",
            "src/util/Util.js",
            "src/next2d/events/*.js",
            "src/next2d/geom/*.js",
            "src/next2d/display/DisplayObject.js",
            "src/next2d/display/InteractiveObject.js",
            "src/next2d/display/DisplayObjectContainer.js",
            "src/next2d/display/Sprite.js",
            "src/next2d/display/MovieClip.js",
            "src/next2d/display/GraphicsPathCommand.js",
            "src/next2d/display/*.js",
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
            "src/next2d/**/*.js",
            "src/player/**/*.js",
            "!src/util/*.js",
            "!src/webgl/**/*.js",
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
    buildHeaderVersion,
    buildFooterVersion,
    buildJavaScript,
    browser,
    watchFiles
);
exports.test  = gulp.series(test);
exports.jsdoc = gulp.series(createHTML);