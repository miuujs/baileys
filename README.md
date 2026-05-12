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

# Code Examples

## Interactive Message (Native Flow Buttons) via WAProto

Mengirim tombol interaktif menggunakan `proto.Message.InteractiveMessage` langsung dari WAProto.

```js
import { proto } from 'baileys/WAProto/index.js';
import { generateWAMessageFromContent } from 'baileys/src/Utils/index.js';

const interactiveMsg = {
    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
        body: { text: 'Pilih opsi dibawah ini:' },
        footer: { text: '© yelib' },
        header: {
            title: 'Menu Utama',
            hasMediaAttachment: false
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Info',
                        id: '.info'
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
            ]
        }
    })
};

const msg = generateWAMessageFromContent(jid, interactiveMsg, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

## List Menu (Single Select)

Mengirim menu pilihan/list menggunakan `single_select`.

```js
const listMsg = {
    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
        body: { text: 'Pilih kategori:' },
        footer: { text: '© yelib' },
        header: { title: 'Bot Menu', hasMediaAttachment: false },
        nativeFlowMessage: {
            buttons: [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Pilih Menu',
                    sections: [
                        {
                            title: 'Games',
                            rows: [
                                { title: 'Quiz', id: '.quiz' },
                                { title: 'Tebak Gambar', id: '.tebak' }
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
            }]
        }
    })
};

const msg = generateWAMessageFromContent(jid, listMsg, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

## Buttons Message (Legacy)

Mengirim tombol gaya lama menggunakan `proto.Message.ButtonsMessage`.

```js
const buttonsMsg = {
    buttonsMessage: proto.Message.ButtonsMessage.fromObject({
        contentText: 'Klik tombol dibawah:',
        footerText: '© yelib',
        headerType: proto.Message.ButtonsMessage.HeaderType.EMPTY,
        buttons: [
            {
                buttonId: '.menu',
                buttonText: { displayText: '📋 Menu' },
                type: proto.Message.ButtonsMessage.Button.Type.RESPONSE
            },
            {
                buttonId: '.help',
                buttonText: { displayText: '❓ Bantuan' },
                type: proto.Message.ButtonsMessage.Button.Type.RESPONSE
            }
        ]
    })
};

const msg = generateWAMessageFromContent(jid, buttonsMsg, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

## Interactive Message dengan Media (Image/Video)

```js
import { prepareWAMessageMedia } from 'baileys/src/Utils/index.js';

const { imageMessage } = await prepareWAMessageMedia(
    { image: { url: 'https://example.com/banner.jpg' } },
    { upload: sock.waUploadToServer }
);

const mediaInteractive = {
    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
        body: { text: 'Lihat gambar ini!' },
        footer: { text: '© yelib' },
        header: {
            title: 'Promo Spesial',
            hasMediaAttachment: true,
            imageMessage
        },
        nativeFlowMessage: {
            buttons: [{
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: 'Beli',
                    id: '.buy'
                })
            }]
        }
    })
};

const msg = generateWAMessageFromContent(jid, mediaInteractive, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

## Carousel Message

Mengirim carousel multi-card dengan tombol NativeFlow.

```js
const carouselMsg = {
    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
        body: { text: 'Pilih produk:' },
        footer: { text: '© yelib' },
        header: { title: 'Katalog', hasMediaAttachment: false },
        carouselMessage: {
            messageVersion: 1,
            carouselCardType: proto.Message.InteractiveMessage.CarouselMessage.CarouselCardType.HSCROLL_CARDS,
            cards: [
                {
                    body: { text: 'Produk A - Rp 50.000' },
                    footer: { text: 'Diskon 10%' },
                    header: { title: 'Produk A', hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [{
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'Beli',
                                id: '.buy_a'
                            })
                        }]
                    }
                },
                {
                    body: { text: 'Produk B - Rp 75.000' },
                    footer: { text: 'Diskon 15%' },
                    header: { title: 'Produk B', hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [{
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'Beli',
                                id: '.buy_b'
                            })
                        }]
                    }
                }
            ]
        }
    })
};

const msg = generateWAMessageFromContent(jid, carouselMsg, {
    userJid: sock.user.id
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

## AI Rich Response (Table, Code Block, Text)

Mengirim pesan bergaya Meta AI dengan tabel, kode, dan teks kaya menggunakan `botForwardedMessage` > `richResponseMessage` dari WAProto.

### Rich Response - Table

```js
import { randomUUID, randomBytes } from 'crypto';

const tableData = {
    response_id: randomUUID(),
    sections: [
        {
            view_model: {
                primitive: {
                    text: 'Perbandingan Bahasa',
                    __typename: 'GenAIMarkdownTextUXPrimitive'
                },
                __typename: 'GenAISingleLayoutViewModel'
            }
        },
        {
            view_model: {
                primitive: {
                    rows: [
                        { items: ['Fitur', 'Java', 'JavaScript'], isHeading: true },
                        { items: ['Type', 'Compiled', 'Interpreted'] },
                        { items: ['Typing', 'Static', 'Dynamic'] },
                        { items: ['Platform', 'JVM', 'Node.js'] }
                    ],
                    __typename: 'GenATableUXPrimitive'
                },
                __typename: 'GenAISingleLayoutViewModel'
            }
        }
    ]
};

const tableMsg = {
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
                submessages: [
                    {
                        messageType: 2,
                        messageText: 'Perbandingan Bahasa Pemrograman'
                    }
                ],
                messageType: 1,
                unifiedResponse: {
                    data: Buffer.from(JSON.stringify(tableData)).toString('base64')
                },
                contextInfo: {
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: { botJid: '0@s.whatsapp.net' },
                    forwardOrigin: 4,
                    botMessageSharingInfo: {
                        botEntryPointOrigin: 1,
                        forwardScore: 2
                    }
                }
            }
        }
    }
};

const msg = generateWAMessageFromContent(jid, tableMsg, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

### Rich Response - Code Block

```js
const codeSections = {
    response_id: randomUUID(),
    sections: [
        {
            view_model: {
                primitive: {
                    text: 'Contoh kode JavaScript:',
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
                        { content: '() ', type: 'DEFAULT' },
                        { content: '{', type: 'DEFAULT' },
                        { content: '\n    return ', type: 'DEFAULT' },
                        { content: '"Hello World"', type: 'STR' },
                        { content: ';', type: 'DEFAULT' },
                        { content: '\n}', type: 'DEFAULT' }
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

const msg = generateWAMessageFromContent(jid, codeMsg, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

## Album Message (Multi Media)

Mengirim beberapa gambar/video dalam satu album.

```js
const album = await generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret: randomBytes(32) },
    albumMessage: {
        expectedImageCount: 2,
        expectedVideoCount: 1
    }
}, { userJid: sock.user.id });

await sock.relayMessage(jid, album.message, { messageId: album.key.id });

const items = [
    { image: { url: './photo1.jpg' }, caption: 'Foto 1' },
    { image: { url: './photo2.jpg' }, caption: 'Foto 2' },
    { video: { url: './video.mp4' }, caption: 'Video' }
];

for (const item of items) {
    const img = await generateWAMessageFromContent(jid, {
        messageContextInfo: { messageSecret: randomBytes(32) },
        ...await generateWAMessageContent(item, { upload: sock.waUploadToServer })
    }, { userJid: sock.user.id });
    await sock.relayMessage(jid, img.message, { messageId: img.key.id });
}
```

## Event Message

```js
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

const msg = generateWAMessageFromContent(jid, eventMsg, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

## Poll Creation & Result

```js
// Buat Poll
await sock.sendMessage(jid, {
    poll: {
        name: 'Bahasa Pemrograman Favorit?',
        values: ['JavaScript', 'Python', 'Go', 'Java'],
        selectableCount: 1
    }
});

// Kirim Poll Result
const pollResult = {
    pollResultMessage: proto.Message.PollResultMessage.fromObject({
        name: 'Bahasa Pemrograman Favorit?',
        pollVotes: [
            { optionName: 'JavaScript', optionVoteCount: 42 },
            { optionName: 'Python', optionVoteCount: 38 },
            { optionName: 'Go', optionVoteCount: 15 },
            { optionName: 'Java', optionVoteCount: 10 }
        ]
    })
};

const msg = generateWAMessageFromContent(jid, pollResult, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

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
                body: { text: 'Product terbaru!' },
                footer: { text: '© yelib' },
                header: {
                    title: 'Product Name',
                    hasMediaAttachment: true,
                    productMessage: {
                        product: {
                            productImage,
                            productId: 'P001',
                            title: 'Product Name',
                            description: 'Deskripsi produk',
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
                        buttonParamsJson: JSON.stringify({
                            display_text: 'Beli Sekarang',
                            id: '.buy_p001'
                        })
                    }]
                }
            }
        }
    }
};

const msg = generateWAMessageFromContent(jid, productMsg, {
    userJid: sock.user.id
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```

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
                text: 'Pembayaran untuk order #123'
            }
        },
        background: { id: 'DEFAULT', placeholderArgb: 0xfff0f0f0 }
    })
};

const msg = generateWAMessageFromContent(jid, paymentMsg, {
    userJid: sock.user.id,
    quoted: msg
});
await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
```


