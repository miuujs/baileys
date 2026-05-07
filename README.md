<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=42&pause=1000&color=25D366&center=true&vCenter=true&width=435&lines=yelib" alt="yelib"/>
  <br/>
  <sub>WhatsApp Web API Library &mdash; based on @whiskeysockets/baileys v7.0.0-rc10</sub>
</p>

---

<details>
<summary><strong>Interactive Messages (Buttons, List, Template, Carousel, Shop)</strong></summary>

| Fitur | Keterangan |
|-------|------------|
| Native Flow Buttons | Tombol interaktif native (reply, url, copy, call, reminder, catalog) |
| Native Flow Buttons + Image/Video | Tombol dengan media header |
| List Message | Daftar pilihan dengan section dan row |
| Legacy Buttons Message | Tombol gaya lama (ButtonsMessage) |
| Template Message | Template 4 baris dengan tombol URL/Call/QR |
| Carousel Message | Kartu horizontal yang bisa digeser |
| Collection Message (Shop) | Katalog/toko |

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

</details>

<details>
<summary><strong>Meta AI Rich Response (AIRichResponseMessage)</strong></summary>

| Fitur | Keterangan |
|-------|------------|
| Receiving Rich Response | Handler untuk menangkap `richResponseMessage` |
| Grid Image | Gambar grid dari Meta AI |
| Inline Image | Gambar dengan alignment teks |
| Code Block | Blok kode dengan syntax highlighting |
| Table | Tabel data |
| Map | Peta dengan anotasi |
| Dynamic Content | GIF/animasi |
| LaTeX Expression | Rumus matematika |
| Content Items (Carousel/Reels) | Konten video carousel |
| Source Citations | Kutipan sumber (Bing/Google/dll) |
| Bot Metadata | Field metadata bot (responseId, persona, dll) |
| Question Response | Jawaban pertanyaan status |
| Event Response (RSVP) | Respon acara (Going/Not Going/Maybe) |

Meta AI sends rich responses as field `richResponseMessage` (field 97) in the `Message` container. Each rich response contains one or more `submessages` of different types.

### Receiving Meta AI Rich Responses

```js
sock.ev.on("messages.upsert", ({ messages }) => {
  for (const msg of messages) {
    const rich = msg.message?.richResponseMessage;
    if (!rich) continue;

    for (const sub of rich.submessages) {
      switch (sub.messageType) {
        case 1: // AI_RICH_RESPONSE_GRID_IMAGE
          console.log("Grid image:", sub.gridImageMetadata);
          break;
        case 2: // AI_RICH_RESPONSE_TEXT
          console.log("Text:", sub.messageText);
          break;
        case 3: // AI_RICH_RESPONSE_INLINE_IMAGE
          console.log("Inline image:", sub.imageMetadata);
          break;
        case 4: // AI_RICH_RESPONSE_TABLE
          console.log("Table:", sub.tableMetadata);
          break;
        case 5: // AI_RICH_RESPONSE_CODE
          console.log("Code block:", sub.codeMetadata);
          break;
        case 6: // AI_RICH_RESPONSE_DYNAMIC
          console.log("Dynamic content:", sub.dynamicMetadata);
          break;
        case 7: // AI_RICH_RESPONSE_MAP
          console.log("Map:", sub.mapMetadata);
          break;
        case 8: // AI_RICH_RESPONSE_LATEX
          console.log("Latex:", sub.latexMetadata);
          break;
        case 9: // AI_RICH_RESPONSE_CONTENT_ITEMS
          console.log("Content items:", sub.contentItemsMetadata);
          break;
      }
    }
  }
});
```

### Rich Response Submessage Types

| Type | Value | Metadata | Description |
|------|-------|----------|-------------|
| `AI_RICH_RESPONSE_GRID_IMAGE` | 1 | `AIRichResponseGridImageMetadata` | Grid of images |
| `AI_RICH_RESPONSE_TEXT` | 2 | `string messageText` | Plain text segment |
| `AI_RICH_RESPONSE_INLINE_IMAGE` | 3 | `AIRichResponseInlineImageMetadata` | Image with text alignment |
| `AI_RICH_RESPONSE_TABLE` | 4 | `AIRichResponseTableMetadata` | Data table with rows |
| `AI_RICH_RESPONSE_CODE` | 5 | `AIRichResponseCodeMetadata` | Code block with syntax highlighting |
| `AI_RICH_RESPONSE_DYNAMIC` | 6 | `AIRichResponseDynamicMetadata` | Animated image/GIF |
| `AI_RICH_RESPONSE_MAP` | 7 | `AIRichResponseMapMetadata` | Map with annotations |
| `AI_RICH_RESPONSE_LATEX` | 8 | `AIRichResponseLatexMetadata` | LaTeX mathematical expressions |
| `AI_RICH_RESPONSE_CONTENT_ITEMS` | 9 | `AIRichResponseContentItemsMetadata` | Content carousel/reels |

### Grid Image

```js
// AIRichResponseGridImageMetadata
{
  gridImageUrl: {
    imagePreviewUrl: "https://...preview.jpg",
    imageHighResUrl: "https://...hq.jpg",
    sourceUrl: "https://source.com",
  },
  imageUrls: [
    { imagePreviewUrl: "...", imageHighResUrl: "..." },
  ],
}
```

### Inline Image

```js
// AIRichResponseInlineImageMetadata
{
  imageUrl: {
    imagePreviewUrl: "https://...preview.jpg",
    imageHighResUrl: "https://...hq.jpg",
  },
  imageText: "A scenic mountain view",
  alignment: 0, // LEADING=0, TRAILING=1, CENTER=2
  tapLinkUrl: "https://example.com",
}
```

### Code Block

```js
// AIRichResponseCodeMetadata
{
  codeLanguage: "javascript",
  codeBlocks: [
    {
      highlightType: 0, // DEFAULT=0, KEYWORD=1, METHOD=2, STRING=3, NUMBER=4, COMMENT=5
      codeContent: "const x = 42;",
    },
  ],
}
```

### Table

```js
// AIRichResponseTableMetadata
{
  title: "Population by City",
  rows: [
    { items: ["City", "Population", "Area"], isHeading: true },
    { items: ["Jakarta", "10M", "661 km²"], isHeading: false },
    { items: ["Bandung", "2.5M", "167 km²"], isHeading: false },
  ],
}
```

### Map

```js
// AIRichResponseMapMetadata
{
  centerLatitude: -6.2088,
  centerLongitude: 106.8456,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
  showInfoList: true,
  annotations: [
    {
      annotationNumber: 1,
      latitude: -6.2088,
      longitude: 106.8456,
      title: "Monas",
      body: "National Monument",
    },
  ],
}
```

### Dynamic Content (GIF/Animation)

```js
// AIRichResponseDynamicMetadata
{
  type: 1, // IMAGE=1, GIF=2
  version: 1,
  url: "https://...animation.gif",
  loopCount: 3,
}
```

### LaTeX Expression

```js
// AIRichResponseLatexMetadata
{
  text: "The quadratic formula:",
  expressions: [
    {
      latexExpression: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      url: "https://...latex-render.png",
      width: 200.0,
      height: 50.0,
      fontHeight: 14.0,
    },
  ],
}
```

### Content Items (Carousel/Reels)

```js
// AIRichResponseContentItemsMetadata
{
  contentType: 1, // DEFAULT=0, CAROUSEL=1
  itemsMetadata: [
    {
      reelItem: {
        title: "Video Title",
        profileIconUrl: "https://...icon.jpg",
        thumbnailUrl: "https://...thumb.jpg",
        videoUrl: "https://...video.mp4",
      },
    },
  ],
}
```

### Source Citations (BotSourcesMetadata)

```js
sock.ev.on("messages.upsert", ({ messages }) => {
  for (const msg of messages) {
    const botMeta = msg.messageContextInfo?.botMetadata;
    if (!botMeta) continue;

    const sources = botMeta.richResponseSourcesMetadata;
    if (sources) {
      for (const src of sources.sources) {
        console.log(`[${src.citationNumber}] ${src.sourceTitle}`);
        console.log("  URL:", src.sourceProviderUrl);
        console.log("  Provider:", src.provider);
        console.log("  Query:", src.sourceQuery);
      }
    }
  }
});
```

### Bot Metadata Fields

| Field | Type | Description |
|-------|------|-------------|
| `botResponseId` | `string` | Unique response ID |
| `richResponseSourcesMetadata` | `BotSourcesMetadata` | Source citations |
| `unifiedResponseMutation` | `BotUnifiedResponseMutation` | Response mutation/patching |
| `personaId` | `string` | AI persona identifier |
| `timezone` | `string` | User timezone |
| `messageDisclaimerText` | `string` | Disclaimer text |
| `regenerateMetadata` | `AIRegenerateMetadata` | Regeneration info |
| `botThreadInfo` | `AIThreadInfo` | Thread metadata |
| `sessionMetadata` | `BotSessionMetadata` | Session info |

### Question Response

```js
sock.ev.on("messages.upsert", ({ messages }) => {
  for (const msg of messages) {
    const qr = msg.message?.questionResponseMessage;
    if (qr) {
      console.log("Question response key:", qr.key);
      console.log("Response text:", qr.text);
    }
  }
});
```

### Event Response (RSVP)

```js
// Event responses appear in WebMessageInfo.eventResponses
// msg.eventResponses -> array of EventResponse
// {
//   eventResponseMessageKey: { ... },
//   timestampMs: 1234567890,
//   eventResponseMessage: {
//     response: 1, // UNKNOWN=0, GOING=1, NOT_GOING=2, MAYBE=3
//     timestampMs: 1234567890,
//     extraGuestCount: 0,
//   },
//   unread: false,
// }
```

</details>

Based on [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) v7.0.0-rc10 by Rajeh Taher & the WhiskeySockets community.
