<h1 align="center">Tabsub 📻</h1>
<p align="center">
  <strong>A tiny (~500B) Pub/Sub library that simply works</strong>
  <br/>
</p>

## Intro

Tabsub is a tiny library with minimal API that allows simple communication between browsing contexts with the same origin. It works with the BroadcastChannel API with a sensible fallback to localStorage, thus it works with all modern browsers.

## Installation

Install Tabsub from the NPM registry as:

```
npm install --save tabsub
```

## Usage

### Create a channel and send a message

```javascript
import tabsub from 'tabsub';

const radio = tabsub('channel-name');
radio.post('One message');
radio.post({msg: 'Another one'});
```

### Create a channel start listening for incoming messages

```javascript
import tabsub from 'tabsub';

const radio = tabsub('channel-name');
r.on(msg => {
  console.log(`Message received: ${msg} `);
});
```

### Pause and restart a channel

```javascript
import tabsub from 'tabsub';

const radio = tabsub('channel-name');
// Posting
radio.post('One message');
radio.stop();

radio.post('Ignored');

radio.start();
radio.post('Keep them coming');
```

## Browser support

All modern browsers using the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) and the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
