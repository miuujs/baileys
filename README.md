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
