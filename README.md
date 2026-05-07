<h1 align="center">yelib</h1>

<div align="center">WhatsApp Web API Library — based on <a href="https://github.com/WhiskeySockets/Baileys">@whiskeysockets/baileys</a> v7.0.0-rc10</div>

<div align="center">
  <strong>ESM · TypeScript-ready · WebSocket-based · Multi-Device</strong>
</div>

---

## Quick Start

### Pairing Code

```js
import makeWASocket, { useMultiFileAuthState, DisconnectReason, Browsers } from "baileys";

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: Browsers.macOS("Desktop"),
    syncFullHistory: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) start();
      return;
    }

    if (connection === "open") {
      console.log("Connected!");
      return;
    }

    if (!sock.authState.creds.registered && qr) {
      const code = await sock.requestPairingCode("6281xxxxxxxxx");
      console.log("Pairing Code:", code);
    }
  });
}

start();
```

### QR Code

```js
import makeWASocket from "baileys";

const sock = makeWASocket({
  printQRInTerminal: true,
  browser: Browsers.ubuntu("My App"),
});
```

---

## Session Management

```js
import makeWASocket, { useMultiFileAuthState } from "baileys";

const { state, saveCreds } = await useMultiFileAuthState("auth_info");
const sock = makeWASocket({ auth: state });
sock.ev.on("creds.update", saveCreds);
```

---

## Sending Messages

```js
// Text
await sock.sendMessage(jid, { text: "hello" });

// Image
await sock.sendMessage(jid, { image: { url: "./file.jpg" }, caption: "photo" });

// Video
await sock.sendMessage(jid, { video: { url: "./file.mp4" }, caption: "video" });

// Audio
await sock.sendMessage(jid, { audio: { url: "./file.mp3" }, mimetype: "audio/mp4" });

// Reaction
await sock.sendMessage(jid, { react: { text: "❤️", key: msg.key } });

// Poll
await sock.sendMessage(jid, {
  poll: { name: "Question", values: ["A", "B"], selectableCount: 1 },
});

// Location
await sock.sendMessage(jid, {
  location: { degreesLatitude: -6.2, degreesLongitude: 106.8 },
});

// Contact
await sock.sendMessage(jid, {
  contacts: { displayName: "John", contacts: [{ vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:John\nEND:VCARD" }] },
});

// Edit
await sock.sendMessage(jid, { text: "edited", edit: msg.key });

// Delete
await sock.sendMessage(jid, { delete: msg.key });
```

---

## Groups

```js
// Create
const group = await sock.groupCreate("Group Name", ["6281xxx@s.whatsapp.net"]);

// Participants
await sock.groupParticipantsUpdate(jid, ["6281xxx@s.whatsapp.net"], "add");
// "remove" | "demote" | "promote"

// Settings
await sock.groupSettingUpdate(jid, "announcement");    // admin only
await sock.groupSettingUpdate(jid, "not_announcement"); // all

// Metadata
const meta = await sock.groupMetadata(jid);

// Invite
const code = await sock.groupInviteCode(jid);

// Leave
await sock.groupLeave(jid);
```

---

## Handling Events

```js
sock.ev.on("messages.upsert", ({ messages }) => {
  for (const msg of messages) {
    console.log(msg);
  }
});

sock.ev.on("messages.update", (updates) => {
  for (const { key, update } of updates) {
    if (update.pollUpdates) {
      const result = getAggregateVotesInPollMessage({
        message: pollCreation,
        pollUpdates: update.pollUpdates,
      });
    }
  }
});
```

---

## Download Media

```js
import { downloadMediaMessage, getContentType } from "baileys";

const type = getContentType(msg);
if (type === "imageMessage") {
  const stream = await downloadMediaMessage(msg, "stream", {});
  stream.pipe(createWriteStream("./download.jpg"));
}
```

---

## Privacy

```js
await sock.updateBlockStatus(jid, "block");       // block
await sock.updateBlockStatus(jid, "unblock");      // unblock
await sock.updateLastSeenPrivacy("contacts");      // last seen
await sock.updateProfilePicturePrivacy("all");     // profile pic
await sock.fetchPrivacySettings(true);             // get settings
await sock.fetchBlocklist();                       // get blocklist
```

---

## Presence & Read

```js
await sock.sendPresenceUpdate("available", jid);  // online
await sock.sendPresenceUpdate("composing", jid);  // typing
await sock.readMessages([msg.key]);                // read receipts
```

---

## Profile

```js
await sock.updateProfileName("My Name");
await sock.updateProfileStatus("Hello");
await sock.updateProfilePicture(jid, { url: "./pic.jpg" });
await sock.removeProfilePicture(jid);
const url = await sock.profilePictureUrl(jid, "image");
```

---

## Utility Functions

| Function | Description |
|----------|-------------|
| `getContentType` | Returns content type of a message |
| `getDevice` | Returns device info from message |
| `downloadContentFromMessage` | Download media content as stream |
| `makeCacheableSignalKeyStore` | Faster auth key store wrapper |
| `Browsers` | Browser presets (macOS, Windows, Ubuntu) |

---

## Acknowledgements

Based on [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) v7.0.0-rc10 by Rajeh Taher & the WhiskeySockets community.


