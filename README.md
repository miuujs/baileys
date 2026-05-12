<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:25D366,100:128C7E&height=200&section=header&text=yelib&fontSize=60&fontColor=fff&animation=fadeIn&fontAlignY=35"/>
</p>

<p align="center">
  <strong>WhatsApp Web API Library</strong> &mdash; v1.0.0 &mdash; based on @whiskeysockets/baileys v7.0.0-rc10
</p>

<p align="center">
  <a href="https://github.com/miuujs/baileys/stargazers">
    <img src="https://img.shields.io/github/stars/miuujs/baileys?style=for-the-badge&color=25D366" alt="Stars"/>
  </a>
  <a href="https://github.com/miuujs/baileys/forks">
    <img src="https://img.shields.io/github/forks/miuujs/baileys?style=for-the-badge&color=128C7E" alt="Forks"/>
  </a>
  <a href="https://github.com/miuujs/baileys/issues">
    <img src="https://img.shields.io/github/issues/miuujs/baileys?style=for-the-badge&color=075E54" alt="Issues"/>
  </a>
  <a href="https://github.com/miuujs/baileys/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-GPL--3.0-25D366?style=for-the-badge" alt="License"/>
  </a>
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
npm install github:miuujs/baileys
```

Or clone for development:

```bash
git clone https://github.com/miuujs/baileys
cd baileys
npm install
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

## Standard Messages

Basic message types supported via `sock.sendMessage(jid, content, options)`.

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

### Disappearing Messages
```js
await sock.sendMessage(jid, { disappearingMessagesInChat: 86400 });
```

---

## Advanced Messages

These message types are auto-detected and processed by the internal `MessageBuilders` system when passed through `sendMessage()`.

### Native Flow Buttons

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

### Button Types Reference

| name | buttonParamsJson fields | Description |
| ---- | ----------------------- | ----------- |
| `quick_reply` | `display_text`, `id` | Sends the `id` back as a message |
| `cta_url` | `display_text`, `url` | Opens a URL when tapped |
| `cta_copy` | `display_text`, `copy_code` | Copies text to clipboard |
| `single_select` | `title`, `sections` | Shows a list/select menu |
| `call_permission_request` | `display_text`, `id` | Requests call permission |

### Button Features

| Feature | Field | Description |
| ------- | ----- | ----------- |
| Limited Time Offer | `limited_time_offer_seconds` | Shows countdown timer on button |
| Bottom Sheet | `bottom_sheet` | Renders options as a bottom sheet |
| Tap Target Config | `tap_target_configuration` | Custom tap target behavior |

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

### Album Message

Send multiple images/videos as a grouped album:

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
  productMessage: {
    title: 'Product Name',
    description: 'Product description',
    thumbnail: { url: 'https://example.com/product.jpg' },
    productId: 'P001',
    retailerId: 'YELIB',
    url: 'https://example.com/product',
    body: 'Latest product!',
    footer: 'yelib store',
    buttons: [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Buy Now', id: '.buy' }) }],
    priceAmount1000: 50000000,
    currencyCode: 'IDR'
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

### Group Status Message

```js
await sock.sendMessage(jid, {
  groupStatusMessage: {
    image: { url: './photo.jpg' },
    caption: 'Group status update!'
  }
});
```

### Interactive Buttons (via interactiveButtons)

```js
await sock.sendMessage(jid, {
  interactiveButtons: [{
    name: 'quick_reply',
    buttonParamsJson: { display_text: 'Yes', id: '.yes' }
  }],
  text: 'Do you agree?',
  footer: 'yelib',
  title: 'Confirmation'
});
```

---

## Status WhatsApp

Send status updates with mentions:

```js
await sock.messageBuilders.sendStatusWhatsApp(
  { text: 'Hello Status!', backgroundColor: '#FF5733', font: 1 },
  ['628xxx@s.whatsapp.net']
);
```

With media:
```js
await sock.messageBuilders.sendStatusWhatsApp(
  { image: { url: './photo.jpg' }, caption: 'My story' },
  ['628xxx@s.whatsapp.net', '1234567890@g.us']
);
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

### Code Highlight Types

| Code | Name | Description |
| ---- | ---- | ----------- |
| 0 | DEFAULT | Normal text, whitespace, operators |
| 1 | KEYWORD | Language keywords (`const`, `func`, `if`, etc.) |
| 2 | METHOD | Function/method calls (identifier followed by `(`) |
| 3 | STRING | String literals (`"..."`, `'...'`, `` `...` ``) |
| 4 | NUMBER | Numeric values (int, float, hex, binary, octal) |
| 5 | COMMENT | Comments (`//`, `/* */`, `#`) |

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

### SubMessage Types Reference

| messageType | Name | Payload Field | Description |
| ----------- | ---- | ------------- | ----------- |
| 0 | UNKNOWN | -- | Unknown/empty submessage |
| 1 | GRID_IMAGE | `gridImageMetadata` | Grid layout of images |
| 2 | TEXT | `messageText` | Plain text content |
| 3 | INLINE_IMAGE | `imageMetadata` | Inline image with URL and alignment |
| 4 | TABLE | `tableMetadata` | Table with rows and headings |
| 5 | CODE | `codeMetadata` | Code block with syntax highlighting |
| 6 | DYNAMIC | `dynamicMetadata` | Dynamic/loading content |
| 7 | MAP | `mapMetadata` | Map with annotations |
| 8 | LATEX | `latexMetadata` | LaTeX math expressions |
| 9 | CONTENT_ITEMS | `contentItemsMetadata` | Content items/cards |

### Rich Message (Custom Submessages)

```js
await sock.sendRichMessage(
  jid,
  [
    { messageType: 2, messageText: 'Header text' },
    {
      messageType: 4,
      tableMetadata: {
        title: 'Stats',
        rows: [
          { items: ['Metric', 'Value'], isHeading: true },
          { items: ['Users', '1000'] },
          { items: ['Uptime', '99.9%'] }
        ]
      }
    },
    {
      messageType: 5,
      codeMetadata: {
        codeLanguage: 'javascript',
        codeBlocks: [
          { highlightType: 1, codeContent: 'const ' },
          { highlightType: 0, codeContent: 'msg = ' },
          { highlightType: 3, codeContent: '"hello"' },
          { highlightType: 0, codeContent: ';' }
        ]
      }
    },
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

## Newsletter API

Full newsletter management via MEX GraphQL queries and direct protocol nodes. All methods are available on the socket object.

### Management

**Create Newsletter:**
```js
const result = await sock.newsletterCreate('My Channel', 'Channel description');
// { id, name, creation_time, description, invite, subscribers, verification, picture, mute_state }
```

**Get Metadata:**
```js
// By invite code
const meta = await sock.newsletterMetadata('invite', 'abc123');
// By newsletter ID
const meta = await sock.newsletterMetadata('id', '1234567890@newsletter');
```

**Get Subscribers Count:**
```js
const count = await sock.newsletterSubscribers('1234567890@newsletter');
```

**Delete Newsletter:**
```js
await sock.newsletterDelete('1234567890@newsletter');
```

### Follow / Unfollow / Mute

```js
await sock.newsletterFollow('1234567890@newsletter');
await sock.newsletterUnfollow('1234567890@newsletter');
await sock.newsletterMute('1234567890@newsletter');
await sock.newsletterUnmute('1234567890@newsletter');
```

### Settings

```js
await sock.newsletterUpdateName('1234567890@newsletter', 'New Name');
await sock.newsletterUpdateDescription('1234567890@newsletter', 'New description');
await sock.newsletterUpdatePicture('1234567890@newsletter', { url: './photo.jpg' });
await sock.newsletterRemovePicture('1234567890@newsletter');
```

### Messaging

**Send Message:**
```js
await sock.sendMessage('1234567890@newsletter', { text: 'Hello subscribers!' });
```

**React to Message:**
```js
await sock.newsletterReactMessage('1234567890@newsletter', serverId, '\u2764\uFE0F');
await sock.newsletterReactMessage('1234567890@newsletter', serverId, null); // remove reaction
```

**Fetch Messages:**
```js
const messages = await sock.newsletterFetchMessages('1234567890@newsletter', 10);
const older = await sock.newsletterFetchMessages('1234567890@newsletter', 10, sinceTimestamp);
const after = await sock.newsletterFetchMessages('1234567890@newsletter', 10, undefined, afterServerId);
```

**Subscribe to Live Updates:**
```js
const result = await sock.subscribeNewsletterUpdates('1234567890@newsletter');
// { duration } or null
```

### Admin

```js
const count = await sock.newsletterAdminCount('1234567890@newsletter');
await sock.newsletterChangeOwner('1234567890@newsletter', '628xxx@s.whatsapp.net');
await sock.newsletterDemote('1234567890@newsletter', '628xxx@s.whatsapp.net');
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `newsletter.reaction` | `{ id, server_id, reaction: { code, count } }` | Newsletter message reaction |
| `newsletter.view` | `{ id, server_id, count }` | Newsletter view count |
| `newsletter-settings.update` | `{ id, update: { name?, description? } }` | Newsletter settings changed |
| `newsletter-participants.update` | `{ id, author, user, action, new_role }` | Admin promote/demote |

---

## Community API

### Create Community

```js
const community = await sock.communityCreate('My Community', { description: '...' });
```

### Create Sub-group in Community

```js
const group = await sock.communityCreateGroup(communityId, 'Sub Group');
```

### Link / Unlink Sub-group

```js
await sock.communityLinkSubGroup(communityId, subgroupJid);
await sock.communityUnlinkSubGroup(communityId, subgroupJid);
```

### Leave Community

```js
await sock.communityLeave(communityId);
```

### Membership Approval

```js
await sock.communityAcceptRequest(communityId, requesterJid);
await sock.communityRejectRequest(communityId, requesterJid);
```

### Invite Codes

```js
const code = await sock.communityInviteCode(communityId);
await sock.communityRevokeInviteCode(communityId);
```

---

## Socket Architecture

Each socket layer extends the previous via composition:

```
makeSocket -> WebSocket + Noise protocol + pre-key management
  makeChatsSocket -> App state sync + chat modifications + profile
    makeGroupsSocket -> Group CRUD + participant management
      makeNewsletterSocket -> Newsletter follow/unfollow/metadata
        makeMessagesSendSocket -> Message sending + relay + MessageBuilders
          makeMessagesRecvSocket -> Message receiving + decryption + retry
            makeBusinessSocket -> Product catalog + business profile
              makeCommunitiesSocket -> Community CRUD + sub-groups
                makeWASocket <- Top-level export
```

---

## Differences from Official Baileys

Feature comparison between **yelib (miuujs/baileys)** and **Official Baileys ([@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) v7)**.

All features below were verified from the source code.

| # | Feature | Official | yelib | Source Reference |
|---|---------|:-------:|:-----:|------------------|
| 1 | Text / Image / Video / Audio / Sticker / Document | Yes | Yes | Standard message types |
| 2 | Location / Contact / Reaction / Poll | Yes | Yes | Standard message types |
| 3 | Edit / Delete / Forward Message | Yes | Yes | Standard message types |
| 4 | Group CRUD + Participant Management | Yes | Yes | `Socket/groups.js` |
| 5 | Community CRUD + Sub-groups | Yes | Yes | `Socket/communities.js` |
| 6 | Newsletter Follow / Unfollow / Metadata | Yes | Yes | `Socket/newsletter.js` |
| 7 | Business Profile & Product Catalog | Yes | Yes | `Socket/business.js` |
| 8 | App State Sync + Chat Modifications | Yes | Yes | `Socket/chats.js` |
| 9 | WebSocket + Noise Protocol + Pre-key | Yes | Yes | `Socket/socket.js` |
| 10 | Native Flow Buttons (interactiveMessage) | No | Yes | `Socket/messages-send.js:1155` |
| 11 | List Menu (single_select) | No | Yes | `Socket/messages-send.js:1155` |
| 12 | Carousel Message | No | Yes | `Socket/messages-send.js:1155` |
| 13 | Album Message (multi media) | No | Yes | `Utils/messages.js:465-470` |
| 14 | AI Rich Response -- Table V1 / V2 | No | Yes | `Utils/rich-messages.js:158-227` |
| 15 | AI Rich Response -- Code Block V1 / V2 | No | Yes | `Utils/rich-messages.js:180-244` |
| 16 | AI Rich Response -- Link Message | No | Yes | `Utils/rich-messages.js:246-300` |
| 17 | AI Rich Response -- List Info | No | Yes | `Utils/rich-messages.js:169-178` |
| 18 | AI Rich Response -- Rich Message (Custom Submessages) | No | Yes | `Utils/rich-messages.js:190-193` |
| 19 | Latex Rendering (RichSubMessageType) | No | Yes | `Utils/rich-messages.js:35` |
| 20 | Event Message + Encrypted Response | No | Yes | `Utils/messages.js:410-429`, `Utils/process-message.js:362-408` |
| 21 | Poll Result Message | No | Yes | `Socket/message-builders.js` |
| 22 | Poll Creation V3 (single-select) | No | Yes | `Utils/messages.js:455-462` |
| 23 | Product Message (viewOnce + interactive) | No | Yes | `Socket/message-builders.js` |
| 24 | Payment Request | No | Yes | `Socket/message-builders.js` |
| 25 | Group Status Message / V2 | No | Yes | `Utils/messages.js:657-658`, `Socket/message-builders.js` |
| 26 | Status Mentions (proto field) | No | Yes | `WAProto/WAProto.proto:5222` |
| 27 | Button Features (limited time offer, bottom sheet, tap target) | No | Yes | `Socket/messages-send.js:16-22` |
| 28 | Business Metadata Nodes for Buttons (ported from ourin-baileys) | No | Yes | `WABinary/generic-utils.js:137-190`, `Socket/messages-send.js:24-35,944-948` |
| 29 | Capture & Resend Unified Response | No | Yes | `Utils/rich-messages.js:302-313` |
| 30 | Forwarded AI Bot Info (Meta AI style) | No | Yes | `Utils/rich-messages.js:142-150` |
| 31 | Full LID <-> PN Mapping System | No | Yes | `Signal/lid-mapping.js`, `WAUSync/Protocols/UsyncLIDProtocol.js` |
| 32 | LID Session Migration | No | Yes | `Signal/libsignal.js:237-351` |
| 33 | LID/PN Dual Addressing | No | Yes | `Utils/decode-wa-message.js:60-78` |
| 34 | MessageRetryManager (base key collision detection) | No | Yes | `Utils/message-retry-manager.js` |
| 35 | Newsletter Create + Delete via MEX GraphQL | No | Yes | `Socket/newsletter.js`, `Socket/mex.js` |
| 36 | Newsletter Admin (Change Owner, Demote, Admin Count) | No | Yes | `Socket/newsletter.js` |
| 37 | Newsletter Settings (Name, Description, Picture, Mute) | No | Yes | `Socket/newsletter.js` |
| 38 | Newsletter React + Fetch Messages | No | Yes | `Socket/newsletter.js:106` |
| 39 | Newsletter Live Updates Subscription | No | Yes | `Socket/newsletter.js:151` |
| 40 | Newsletter Subscribers Count | No | Yes | `Socket/newsletter.js:65` |
| 41 | Group Member Labeling | No | Yes | `Socket/messages-send.js:135-156` |
| 42 | On-demand History Sync | No | Yes | `Socket/messages-recv.js:47-64` |
| 43 | Media Re-upload (updateMediaMessage) | No | Yes | `Socket/messages-send.js:1104-1150` |
| 44 | Peer Data Operation Messages | No | Yes | `Socket/messages-send.js:374-402` |
| 45 | Reporting Token System | No | Yes | `Utils/reporting-utils.js` |
| 46 | TC Token System (Trusted Contact) | No | Yes | `Utils/tc-token-utils.js` |
| 47 | Privacy Token Handling | No | Yes | `Socket/messages-recv.js:1084-1104` |
| 48 | Reachout Timelock Enforcement | No | Yes | `Types/State.js:10-29`, `Socket/messages-recv.js:175-211` |
| 49 | Message Capping System | No | Yes | `Socket/messages-recv.js:213-223` |
| 50 | Identity Change Handler | No | Yes | `Utils/identity-change-handler.js` |
| 51 | WAM Analytics/Metrics Encoding | No | Yes | `WAM/` (BinaryInfo, encode, constants) |
| 52 | Bot Profile USync Protocol | No | Yes | `WAUSync/Protocols/UsyncBotProfileProtocol.js` |
| 53 | Status WhatsApp with Mentions | No | Yes | `Socket/message-builders.js` |
| 54 | MessageBuilders System (auto type routing) | No | Yes | `Socket/message-builders.js` |

> [!IMPORTANT]
> Official Baileys refers to the original [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) v7.
> yelib (miuujs/baileys) is a fork that extends the original with 40+ additional features including interactive messages, album messages, AI rich response system, full LID mapping, event messages, payment support, newsletter GraphQL API, retry manager, MessageBuilders system, business metadata nodes for buttons (ported from ourin-baileys), and various security/privacy systems. All features listed above are verified from the source code.

---
