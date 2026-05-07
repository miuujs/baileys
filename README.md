<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=42&pause=1000&color=25D366&center=true&vCenter=true&width=435&lines=yelib" alt="yelib"/>
  <br/>
  <sub>WhatsApp Web API Library &mdash; based on @whiskeysockets/baileys v7.0.0-rc10</sub>
</p>

---

## Interactive Messages

All interactive message types are fully defined in WAProto. Since `sendMessage` does not have high-level helpers for these, use `generateWAMessageFromContent` or `relayMessage` directly.

### Native Flow Buttons

```js
import { proto, generateWAMessageFromContent } from "baileys";

const msg = generateWAMessageFromContent(jid, {
  interactiveMessage: proto.Message.InteractiveMessage.create({
    header: proto.Message.InteractiveMessage.Header.create({
      title: "Welcome",
      subtitle: "Choose an option",
      hasMediaAttachment: false,
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: "This is an interactive message with native flow buttons.",
    }),
    footer: proto.Message.InteractiveMessage.Footer.create({
      text: "Footer text here",
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "Yes",
            id: "yes",
          }),
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "No",
            id: "no",
          }),
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "Visit Site",
            url: "https://example.com",
            merchant_url: "https://example.com",
          }),
        },
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "Copy Code",
            copy_code: "ABC123",
          }),
        },
        {
          name: "cta_call",
          buttonParamsJson: JSON.stringify({
            display_text: "Call Us",
            phone_number: "+628123456789",
          }),
        },
        {
          name: "cta_reminder",
          buttonParamsJson: JSON.stringify({
            display_text: "Set Reminder",
            reminder: {
              reminder_time: Math.floor(Date.now() / 1000) + 3600,
              reminder_title: "Meeting",
            },
          }),
        },
        {
          name: "catalog",
          buttonParamsJson: JSON.stringify({
            display_text: "View Catalog",
          }),
        },
      ],
    }),
  }),
}, {});

await sock.relayMessage(jid, msg.message, {});
```

### Native Flow Buttons with Image

```js
import { proto, generateWAMessageFromContent, downloadMediaMessage } from "baileys";

const msg = generateWAMessageFromContent(jid, {
  interactiveMessage: proto.Message.InteractiveMessage.create({
    header: proto.Message.InteractiveMessage.Header.create({
      hasMediaAttachment: true,
      imageMessage: proto.Message.ImageMessage.create({
        url: "https://example.com/image.jpg",
        mimetype: "image/jpeg",
        caption: "Image caption",
      }),
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: "Body text",
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "OK",
            id: "ok",
          }),
        },
      ],
    }),
  }),
}, {});

await sock.relayMessage(jid, msg.message, {});
```

### Native Flow Buttons with Video

```js
const msg = generateWAMessageFromContent(jid, {
  interactiveMessage: proto.Message.InteractiveMessage.create({
    header: proto.Message.InteractiveMessage.Header.create({
      hasMediaAttachment: true,
      videoMessage: proto.Message.VideoMessage.create({
        url: "https://example.com/video.mp4",
        mimetype: "video/mp4",
        caption: "Video caption",
      }),
    }),
    body: proto.Message.InteractiveMessage.Body.create({
      text: "Body text",
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "Watch Later",
            id: "later",
          }),
        },
      ],
    }),
  }),
}, {});

await sock.relayMessage(jid, msg.message, {});
```

### List Message

```js
import { proto } from "baileys";

const listMsg = proto.Message.ListMessage.create({
  title: "Options",
  description: "Select one:",
  buttonText: "CHOOSE",
  listType: proto.Message.ListMessage.ListType.SINGLE_SELECT,
  sections: [
    {
      title: "Section 1",
      rows: [
        {
          title: "Option A",
          description: "Description for A",
          rowId: "a",
        },
        {
          title: "Option B",
          description: "Description for B",
          rowId: "b",
        },
      ],
    },
    {
      title: "Section 2",
      rows: [
        {
          title: "Option C",
          description: "Description for C",
          rowId: "c",
        },
      ],
    },
  ],
});

await sock.relayMessage(jid, { listMessage: listMsg }, {});
```

### Legacy Buttons Message

```js
import { proto } from "baileys";

const buttonsMsg = proto.Message.ButtonsMessage.create({
  text: "Legacy buttons message",
  footer: "Footer",
  headerType: proto.Message.ButtonsMessage.HeaderType.EMPTY,
  buttons: [
    {
      buttonId: "btn1",
      buttonText: { displayText: "Button 1" },
      type: proto.Message.ButtonsMessage.Button.ButtonType.RESPONSE,
    },
    {
      buttonId: "btn2",
      buttonText: { displayText: "Button 2" },
      type: proto.Message.ButtonsMessage.Button.ButtonType.RESPONSE,
    },
  ],
});

await sock.relayMessage(jid, { buttonsMessage: buttonsMsg }, {});
```

### Legacy Buttons with Image

```js
import { proto } from "baileys";

const buttonsMsg = proto.Message.ButtonsMessage.create({
  imageMessage: proto.Message.ImageMessage.create({
    url: "https://example.com/img.jpg",
    mimetype: "image/jpeg",
  }),
  text: "Caption text",
  footer: "Footer",
  headerType: proto.Message.ButtonsMessage.HeaderType.IMAGE,
  buttons: [
    {
      buttonId: "ok",
      buttonText: { displayText: "OK" },
      type: proto.Message.ButtonsMessage.Button.ButtonType.RESPONSE,
    },
  ],
});

await sock.relayMessage(jid, { buttonsMessage: buttonsMsg }, {});
```

### Template Message

```js
import { proto } from "baileys";

const templateMsg = proto.Message.TemplateMessage.create({
  hydratedTemplate: proto.Message.HydratedFourRowTemplate.create({
    hydratedTitleText: "Template Title",
    hydratedContentText: "Content here",
    hydratedFooterText: "Footer",
    hydratedButtons: [
      {
        index: 0,
        urlButton: {
          displayText: "Open Link",
          url: "https://example.com",
        },
      },
      {
        index: 1,
        callButton: {
          displayText: "Call",
          phoneNumber: "+628123456789",
        },
      },
      {
        index: 2,
        quickReplyButton: {
          displayText: "Reply",
          id: "reply_1",
        },
      },
    ],
  }),
});

await sock.relayMessage(jid, { templateMessage: templateMsg }, {});
```

### Carousel Message

```js
import { proto } from "baileys";

const carousel = proto.Message.InteractiveMessage.create({
  body: proto.Message.InteractiveMessage.Body.create({
    text: "Swipe through options",
  }),
  carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
    cards: [
      {
        header: {
          title: "Card 1",
          hasMediaAttachment: false,
        },
        body: { text: "Description for card 1" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "Select",
                id: "card1",
              }),
            },
          ],
        },
      },
    ],
  }),
});

await sock.relayMessage(jid, { interactiveMessage: carousel }, {});
```

### Collection Message (Shop)

```js
import { proto } from "baileys";

const collection = proto.Message.InteractiveMessage.create({
  body: proto.Message.InteractiveMessage.Body.create({
    text: "Browse our collection",
  }),
  shopStorefrontMessage: proto.Message.InteractiveMessage.ShopStorefrontMessage.create({
    surface: proto.Message.InteractiveMessage.ShopStorefrontMessage.Surface.DESKTOP,
    message: "Check out our products",
    merchantJid: "628123456789@s.whatsapp.net",
  }),
});

await sock.relayMessage(jid, { interactiveMessage: collection }, {});
```

---

## ContextInfo

ContextInfo provides quoting, mentions, forwarding metadata, and external ad reply context.

### Quote / Reply to a Message

```js
await sock.sendMessage(jid, { text: "This is a reply" }, {
  quoted: originalMessage,
});
```

### Mention Users

```js
await sock.sendMessage(jid, {
  text: "Hello @6281234567890",
  mentions: ["6281234567890@s.whatsapp.net"],
});
```

### Combined Quote with Mentions

```js
await sock.sendMessage(jid, { text: "Reply with @6281234567890" }, {
  quoted: originalMessage,
  mentions: ["6281234567890@s.whatsapp.net"],
});
```

### ContextInfo on Interactive Messages

```js
import { proto } from "baileys";

const msg = proto.Message.InteractiveMessage.create({
  body: { text: "Message with context" },
  contextInfo: proto.Message.ContextInfo.create({
    stanzaId: originalMessage.key.id,
    participant: originalMessage.key.participant || originalMessage.key.remoteJid,
    quotedMessage: originalMessage.message,
    remoteJid: originalMessage.key.remoteJid,
    mentionedJid: ["6281234567890@s.whatsapp.net"],
    conversionSource: "source",
    conversionData: Buffer.from("data"),
    externalAdReply: proto.Message.ContextInfo.ExternalAdReply.create({
      title: "Ad Title",
      body: "Ad body",
      mediaType: 2,
      thumbnailUrl: "https://example.com/thumb.jpg",
      sourceUrl: "https://example.com",
      sourceType: "URL",
      renderLargerThumbnail: false,
      showAdAttribution: true,
    }),
    forwardingScore: 0,
    isForwarded: false,
    quotedAd: {
      adContextInfo: {
        adReply: {
          advertiserName: "Brand",
          mediaType: 2,
        },
      },
    },
  }),
  nativeFlowMessage: {
    buttons: [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: "OK", id: "ok" }),
      },
    ],
  },
});

await sock.relayMessage(jid, { interactiveMessage: msg }, {});
```

### Forward as Original

```js
await sock.sendMessage(jid, { forward: originalMessage });
```

### Forward with Context

```js
const contextInfo = proto.Message.ContextInfo.create({
  forwardingScore: 1,
  isForwarded: true,
  quotedMessage: originalMessage.message,
  participant: originalMessage.key.participant || originalMessage.key.remoteJid,
  stanzaId: originalMessage.key.id,
  remoteJid: originalMessage.key.remoteJid,
  conversionSource: "source",
  conversionData: Buffer.from("data"),
});

const msg = proto.Message.ExtendedTextMessage.create({
  text: "Forwarded message",
  contextInfo,
});

await sock.relayMessage(jid, { extendedTextMessage: msg }, {});
```

### ViewOnce

```js
await sock.sendMessage(jid, {
  image: { url: "./photo.jpg" },
  caption: "View once photo",
  viewOnce: true,
});

await sock.sendMessage(jid, {
  video: { url: "./video.mp4" },
  caption: "View once video",
  viewOnce: true,
});

await sock.sendMessage(jid, {
  audio: { url: "./audio.ogg" },
  mimetype: "audio/ogg",
  viewOnce: true,
  ptt: true,
});
```

### External Ad Reply

```js
import { proto, generateWAMessageFromContent } from "baileys";

const msg = generateWAMessageFromContent(jid, {
  extendedTextMessage: proto.Message.ExtendedTextMessage.create({
    text: "Sponsored message",
    contextInfo: proto.Message.ContextInfo.create({
      externalAdReply: proto.Message.ContextInfo.ExternalAdReply.create({
        title: "Product Name",
        body: "Product description here",
        mediaType: 2,
        thumbnailUrl: "https://example.com/thumb.jpg",
        sourceUrl: "https://example.com",
        sourceType: "URL",
        renderLargerThumbnail: true,
        showAdAttribution: true,
        mediaUrl: "https://example.com/media.jpg",
        advertiserName: "Brand",
      }),
    }),
  }),
}, {});

await sock.relayMessage(jid, msg.message, {});
```

---

## Rich Text / Extended Text

### Text Formatting

```js
// Bold: *text*
// Italic: _text_
// Strikethrough: ~text~
// Monospace: ```text```

await sock.sendMessage(jid, {
  text: "*Bold* _Italic_ ~Strikethrough~ ```Monospace```",
});
```

### Link with Preview

```js
// make sure `link-preview-js` dependency is installed

await sock.sendMessage(jid, {
  text: "Check this: https://github.com/whiskeysockets/baileys",
});
```

### Extended Text Message with ContextInfo

```js
import { proto, generateWAMessageFromContent } from "baileys";

const msg = generateWAMessageFromContent(jid, {
  extendedTextMessage: proto.Message.ExtendedTextMessage.create({
    text: "Rich text with mentions and title",
    matchedText: "https://example.com",
    canonicalUrl: "https://example.com",
    description: "Link description here",
    title: "Link Title",
    previewType: 2,
    jpegThumbnail: Buffer.from("..."),
    contextInfo: proto.Message.ContextInfo.create({
      mentionedJid: ["6281234567890@s.whatsapp.net"],
      externalAdReply: proto.Message.ContextInfo.ExternalAdReply.create({
        title: "Title",
        body: "Body",
        mediaType: 2,
        thumbnailUrl: "https://example.com/thumb.jpg",
        sourceUrl: "https://example.com",
      }),
    }),
  }),
}, {});

await sock.relayMessage(jid, msg.message, {});
```

---

## Rich Messages

### Poll Message

```js
await sock.sendMessage(jid, {
  poll: {
    name: "Best programming language?",
    values: ["JavaScript", "Python", "Go", "Rust"],
    selectableCount: 1,
    toAnnouncementGroup: false,
  },
});
```

### Poll with Multiple Votes

```js
await sock.sendMessage(jid, {
  poll: {
    name: "Choose your toppings (multiple)",
    values: ["Cheese", "Pepperoni", "Mushrooms", "Olives"],
    selectableCount: 3,
  },
});
```

### Reaction Message

```js
await sock.sendMessage(jid, {
  react: {
    text: "❤️",
    key: targetMessage.key,
  },
});

// Remove reaction (empty string)
await sock.sendMessage(jid, {
  react: {
    text: "",
    key: targetMessage.key,
  },
});
```

### Location Message

```js
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.2088,
    degreesLongitude: 106.8456,
    name: "Monas",
    address: "Central Jakarta",
    isLivelocation: false,
    accuracyInMeters: 10,
    degreesClockwiseFromMagneticNorth: 0,
    comment: "Meeting point",
    url: "https://maps.google.com/?q=-6.2088,106.8456",
  },
});
```

### Live Location

```js
import { proto } from "baileys";

const liveLoc = proto.Message.LiveLocationMessage.create({
  degreesLatitude: -6.2088,
  degreesLongitude: 106.8456,
  accuracyInMeters: 10,
  speedInMps: 0,
  degreesClockwiseFromMagneticNorth: 0,
  caption: "On my way",
  sequenceNumber: 1,
  timeOffset: 0,
  contextInfo: {},
});

await sock.relayMessage(jid, { liveLocationMessage: liveLoc }, {});
```

### Contact Message

```js
const vcard =
  "BEGIN:VCARD\n" +
  "VERSION:3.0\n" +
  "FN:John Doe\n" +
  "ORG:Company\n" +
  "TEL;type=CELL;type=VOICE;waid=6281234567890:+62 812 3456 7890\n" +
  "EMAIL:john@example.com\n" +
  "ADR:;;Street;City;;;\n" +
  "URL:https://example.com\n" +
  "NOTE:Contact note\n" +
  "END:VCARD";

await sock.sendMessage(jid, {
  contacts: {
    displayName: "John Doe",
    contacts: [{ vcard }],
  },
});
```

### Multiple Contacts

```js
await sock.sendMessage(jid, {
  contacts: {
    displayName: "Contacts",
    contacts: [
      { vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Alice\nEND:VCARD" },
      { vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Bob\nEND:VCARD" },
    ],
  },
});
```

### Group Invite Message

```js
import { proto } from "baileys";

const invite = proto.Message.GroupInviteMessage.create({
  groupJid: "123456789-123456@g.us",
  inviteCode: "abc123def",
  inviteExpiration: Math.floor(Date.now() / 1000) + 86400,
  groupName: "My Group",
  caption: "Join us!",
});

await sock.relayMessage(jid, { groupInviteMessage: invite }, {});
```

### Product Message

```js
import { proto } from "baileys";

const product = proto.Message.ProductMessage.create({
  product: {
    productId: "product_123",
    title: "Cool Product",
    description: "Product description",
    currencyCode: "USD",
    priceAmount1000: 19999,
    retailerId: "retailer_1",
    productImageCount: 3,
  },
  businessOwnerJid: "6281234567890@s.whatsapp.net",
  contextInfo: {},
});

await sock.relayMessage(jid, { productMessage: product }, {});
```

### Order Message

```js
import { proto } from "baileys";

const order = proto.Message.OrderMessage.create({
  orderId: "order_001",
  thumbnail: Buffer.from("..."),
  itemCount: 2,
  status: proto.Message.OrderMessage.OrderStatus.PENDING,
  surface: proto.Message.OrderMessage.OrderSurface.MAGENTA,
  message: "Thank you for your order",
  orderTitle: "Order #001",
  sellerJid: "6281234567890@s.whatsapp.net",
  token: "token_value",
  totalAmount1000: 50000,
  totalCurrencyCode: "IDR",
  contextInfo: {},
});

await sock.relayMessage(jid, { orderMessage: order }, {});
```

### Event Message (Calendar)

```js
import { proto } from "baileys";

const event = proto.Message.EventMessage.create({
  name: "Team Meeting",
  description: "Weekly sync",
  startTime: Math.floor(Date.now() / 1000) + 3600,
  endTime: Math.floor(Date.now() / 1000) + 7200,
  location: {
    degreesLatitude: -6.2088,
    degreesLongitude: 106.8456,
    name: "Office",
  },
  isCanceled: false,
});

await sock.relayMessage(jid, { eventMessage: event }, {});
```

### Voice Message (PTT)

```js
await sock.sendMessage(jid, {
  audio: { url: "./recording.ogg" },
  mimetype: "audio/ogg",
  ptt: true,
});
```

### Sticker Message

```js
import { proto } from "baileys";

// Send from buffer
await sock.sendMessage(jid, {
  sticker: Buffer.from(stickerBuffer),
});

// Send from URL
await sock.sendMessage(jid, {
  sticker: { url: "https://example.com/sticker.webp" },
});
```

### Gif Message

```js
await sock.sendMessage(jid, {
  video: { url: "./animation.mp4" },
  gifPlayback: true,
  caption: "Animated gif",
});
```

### Video Note (PTV)

```js
await sock.sendMessage(jid, {
  video: { url: "./video.mp4" },
  ptv: true,
  caption: "Video note",
});
```

### Edit Message

```js
const sent = await sock.sendMessage(jid, { text: "Original text" });

await sock.sendMessage(jid, {
  text: "Edited text",
  edit: sent.key,
});
```

### Delete Message

```js
// For everyone
await sock.sendMessage(jid, { delete: msg.key });

// For me only
await sock.chatModify(
  {
    clear: {
      messages: [{ id: msg.key.id, fromMe: true, timestamp: msg.messageTimestamp }],
    },
  },
  jid
);
```

### Pin Message

```js
// Pin (86400 = 24h, 604800 = 7d, 2592000 = 30d)
await sock.sendMessage(jid, {
  pin: {
    type: 1, // 0 to unpin
    time: 86400,
    key: msg.key,
  },
});

// Unpin
await sock.sendMessage(jid, {
  pin: {
    type: 0,
    key: msg.key,
  },
});
```

### Disappearing Messages

```js
// Set chat ephemeral (86400 = 24h, 604800 = 7d, 7776000 = 90d)
await sock.sendMessage(jid, { disappearingMessagesInChat: 86400 });

// Send message with custom ephemeral
await sock.sendMessage(jid, { text: "Will disappear" }, { ephemeralExpiration: 86400 });

// Disable disappearing messages
await sock.sendMessage(jid, { disappearingMessagesInChat: false });
```

---

## Handling Interactive Responses

```js
sock.ev.on("messages.upsert", ({ messages }) => {
  for (const msg of messages) {
    const content = msg.message;
    if (content?.buttonsResponseMessage) {
      const btn = content.buttonsResponseMessage;
      console.log("Button reply:", btn.selectedButtonId, btn.selectedDisplayText);
    }
    if (content?.listResponseMessage) {
      const list = content.listResponseMessage;
      console.log("List reply:", list.singleSelectReply?.selectedRowId, list.title);
    }
    if (content?.interactiveResponseMessage) {
      const ir = content.interactiveResponseMessage;
      if (ir.nativeFlowResponseMessage) {
        const data = JSON.parse(ir.nativeFlowResponseMessage.responseJson);
        console.log("Native flow reply:", data);
      }
    }
    if (content?.templateButtonReplyMessage) {
      console.log("Template reply:", content.templateButtonReplyMessage.selectedId);
    }
  }
});
```

---

## Acknowledgements

Based on [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) v7.0.0-rc10 by Rajeh Taher & the WhiskeySockets community.
