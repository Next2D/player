const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

const unzip_worker = {
    "mode": "production",
    "entry": path.resolve(__dirname, "src/worker/index.ts"),
    "output": {
        "filename": "UnzipWorker.min.js",
        "path": path.resolve(__dirname, "src/worker")
    },
    "plugins": [
        new ESLintPlugin({
            "extensions": [".ts", ".js"],
            "exclude": "node_modules"
        })
    ],
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loader": "ts-loader",
                "options": {
                    "configFile": path.resolve(__dirname, "src/worker/tsconfig.json")
                }
            }
        ]
    }
};

const render_worker = {
    "mode": "production",
    "entry": path.resolve(__dirname, "src/renderer/index.ts"),
    "output": {
        "filename": "RendererWorker.min.js",
        "path": path.resolve(__dirname, "src/renderer")
    },
    "plugins": [
        new ESLintPlugin({
            "extensions": [".ts", ".js"],
            "exclude": "node_modules"
        })
    ],
    "resolve": {
        "alias": {
            "@": path.resolve(__dirname, "src/renderer")
        },
        "extensions": [".ts", ".js"]
    },
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loader": "ts-loader",
                "options": {
                    "configFile": path.resolve(__dirname, "src/renderer/tsconfig.json")
                }
            }
        ]
    }
};

const player = {
    "mode": "development",
    "entry": path.resolve(__dirname, "src/player/index.ts"),
    "output": {
        "filename": "next2d.js",
        "path": __dirname
    },
    "plugins": [
        new ESLintPlugin({
            "extensions": [".ts", ".js"],
            "exclude": "node_modules"
        })
    ],
    "resolve": {
        "alias": {
            "@": path.resolve(__dirname, "src/player")
        },
        "extensions": [".ts", ".js"]
    },
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loader": "ts-loader",
                "options": {
                    "configFile": path.resolve(__dirname, "src/player/tsconfig.json")
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
    }
};

module.exports = [unzip_worker, player];
