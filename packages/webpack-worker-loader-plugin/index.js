"use strict";

const fs = require("fs");

module.exports = class Next2DWebpackWorkerLoaderPlugin
{
    /**
     * @param   {Compiler} compiler
     * @returns {void}
     * @method
     * @public
     */
    apply (compiler)
    {
        compiler.hooks.beforeCompile.tapAsync("Next2DWebpackWorkerLoaderPlugin", (compilation, callback) =>
        {
            if (compiler.options.mode === "production") {
                this._$margeVersion(compilation.normalModuleFactory.context);
                this._$margeUnzipWorker(compilation.normalModuleFactory.context);
                this._$margeRenderWorker(compilation.normalModuleFactory.context);
            }
            callback();
        });
    }

    /**
     * @param  {string} dir
     * @return {void}
     * @method
     * @private
     */
    _$margeVersion (dir)
    {
        const indexPath = `${dir}/src/index.ts`;
        if (fs.existsSync(indexPath)) {

            const src = fs.readFileSync(indexPath, "utf8");
            const packageJson = require(`${dir}/package.json`);

            const texts = src.split("\n");
            for (let idx = 0; idx < texts.length; ++idx) {

                const text = texts[idx];
                if (text.indexOf("Next2D Player") === -1) {
                    continue;
                }

                const top   = texts.slice(0, idx).join("\n");
                const lower = texts.slice(idx + 1).join("\n");

                fs.writeFileSync(
                    indexPath,
                    `${top}
    console.log("%c Next2D Player %c ${packageJson.version} %c https://next2d.app",
${lower}`
                );

                break;
            }
        }
    }

    /**
     * @param  {string} dir
     * @return {void}
     * @method
     * @private
     */
    _$margeRenderWorker (dir)
    {
        const RenderWorkerPath = `${dir}/worker/renderer/RendererWorker.min.js`;

        if (fs.existsSync(RenderWorkerPath)) {

            const worker = fs.readFileSync(RenderWorkerPath, "utf8")
                .replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/\n/g, "");

            const utilPath = `${dir}/packages/util/src/Util.ts`;

            const util  = fs.readFileSync(utilPath, "utf8");
            const index = util.indexOf("const $renderURL");
            const top   = util.slice(0, index - 1);

            let lower = "";
            const texts = util.split("\n");
            for (let idx = 0; idx < texts.length; ++idx) {

                const text = texts[idx];
                if (text.indexOf("const $renderURL") === -1) {
                    continue;
                }

                lower = texts.slice(idx + 1).join("\n");
                break;
            }

            fs.writeFileSync(
                utilPath,
                `${top}
const $renderURL: string = "${worker}";
${lower}`
            );
        }
    }

    /**
     *
     * @param  {string} dir
     * @return {void}
     * @method
     * @private
     */
    _$margeUnzipWorker (dir)
    {
        const UnzipWorkerPath = `${dir}/worker/unzip/UnzipWorker.min.js`;
        if (fs.existsSync(UnzipWorkerPath)) {

            const worker = fs.readFileSync(UnzipWorkerPath, "utf8")
                .replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/\n/g, "");

            const utilPath = `${dir}/packages/util/src/Util.ts`;

            const util  = fs.readFileSync(utilPath, "utf8");
            const index = util.indexOf("const $unzipURL");
            const top   = util.slice(0, index - 1);

            let lower = "";
            const texts = util.split("\n");
            for (let idx = 0; idx < texts.length; ++idx) {

                const text = texts[idx];
                if (text.indexOf("const $unzipURL") === -1) {
                    continue;
                }

                lower = texts.slice(idx + 1).join("\n");
                break;
            }

            fs.writeFileSync(
                utilPath,
                `${top}
const $unzipURL: string = URL.createObjectURL(new Blob(["${worker}"], { "type": "text/javascript" }));
${lower}`
            );
        }
    }
};
