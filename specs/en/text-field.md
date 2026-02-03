# TextField

TextField is a DisplayObject for displaying and editing text. It provides text-related functionality from label display to input forms.

## Inheritance

```mermaid
classDiagram
    DisplayObject <|-- InteractiveObject
    InteractiveObject <|-- TextField

    class TextField {
        +text: String
        +textColor: Number
        +type: String
        +setTextFormat()
    }
```

## Properties

### Text Related

| Property | Type | Description |
|----------|------|-------------|
| `text` | String | Text to display |
| `htmlText` | String | HTML formatted text |
| `length` | Number | Character count (read-only) |
| `maxChars` | Number | Maximum characters (0 for unlimited) |

### Display Related

| Property | Type | Description |
|----------|------|-------------|
| `textColor` | Number | Text color (0xRRGGBB) |
| `textWidth` | Number | Text width (read-only) |
| `textHeight` | Number | Text height (read-only) |
| `autoSize` | String | Auto size ("none", "left", "center", "right") |
| `wordWrap` | Boolean | Enable word wrap |
| `multiline` | Boolean | Allow multiline text |

### Input Related

| Property | Type | Description |
|----------|------|-------------|
| `type` | String | "dynamic" (display only) or "input" (editable) |
| `selectable` | Boolean | Whether text is selectable |
| `displayAsPassword` | Boolean | Password display (shows as *) |

### Scroll Related

| Property | Type | Description |
|----------|------|-------------|
| `scrollV` | Number | Vertical scroll position (line number) |
| `maxScrollV` | Number | Maximum vertical scroll position (read-only) |
| `scrollH` | Number | Horizontal scroll position (pixels) |
| `maxScrollH` | Number | Maximum horizontal scroll position (read-only) |
| `numLines` | Number | Number of text lines (read-only) |

## TextFormat

A class for setting text styles.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `font` | String | Font name |
| `size` | Number | Font size |
| `color` | Number | Text color |
| `bold` | Boolean | Bold |
| `italic` | Boolean | Italic |
| `align` | String | Alignment ("left", "center", "right") |
| `leading` | Number | Line spacing (pixels) |
| `letterSpacing` | Number | Letter spacing (pixels) |

## Usage Examples

### Basic Text Display

```typescript
import { TextField } from "@next2d/player";

const textField: TextField = new TextField();
textField.text = "Hello, Next2D!";
textField.x = 100;
textField.y = 100;

stage.addChild(textField);
```

### Applying TextFormat

```typescript
import { TextField, TextFormat } from "@next2d/player";

const textField: TextField = new TextField();
textField.text = "Styled Text";

// Create TextFormat
const format: TextFormat = new TextFormat();
format.font = "Arial";
format.size = 24;
format.color = 0x3498db;
format.bold = true;

// Apply format
textField.setTextFormat(format);

// Set as default format
textField.defaultTextFormat = format;

stage.addChild(textField);
```

### Auto Size

```typescript
import { TextField } from "@next2d/player";

const textField: TextField = new TextField();
textField.autoSize = "left";  // Auto expand to fit text
textField.text = "This text will auto-size the field";

stage.addChild(textField);
```

### Multiline Text

```typescript
import { TextField } from "@next2d/player";

const textField: TextField = new TextField();
textField.width = 200;
textField.multiline = true;
textField.wordWrap = true;
textField.text = "This is multiline text. It will wrap automatically.";

stage.addChild(textField);
```

### Input Field

```typescript
import { TextField } from "@next2d/player";
import type { Event } from "@next2d/player";

const inputField: TextField = new TextField();
inputField.type = "input";
inputField.width = 200;
inputField.height = 30;
inputField.border = true;
inputField.borderColor = 0xcccccc;
inputField.background = true;
inputField.backgroundColor = 0xffffff;

// Placeholder alternative
inputField.text = "";

// Input restriction (numbers only)
inputField.restrict = "0-9";

// Input event
inputField.addEventListener("change", (event: Event): void => {
  const target: TextField = event.target as TextField;
  console.log("Input value:", target.text);
});

stage.addChild(inputField);
```

### Password Field

```typescript
import { TextField } from "@next2d/player";

const passwordField: TextField = new TextField();
passwordField.type = "input";
passwordField.displayAsPassword = true;
passwordField.width = 200;
passwordField.height = 30;
passwordField.border = true;
passwordField.borderColor = 0xcccccc;

stage.addChild(passwordField);
```

### HTML Text

```typescript
import { TextField } from "@next2d/player";

const textField: TextField = new TextField();
textField.width = 300;
textField.multiline = true;
textField.htmlText = `
<font face="Arial" size="20" color="#3498db">
  <b>Bold Text</b><br/>
  <i>Italic Text</i><br/>
  <font color="#e74c3c">Red Text</font>
</font>
`;

stage.addChild(textField);
```

### Scrollable Text

```typescript
import { TextField } from "@next2d/player";

const textField: TextField = new TextField();
textField.width = 200;
textField.height = 100;
textField.multiline = true;
textField.wordWrap = true;
textField.border = true;
textField.text = "Long text...\n".repeat(20);

// Scroll operations
function scrollUp(): void {
  if (textField.scrollV > 1) {
    textField.scrollV--;
  }
}

function scrollDown(): void {
  if (textField.scrollV < textField.maxScrollV) {
    textField.scrollV++;
  }
}

stage.addChild(textField);
```

### Dynamic Text Update

```typescript
import { TextField, TextFormat } from "@next2d/player";

const scoreField: TextField = new TextField();
scoreField.autoSize = "left";

const format: TextFormat = new TextFormat();
format.font = "Arial";
format.size = 32;
format.color = 0xffffff;
scoreField.defaultTextFormat = format;

let score: number = 0;

function updateScore(points: number): void {
  score += points;
  scoreField.text = `Score: ${score}`;
}

updateScore(0);
stage.addChild(scoreField);
```

## Events

| Event | Description |
|-------|-------------|
| `change` | When text is changed |
| `focus` | When focus is gained |
| `blur` | When focus is lost |
| `keyDown` | When key is pressed |
| `keyUp` | When key is released |

```typescript
import { TextField } from "@next2d/player";
import type { KeyboardEvent } from "@next2d/player";

const inputField: TextField = new TextField();
inputField.type = "input";

// Submit form on Enter key
inputField.addEventListener("keyDown", (event: KeyboardEvent): void => {
  if (event.keyCode === 13) {  // Enter
    submitForm(inputField.text);
  }
});

stage.addChild(inputField);
```

## Related

- [DisplayObject](./display-object.md)
- [Event System](./events.md)
