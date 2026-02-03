# Sound

Next2D Player provides audio functionality for games and applications, supporting BGM, sound effects, voice, and more.

## Class Structure

```mermaid
classDiagram
    EventDispatcher <|-- Sound
    class Sound {
        +audioBuffer: AudioBuffer
        +volume: number
        +loopCount: number
        +canLoop: boolean
        +load(request): Promise
        +play(startTime): void
        +stop(): void
        +clone(): Sound
    }
    class SoundMixer {
        +volume: Number
        +stopAll(): void
    }
```

## Sound

A class for loading and playing audio files. Extends EventDispatcher.

### Properties

| Property | Type | Default | Read-only | Description |
|----------|------|---------|:---------:|-------------|
| `audioBuffer` | AudioBuffer \| null | null | - | Audio buffer. Stores audio data loaded by load() |
| `loopCount` | number | 0 | - | Loop count setting. 0 for no loop, 9999 for virtually infinite loop |
| `volume` | number | 1 | - | Volume, ranging from 0 (silent) to 1 (full volume). Cannot exceed SoundMixer.volume value |
| `canLoop` | boolean | - | Yes | Indicates whether the sound loops |

### Methods

| Method | Return | Description |
|--------|--------|-------------|
| `clone()` | Sound | Duplicates the Sound class. Copies volume, loopCount, and audioBuffer |
| `load(request: URLRequest)` | Promise\<void\> | Initiates loading of an external MP3 file from the specified URL |
| `play(startTime: number = 0)` | void | Plays a sound. startTime is the playback start time (in seconds). Does nothing if already playing |
| `stop()` | void | Stops the sound playing in the channel |

## Usage Examples

### Basic Audio Playback

```javascript
const { Sound } = next2d.media;
const { URLRequest } = next2d.net;

// Create Sound object
const sound = new Sound();

// Load audio file
await sound.load(new URLRequest("bgm.mp3"));

// Start playback
sound.play();
```

### Sound Effect Playback

```javascript
const { Sound } = next2d.media;
const { URLRequest } = next2d.net;

// Preload sound effects
const seJump = new Sound();
const seHit = new Sound();
const seCoin = new Sound();

// Load
await seJump.load(new URLRequest("se/jump.mp3"));
await seHit.load(new URLRequest("se/hit.mp3"));
await seCoin.load(new URLRequest("se/coin.mp3"));

// Play function
function playSE(sound) {
    sound.play();
}

// Use in game
player.addEventListener("jump", function() {
    playSE(seJump);
});
```

### BGM Loop Playback

```javascript
const { Sound } = next2d.media;
const { URLRequest } = next2d.net;

const bgm = new Sound();

await bgm.load(new URLRequest("bgm/stage1.mp3"));

// Set volume and loop count
bgm.volume = 0.7;  // 70%
bgm.loopCount = 9999;  // Infinite loop

bgm.play();

// Stop BGM
function stopBGM() {
    bgm.stop();
}
```

### Volume Control

```javascript
const { Sound } = next2d.media;
const { URLRequest } = next2d.net;

const bgm = new Sound();
await bgm.load(new URLRequest("bgm.mp3"));
bgm.volume = 1.0;
bgm.loopCount = 9999;
bgm.play();

// Change volume
function setVolume(volume) {
    bgm.volume = Math.max(0, Math.min(1, volume));
}

// Fade out
function fadeOut(duration) {
    duration = duration || 1000;
    const startVolume = bgm.volume;
    const startTime = Date.now();

    stage.addEventListener("enterFrame", function fade() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);

        setVolume(startVolume * (1 - progress));

        if (progress >= 1) {
            stage.removeEventListener("enterFrame", fade);
            bgm.stop();
        }
    });
}
```

### Sound Manager

```javascript
const { Sound } = next2d.media;
const { URLRequest } = next2d.net;

class SoundManager {
    constructor() {
        this._sounds = new Map();
        this._bgm = null;
        this._bgmVolume = 0.7;
        this._seVolume = 1.0;
        this._isMuted = false;
    }

    // Preload sound
    async preload(id, url) {
        const sound = new Sound();
        await sound.load(new URLRequest(url));
        this._sounds.set(id, sound);
    }

    // Play BGM
    playBGM(id, loops) {
        loops = loops || 9999;
        this.stopBGM();

        const sound = this._sounds.get(id);
        if (sound) {
            sound.volume = this._isMuted ? 0 : this._bgmVolume;
            sound.loopCount = loops;
            sound.play();
            this._bgm = sound;
        }
    }

    // Stop BGM
    stopBGM() {
        if (this._bgm) {
            this._bgm.stop();
            this._bgm = null;
        }
    }

    // Play SE
    playSE(id) {
        const sound = this._sounds.get(id);
        if (sound) {
            sound.volume = this._isMuted ? 0 : this._seVolume;
            sound.loopCount = 0;
            sound.play();
        }
    }

    // Toggle mute
    toggleMute() {
        this._isMuted = !this._isMuted;
        this._updateVolumes();
        return this._isMuted;
    }

    // Set BGM volume
    setBGMVolume(volume) {
        this._bgmVolume = Math.max(0, Math.min(1, volume));
        this._updateVolumes();
    }

    // Set SE volume
    setSEVolume(volume) {
        this._seVolume = Math.max(0, Math.min(1, volume));
    }

    _updateVolumes() {
        if (this._bgm) {
            this._bgm.volume = this._isMuted ? 0 : this._bgmVolume;
        }
    }
}

// Usage example
const soundManager = new SoundManager();

// Preload on startup
async function initSounds() {
    await soundManager.preload("bgm_title", "bgm/title.mp3");
    await soundManager.preload("bgm_stage1", "bgm/stage1.mp3");
    await soundManager.preload("se_jump", "se/jump.mp3");
    await soundManager.preload("se_coin", "se/coin.mp3");
    await soundManager.preload("se_damage", "se/damage.mp3");
}

// During game
soundManager.playBGM("bgm_stage1");
soundManager.playSE("se_jump");
```

## SoundMixer

A class for controlling all audio.

```javascript
const { SoundMixer } = next2d.media;

// Stop all audio
SoundMixer.stopAll();

// Change global volume
SoundMixer.volume = 0.5;
```

## Supported Formats

| Format | Extension | Support |
|--------|-----------|---------|
| MP3 | .mp3 | Recommended |
| AAC | .m4a, .aac | Supported |
| Ogg Vorbis | .ogg | Browser dependent |
| WAV | .wav | Supported (large file size) |

## Best Practices

1. **Preload**: Preload all audio before game starts
2. **Format**: MP3 recommended (balance of compatibility and compression)
3. **Sound Effects**: Short sounds can use WAV (lower latency)
4. **Volume Management**: Manage BGM and SE volumes separately
5. **Mobile Support**: Start playback after user interaction

## Related

- [Event System](./events.md)
