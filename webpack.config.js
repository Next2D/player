const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const WebpackWorkerLoaderPlugin = require("@next2d/webpack-worker-loader-plugin");

const unzip_worker = {
    "mode": "production",
    "entry": path.resolve(__dirname, "worker/unzip/src/index.ts"),
    "output": {
        "filename": "UnzipWorker.min.js",
        "path": path.resolve(__dirname, "worker/unzip")
    },
    "cache": {
        "type": "filesystem",
        "buildDependencies": {
            "config": [__filename]
        }
    },
    "plugins": [
        new ESLintPlugin({
            "extensions": [".ts"],
            "exclude": "node_modules"
        })
    ],
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loader": "ts-loader",
                "options": {
                    "configFile": path.resolve(__dirname, "worker/unzip/tsconfig.json")
                }
            }
        ]
    },
    "performance": {
        "hints": false
    }
};

const render_worker = {
    "mode": "production",
    "entry": path.resolve(__dirname, "worker/renderer/src/index.ts"),
    "output": {
        "filename": "RendererWorker.min.js",
        "path": path.resolve(__dirname, "worker/renderer")
    },
    "cache": {
        "type": "filesystem",
        "buildDependencies": {
            "config": [__filename]
        }
    },
    "plugins": [
        new ESLintPlugin({
            "extensions": [".ts"],
            "exclude": "node_modules"
        })
    ],
    "resolve": {
        "alias": {
            "@": path.resolve(__dirname, "worker/renderer")
        },
        "extensions": [".ts", ".js"]
    },
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loader": "ts-loader",
                "options": {
                    "configFile": path.resolve(__dirname, "worker/renderer/tsconfig.json")
                }
            }
        ]
    },
    "performance": {
        "hints": false
    }
};

const player = {
    "mode": "development",
    "entry": path.resolve(__dirname, "src/index.ts"),
    "output": {
        "filename": "next2d.js",
        "path": __dirname
    },
    "cache": {
        "type": "filesystem",
        "buildDependencies": {
            "config": [__filename]
        }
    },
    "plugins": [
        new ESLintPlugin({
            "extensions": [".ts"],
            "exclude": "node_modules"
        }),
        // new WebpackWorkerLoaderPlugin()
    ],
    "resolve": {
        "alias": {
            "@": path.resolve(__dirname, "src")
        },
        "extensions": [".ts", ".js"]
    },
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loader": "ts-loader",
                "options": {
                    "configFile": path.resolve(__dirname, "src/tsconfig.json")
                }
            }
        ]
    },
    "devServer": {
        "static": [
            { "directory": __dirname }
        ],
        "historyApiFallback": true,
        "compress": false,
        "open": true
    },
    "performance": {
        "hints": false
    }
};

module.exports = [render_worker, player];