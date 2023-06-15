"use strict";

module.exports = {
    "plugins": [
        "plugins/markdown"
    ],
    "markdown": {
        "hardwrap": true
    },
    "templates": {
        "cleverLinks"   : false,
        "monospaceLinks": false,
        "applicationName": "Next2D Framework",
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
};
