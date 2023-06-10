globalThis.$windowEventMap = new Map();
globalThis.window = {
    "devicePixelRatio": 2,
    "addEventListener": (type, callback) =>
    {
        globalThis.$windowEventMap.set(type, callback);
    },
    "next2d": {
        "display": {
            "MovieClip": class MovieClip
            {
                constructor()
                {
                    this.name = "";
                    this.namespace = "next2d.display.MovieClip";
                }

                _$sync ()
                {
                    return undefined;
                }

                _$getChildren ()
                {
                    return undefined;
                }
            },
            "Loader": class Loader
            {
                constructor ()
                {
                    this.event = new Map();
                }

                get contentLoaderInfo ()
                {
                    return {
                        "addEventListener": (name, callback) =>
                        {
                            this.event.set(name, callback);
                        }
                    };
                }

                loadImage ()
                {
                    this.event.get("complete")({
                        "currentTarget": {
                            "content": {
                                "_$loaderInfo": {
                                    "_$data": {
                                        "symbols": new Map([["app", "app"]])
                                    }
                                },
                                "text": "NoCode Tool image content"
                            }
                        }
                    });
                }

                load ()
                {
                    this.event.get("complete")({
                        "currentTarget": {
                            "content": {
                                "_$loaderInfo": {
                                    "_$data": {
                                        "symbols": new Map([["app", "app"]])
                                    }
                                },
                                "text": "NoCode Tool content"
                            }
                        }
                    });
                }
            },
            "Shape": class Shape
            {
                get graphics ()
                {
                    return this;
                }

                beginBitmapFill ()
                {
                    return this;
                }

                beginFill ()
                {
                    return this;
                }

                drawRect ()
                {
                    return this;
                }

                endFill ()
                {
                    return this;
                }
            },
            "BitmapData": class BitmapData
            {
                draw (source, matrix, color_transform, canvas = {}, callback)
                {
                    callback(canvas);
                }
            },
            "Sprite": class Sprite
            {
                addChild (display_object)
                {
                    return display_object;
                }

                get graphics ()
                {
                    return this;
                }

                beginFill ()
                {
                    return this;
                }

                drawRect ()
                {
                    return this;
                }

                endFill ()
                {
                    return this;
                }
            }
        },
    }
};

globalThis.next2d = {
    "createRootMovieClip": function ()
    {
        const object = {
            "_$created": true,
            "_$createWorkerInstance": () =>
            {
                return undefined;
            },
            "stage": {
                "canvasWidth": 100,
                "canvasHeight": 100,
                "_$player": {
                    "_$matrix": [1,0,0,1,10,10]
                }
            },
            "addChild": (child) =>
            {
                return child;
            },
            "numChildren": 1,
            "removeChild": (number) =>
            {
                object.numChildren = number;
            },
            "getChildAt": () =>
            {
                return 0;
            }
        };

        return object;
    },
    "display": {
        "MovieClip": class MovieClip
        {
            constructor()
            {
                this.name = "";
                this.namespace = "next2d.display.MovieClip";
            }

            _$sync ()
            {
                return undefined;
            }

            _$getChildren ()
            {
                return undefined;
            }
        },
        "Loader": class Loader
        {
            constructor ()
            {
                this.event = new Map();
            }

            get contentLoaderInfo ()
            {
                return {
                    "addEventListener": (name, callback) =>
                    {
                        this.event.set(name, callback);
                    }
                };
            }

            loadImage ()
            {
                this.event.get("complete")({
                    "currentTarget": {
                        "content": {
                            "_$loaderInfo": {
                                "_$data": {
                                    "symbols": new Map([["app", "app"]])
                                }
                            },
                            "text": "NoCode Tool image content"
                        }
                    }
                });
            }

            load ()
            {
                this.event.get("complete")({
                    "currentTarget": {
                        "content": {
                            "_$loaderInfo": {
                                "_$data": {
                                    "symbols": new Map([["app", "app"]])
                                }
                            },
                            "text": "NoCode Tool content"
                        }
                    }
                });
            }
        },
        "Shape": class Shape
        {
            get graphics ()
            {
                return this;
            }

            beginBitmapFill ()
            {
                return this;
            }

            beginFill ()
            {
                return this;
            }

            drawRect ()
            {
                return this;
            }

            endFill ()
            {
                return this;
            }
        },
        "BitmapData": class BitmapData
        {
            draw (source, matrix, color_transform, canvas = {}, callback)
            {
                callback(canvas);
            }
        },
        "Sprite": class Sprite
        {
            addChild (display_object)
            {
                return display_object;
            }

            get graphics ()
            {
                return this;
            }

            beginFill ()
            {
                return this;
            }

            drawRect ()
            {
                return this;
            }

            endFill ()
            {
                return this;
            }
        }
    },
    "geom": {
        "Matrix": class Matrix
        {

        }
    },
    "events": {
        "Event": class Event {
            static get COMPLETE ()
            {
                return "complete";
            }
            static get REMOVED ()
            {
                return "removed";
            }
        },
        "IOErrorEvent": class IOErrorEvent
        {
            static get IO_ERROR () {
                return "io_error";
            }
        }
    },
    "net": {
        "URLRequest": class URLRequest
        {
            constructor()
            {
                this.method = "GET";
                this.requestHeaders = [];
                this.data = null;
            }
        },
        "URLRequestHeader": class URLRequestHeader
        {
            constructor (name, value)
            {
                this.name  = name;
                this.value = value;
            }
        },
        "URLRequestMethod": {
            "GET": "GET",
            "PUT": "PUT",
            "POST": "POST"
        }
    },
    "fw": {
        "loaderInfo": new Map(),
        "application": "app",
        "cache": new Map([["cache", "cache"]]),
        "config": {
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 12,
                "options": {}
            }
        },
        "context": "context",
        "packages": new Map([["class", "class"]]),
        "response": new Map([["response", "response"]]),
        "variable": new Map([["variable", "variable"]]),
        "query": new Map([["query", "query"]])
    }
};

globalThis.location = {
    "pathname": "/"
};

globalThis.history = {
    "pushState": () => {}
};

globalThis.$elements = new Map();
globalThis.document = {
    "getElementById": (id) =>
    {
        return globalThis.$elements.has(id)
            ? globalThis.$elements.get(id)
            : null;
    },
    "createElement": () =>
    {
        const attribute = new Map();
        return {
            "getAttribute": (name) =>
            {
                return attribute.has(name)
                    ? attribute.get(name)
                    : null;
            },
            "setAttribute": (name, value) =>
            {
                attribute.set(name, value);
            },
            "insertBefore": (element) =>
            {
                if (element.id) {
                    globalThis.$elements.set(element.id, element);
                }
            },
            "children": []
        };
    }
};

globalThis.requestAnimationFrame = (callback) =>
{
    return callback();
};