## About

${{ player-api.about }}$

## ${{ player-api.sample.simple }}$
```javascript
next2d.load("JSON Path...");
```

## ${{ player-api.sample.program }}$
```javascript
const { Loader }     = next2d.display;
const { URLRequest } = next2d.net;
const { Event }      = next2d.events;

// create root MovieClip
const root = next2d.createRootMovieClip();

const request = new URLRequest("JSON path");
const loader  = new Loader(request);

loader
    .contentLoaderInfo
    .addEventListener(Event.COMPLETE, (event) =>
    {
        root.addChild(event.currentTarget.content);
    });

loader.load(request);
```

## ${{ player-api.options.title }}$

| ${{ player-api.options.th1 }}$ | ${{ player-api.options.th2 }}$ | ${{ player-api.options.th3 }}$ | ${{ player-api.options.th4 }}$ |
| --- | --- | --- | --- |
| `base` | string | empty | ${{ player-api.options.text1 }}$ |
| `fullScreen` | boolean | false | ${{ player-api.options.text2 }}$ |
| `tagId` | string | empty | ${{ player-api.options.text3 }}$ |
| `bgColor` | array | empty | ${{ player-api.options.text4 }}$ |
