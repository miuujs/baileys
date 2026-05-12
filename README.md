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

Send messages styled like Meta AI -- tables, code blocks, and rich text via `botForwardedMessage` > `richResponseMessage`.

### Table

```js
import { randomUUID, randomBytes } from 'crypto';

const sections = {
  response_id: randomUUID(),
  sections: [
    {
      view_model: {
        primitive: {
          text: 'Language Comparison',
          __typename: 'GenAIMarkdownTextUXPrimitive'
        },
        __typename: 'GenAISingleLayoutViewModel'
      }
    },
    {
      view_model: {
        primitive: {
          rows: [
            { items: ['Feature', 'Java', 'JavaScript'], isHeading: true },
            { items: ['Type', 'Compiled', 'Interpreted'] },
            { items: ['Typing', 'Static', 'Dynamic'] }
          ],
          __typename: 'GenATableUXPrimitive'
        },
        __typename: 'GenAISingleLayoutViewModel'
      }
    }
  ]
};

const msg = {
  messageContextInfo: {
    deviceListMetadata: {
      senderKeyIndexes: [],
      recipientKeyIndexes: [],
      recipientKeyHash: '',
      recipientTimestamp: Math.floor(Date.now() / 1000)
    },
    deviceListMetadataVersion: 2,
    messageSecret: randomBytes(32)
  },
  botForwardedMessage: {
    message: {
      richResponseMessage: {
        submessages: [{ messageType: 2, messageText: 'Language Comparison' }],
        messageType: 1,
        unifiedResponse: {
          data: Buffer.from(JSON.stringify(sections)).toString('base64')
        },
        contextInfo: {
          forwardingScore: 2,
          isForwarded: true,
          forwardedAiBotMessageInfo: { botJid: '0@s.whatsapp.net' },
          forwardOrigin: 4,
          botMessageSharingInfo: { botEntryPointOrigin: 1, forwardScore: 2 }
        }
      }
    }
  }
};

const { generateWAMessageFromContent } = await import('baileys/src/Utils/index.js');
const richMsg = generateWAMessageFromContent(jid, msg, { userJid: sock.user.id });
await sock.relayMessage(jid, richMsg.message, { messageId: richMsg.key.id });
```

### Code Block

```js
const codeSections = {
  response_id: randomUUID(),
  sections: [
    {
      view_model: {
        primitive: {
          text: 'JavaScript Example:',
          __typename: 'GenAIMarkdownTextUXPrimitive'
        },
        __typename: 'GenAISingleLayoutViewModel'
      }
    },
    {
      view_model: {
        primitive: {
          language: 'javascript',
          code_blocks: [
            { content: 'function ', type: 'KEYWORD' },
            { content: 'hello', type: 'DEFAULT' },
            { content: '() {', type: 'DEFAULT' },
            { content: '\n  return ', type: 'DEFAULT' },
            { content: '"Hello World"', type: 'STR' },
            { content: ';\n}', type: 'DEFAULT' }
          ],
          __typename: 'GenAICodeUXPrimitive'
        },
        __typename: 'GenAISingleLayoutViewModel'
      }
    }
  ]
};

const codeMsg = {
  messageContextInfo: {
    deviceListMetadata: {
      senderKeyIndexes: [],
      recipientKeyIndexes: [],
      recipientKeyHash: '',
      recipientTimestamp: Math.floor(Date.now() / 1000)
    },
    deviceListMetadataVersion: 2,
    messageSecret: randomBytes(32)
  },
  botForwardedMessage: {
    message: {
      richResponseMessage: {
        submessages: [],
        messageType: 1,
        unifiedResponse: {
          data: Buffer.from(JSON.stringify(codeSections)).toString('base64')
        },
        contextInfo: {
          forwardingScore: 2,
          isForwarded: true,
          forwardedAiBotMessageInfo: { botJid: '0@s.whatsapp.net' },
          forwardOrigin: 4,
          botMessageSharingInfo: { botEntryPointOrigin: 1, forwardScore: 2 }
        }
      }
    }
  }
};

const richMsg = generateWAMessageFromContent(jid, codeMsg, { userJid: sock.user.id });
await sock.relayMessage(jid, richMsg.message, { messageId: richMsg.key.id });
```

---

## Album Message

Send multiple images/videos in a single album.

```js
import { randomBytes } from 'crypto';

const album = await generateWAMessageFromContent(jid, {
  messageContextInfo: { messageSecret: randomBytes(32) },
  albumMessage: {
    expectedImageCount: 2,
    expectedVideoCount: 1
  }
}, { userJid: sock.user.id });

await sock.relayMessage(jid, album.message, { messageId: album.key.id });

const items = [
  { image: { url: './photo1.jpg' }, caption: 'Photo 1' },
  { image: { url: './photo2.jpg' }, caption: 'Photo 2' },
  { video: { url: './video.mp4' }, caption: 'Video clip' }
];

for (const item of items) {
  const mediaMsg = await generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret: randomBytes(32) },
    ...await generateWAMessageContent(item, { upload: sock.waUploadToServer })
  }, { userJid: sock.user.id });
  await sock.relayMessage(jid, mediaMsg.message, { messageId: mediaMsg.key.id });
}
```

---

## Event Message

```js
import { proto } from 'baileys/WAProto/index.js';

const eventMsg = {
  eventMessage: proto.Message.EventMessage.fromObject({
    name: 'Community Meetup',
    description: 'Join us for the monthly meetup!',
    startTime: Date.now() + 86400000,
    location: {
      degreesLatitude: -6.2,
      degreesLongitude: 106.8,
      name: 'Jakarta'
    }
  })
};

const msg = generateWAMessageFromContent(jid, eventMsg, { userJid: sock.user.id });
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

---

## Poll Result

```js
const pollResult = {
  pollResultMessage: proto.Message.PollResultMessage.fromObject({
    name: 'Favorite Language?',
    pollVotes: [
      { optionName: 'JavaScript', optionVoteCount: 42 },
      { optionName: 'Python', optionVoteCount: 38 },
      { optionName: 'Go', optionVoteCount: 15 }
    ]
  })
};

const msg = generateWAMessageFromContent(jid, pollResult, { userJid: sock.user.id });
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

---

## Product Message

```js
const { imageMessage } = await prepareWAMessageMedia(
  { image: { url: 'https://example.com/product.jpg' } },
  { upload: sock.waUploadToServer }
);

const productMsg = {
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
          buttons: [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: 'Buy Now', id: '.buy_p001' })
          }]
        }
      }
    }
  }
};

const msg = generateWAMessageFromContent(jid, productMsg, { userJid: sock.user.id });
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

---

## Payment Request

```js
const paymentMsg = {
  requestPaymentMessage: proto.Message.RequestPaymentMessage.fromObject({
    expiryTimestamp: Math.floor(Date.now() / 1000) + 86400,
    amount1000: 50000,
    currencyCodeIso4217: 'IDR',
    requestFrom: '628xxx@s.whatsapp.net',
    noteMessage: {
      extendedTextMessage: {
        text: 'Payment for order #123'
      }
    },
    background: { id: 'DEFAULT', placeholderArgb: 0xfff0f0f0 }
  })
};

const msg = generateWAMessageFromContent(jid, paymentMsg, { userJid: sock.user.id });
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

---

## Socket Architecture

Each socket layer extends the previous via composition:

```
makeSocket              -> WebSocket + Noise protocol + pre-key management
  makeChatsSocket       -> App state sync + chat modifications + profile
    makeGroupsSocket    -> Group CRUD + participant management
      makeNewsletterSocket -> Newsletter follow/unfollow/metadata
        makeMessagesSendSocket -> Message sending + relay
          makeMessagesRecvSocket -> Message receiving + decryption
            makeBusinessSocket   -> Product catalog + business profile
              makeCommunitiesSocket -> Community CRUD + sub-groups
                makeWASocket       <- Top-level export
```

---

## License

GPL-3.0
