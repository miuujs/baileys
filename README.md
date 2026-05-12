<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:25D366,100:128C7E&height=200&section=header&text=yelib&fontSize=60&fontColor=fff&animation=fadeIn&fontAlignY=35"/>
</p>

<p align="center">
  <strong>WhatsApp Web API Library</strong> &mdash; v1.0.0 &mdash; based on @whiskeysockets/baileys v7.0.0-rc10
</p>

> [!CAUTION]
> NOTICE OF BREAKING CHANGE.
>
> As of this fork, multiple changes and additions have been introduced on top of the original Baileys v7.0.0-rc10 codebase.

# Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates.
The official WhatsApp website can be found at whatsapp.com. "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners.

The maintainers of this project do not in any way condone the use of this application in practices that violate the Terms of Service of WhatsApp. The maintainers of this application call upon the personal responsibility of its users to use this application in a fair way, as it is intended to be used.
Use at your own discretion. Do not spam people with this. We discourage any stalkerware, bulk or automated messaging usage.

> [!IMPORTANT]
> The original repository had to be removed by the original author &mdash; we now continue development in this repository here.
> This is the only official repository and is maintained by the community.
> **Official Channel**: [WhatsApp Channel](https://whatsapp.com/channel/0029VbCih2O1noz41RfWbV3X)

---

## Installation

```bash
npm install baileys
```

This fork is ESM-only. Ensure your `package.json` contains `"type": "module"`.

---

## Quick Start

```js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers
} from 'baileys';
import pino from 'pino';

const logger = pino({ level: 'silent' });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');

  const sock = makeWASocket({
    auth: state,
    logger,
    browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: false
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) console.log('QR:', qr);
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    }
    if (connection === 'open') console.log('Connected!');
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message || msg.key.fromMe) return;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    if (text === '.ping') {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Pong!' });
    }
  });
}

startBot();
```

---

## Features / Examples

Baileys supports all standard WhatsApp message types via `sock.sendMessage(jid, content, options)`.

### Text

```js
await sock.sendMessage(jid, { text: 'Hello World!' });
```

### Text with Mention

```js
await sock.sendMessage(jid, {
  text: 'Hello @628xxx!',
  mentions: ['628xxx@s.whatsapp.net']
});
```

### Image

```js
await sock.sendMessage(jid, {
  image: { url: './photo.jpg' },
  caption: 'A photo'
});
```

### Video

```js
await sock.sendMessage(jid, {
  video: { url: './video.mp4' },
  caption: 'A video',
  gifPlayback: false
});
```

### Audio / Voice Note

```js
await sock.sendMessage(jid, {
  audio: { url: './audio.ogg' },
  mimetype: 'audio/ogg; codecs=opus',
  ptt: true
});
```

### Sticker

```js
await sock.sendMessage(jid, {
  sticker: { url: './sticker.webp' }
});
```

### Document

```js
await sock.sendMessage(jid, {
  document: { url: './file.pdf' },
  fileName: 'document.pdf',
  mimetype: 'application/pdf'
});
```

### Location

```js
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.2,
    degreesLongitude: 106.8,
    name: 'Jakarta'
  }
});
```

### Contact

```js
await sock.sendMessage(jid, {
  contacts: {
    displayName: 'John Doe',
    contacts: [{
      vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+628xxx\nEND:VCARD'
    }]
  }
});
```

### Reaction

```js
await sock.sendMessage(jid, {
  react: { key: msg.key, text: '\u2764\uFE0F' }
});
```

### Poll

```js
await sock.sendMessage(jid, {
  poll: {
    name: 'Favorite Language?',
    values: ['JavaScript', 'Python', 'Go'],
    selectableCount: 1
  }
});
```

### Forward Message

```js
await sock.sendMessage(jid, {
  forward: msg,
  forwardingScore: 1,
  isForwarded: true
});
```

### Delete Message

```js
await sock.sendMessage(jid, { delete: msg.key });
```

### Edit Message

```js
await sock.sendMessage(jid, {
  text: 'Edited content',
  edit: msg.key
});
```

---

## Interactive Messages

### Native Flow Buttons

Send interactive buttons with quick replies, URLs, and copy-to-clipboard actions.

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'Welcome!',
    footer: 'Powered by yelib',
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: 'Menu',
          id: '.menu'
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: 'Website',
          url: 'https://example.com'
        })
      },
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: 'Copy Code',
          copy_code: 'YELIB2024'
        })
      }
    ],
    header: 'Choose an option',
    image: { url: 'https://example.com/banner.jpg' }
  }
});
```

### List Menu (single_select)

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'Select Category',
    footer: 'Powered by yelib',
    buttons: [
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: 'Menu',
          sections: [
            {
              title: 'Games',
              rows: [
                { title: 'Quiz', id: '.quiz' },
                { title: 'Guess', id: '.guess' }
              ]
            },
            {
              title: 'Tools',
              rows: [
                { title: 'Sticker', id: '.sticker' },
                { title: 'TTS', id: '.tts' }
              ]
            }
          ]
        })
      }
    ],
    header: 'Bot Menu'
  }
});
```

### Carousel Message

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'Our Products',
    footer: 'Powered by yelib',
    carouselMessage: {
      cards: [
        {
          body: { text: 'Product A - Rp50,000' },
          footer: { text: '10% off' },
          header: { title: 'Product A' },
          nativeFlowMessage: {
            buttons: [{
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({ display_text: 'Buy', id: '.buy_a' })
            }]
          }
        },
        {
          body: { text: 'Product B - Rp75,000' },
          footer: { text: '15% off' },
          header: { title: 'Product B' },
          nativeFlowMessage: {
            buttons: [{
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({ display_text: 'Buy', id: '.buy_b' })
            }]
          }
        }
      ],
      messageVersion: 1
    }
  }
});
```

### Interactive Message with Image

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'Special Offer',
    footer: 'Limited time',
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({ display_text: 'Buy Now', id: '.buy' })
      }
    ],
    header: 'Promo',
    image: { url: 'https://example.com/banner.jpg' }
  }
});
```

---

## AI Rich Response Messages

Send messages styled like Meta AI -- tables, code blocks, rich text, and links.

### Table V1

```js
await sock.sendTable(
  jid,
  'Language Comparison',
  ['Feature', 'Java', 'JavaScript'],
  [
    ['Type', 'Compiled', 'Interpreted'],
    ['Typing', 'Static', 'Dynamic'],
    ['Main Use', 'Enterprise', 'Web/Full-stack']
  ],
  quoted,
  { headerText: 'Comparison:', footer: 'Reference' }
);
```

### Table V2 (Unified Response)

```js
await sock.sendTableV2(
  jid,
  [
    'Language Comparison',
    'Feature | Java | JavaScript',
    'Type | Compiled | Interpreted;;Typing | Static | Dynamic'
  ],
  quoted,
  { headerText: 'Comparison:', text: 'See below:', footer: 'Reference' }
);
```

### List

```js
await sock.sendList(
  jid,
  'Bot Info',
  [
    ['Name', 'yelib'],
    ['Version', '1.0.0'],
    ['Based on', 'Baileys v7.0.0-rc10']
  ],
  quoted,
  { footer: 'yelib' }
);
```

### Code Block V1

```js
await sock.sendCodeBlock(
  jid,
  `function hello(name) {
  return "Hello " + name
}
hello("World")`,
  quoted,
  { language: 'javascript', title: 'Example Code', footer: 'yelib' }
);
```

### Code Block V2 (Unified Response)

Supports syntax highlighting for JavaScript, TypeScript, Python, Go, Lua, Bash.

```js
await sock.sendCodeBlockV2(
  jid,
  `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`,
  quoted,
  { language: 'go', title: 'Go Example', text: 'A simple Go program:', footer: 'yelib' }
);
```

### Link Message

```js
await sock.sendLink(
  jid,
  'Results:\nLink 1: {{IE_0}}click here{{/IE_0}}\nLink 2: {{IE_1}}click here{{/IE_1}}',
  ['https://example.com/1', 'https://example.com/2'],
  quoted,
  {
    headerText: 'Search Results',
    footer: 'yelib',
    citations: [
      { sourceTitle: 'Source 1', citationNumber: 1 },
      { sourceTitle: 'Source 2', citationNumber: 2 }
    ]
  }
);
```

### Rich Message (Custom Submessages)

```js
await sock.sendRichMessage(
  jid,
  [
    { messageType: 2, messageText: 'Header text' },
    { messageType: 4, tableMetadata: { title: 'Table', rows: [{ items: ['A', 'B'], isHeading: true }, { items: ['1', '2'] }] } },
    { messageType: 2, messageText: 'Footer text' }
  ],
  quoted
);
```

### Capture & Resend Unified Response

```js
const captured = sock.captureUnifiedResponse(msg);
if (captured) {
  await sock.sendUnifiedResponse(jid, quoted, captured);
}
```

---

## Interactive Messages

### Native Flow Buttons (via sendMessage)

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'Welcome!',
    footer: 'yelib',
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({ display_text: 'Menu', id: '.menu' })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ display_text: 'Website', url: 'https://example.com' })
      },
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({ display_text: 'Copy Code', copy_code: 'YELIB2024' })
      }
    ],
    header: 'Choose an option',
    image: { url: 'https://example.com/banner.jpg' }
  }
});
```

### List Menu

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'Select Category',
    footer: 'yelib',
    buttons: [{
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: 'Menu',
        sections: [
          { title: 'Games', rows: [{ title: 'Quiz', id: '.quiz' }, { title: 'Guess', id: '.guess' }] },
          { title: 'Tools', rows: [{ title: 'Sticker', id: '.sticker' }, { title: 'TTS', id: '.tts' }] }
        ]
      })
    }],
    header: 'Bot Menu'
  }
});
```

### Carousel

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    title: 'Products',
    footer: 'yelib',
    carouselMessage: {
      cards: [
        {
          body: { text: 'Product A - Rp50,000' },
          footer: { text: '10% off' },
          header: { title: 'Product A' },
          nativeFlowMessage: { buttons: [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Buy', id: '.buy_a' }) }] }
        },
        {
          body: { text: 'Product B - Rp75,000' },
          footer: { text: '15% off' },
          header: { title: 'Product B' },
          nativeFlowMessage: { buttons: [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Buy', id: '.buy_b' }) }] }
        }
      ],
      messageVersion: 1
    }
  }
});
```

### Album Message

```js
await sock.sendMessage(jid, {
  albumMessage: [
    { image: { url: './photo1.jpg' }, caption: 'Photo 1' },
    { image: { url: './photo2.jpg' }, caption: 'Photo 2' },
    { video: { url: './video.mp4' }, caption: 'Video' }
  ]
});
```

### Event Message

```js
await sock.sendMessage(jid, {
  eventMessage: {
    name: 'Community Meetup',
    description: 'Join us for the monthly meetup!',
    startTime: Date.now() + 86400000,
    location: { degreesLatitude: -6.2, degreesLongitude: 106.8, name: 'Jakarta' }
  }
});
```

### Poll Result

```js
await sock.sendMessage(jid, {
  pollResultMessage: {
    name: 'Favorite Language?',
    pollVotes: [
      { optionName: 'JavaScript', optionVoteCount: 42 },
      { optionName: 'Python', optionVoteCount: 38 },
      { optionName: 'Go', optionVoteCount: 15 }
    ]
  }
});
```

### Product Message

```js
const { imageMessage } = await prepareWAMessageMedia(
  { image: { url: 'https://example.com/product.jpg' } },
  { upload: sock.waUploadToServer }
);

await sock.sendMessage(jid, {
  viewOnceMessage: {
    message: {
      interactiveMessage: {
        body: { text: 'Latest product!' },
        footer: { text: 'yelib store' },
        header: {
          title: 'Product Name',
          hasMediaAttachment: true,
          productMessage: {
            product: {
              productImage: imageMessage,
              productId: 'P001',
              title: 'Product Name',
              description: 'Product description',
              currencyCode: 'IDR',
              priceAmount1000: 50000000,
              retailerId: 'YELIB',
              url: 'https://example.com/product',
              productImageCount: 1
            },
            businessOwnerJid: '0@s.whatsapp.net'
          }
        },
        nativeFlowMessage: {
          buttons: [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Buy Now', id: '.buy_p001' }) }]
        }
      }
    }
  }
});
```

### Payment Request

```js
await sock.sendMessage(jid, {
  requestPaymentMessage: {
    expiryTimestamp: Math.floor(Date.now() / 1000) + 86400,
    amount1000: 50000,
    currencyCodeIso4217: 'IDR',
    requestFrom: '628xxx@s.whatsapp.net',
    noteMessage: {
      extendedTextMessage: { text: 'Payment for order #123' }
    },
    background: { id: 'DEFAULT', placeholderArgb: 0xfff0f0f0 }
  }
});
```

---

## Socket Architecture

Each socket layer extends the previous via composition:

```
makeSocket -> WebSocket + Noise protocol + pre-key management
  makeChatsSocket -> App state sync + chat modifications + profile
    makeGroupsSocket -> Group CRUD + participant management
      makeNewsletterSocket -> Newsletter follow/unfollow/metadata
        makeMessagesSendSocket -> Message sending + relay
          makeMessagesRecvSocket -> Message receiving + decryption
            makeBusinessSocket -> Product catalog + business profile
              makeCommunitiesSocket -> Community CRUD + sub-groups
                makeWASocket <- Top-level export
```


