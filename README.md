# yebail

WhatsApp Web API Library based on `@whiskeysockets/baileys` v7.0.0-rc10

---

## Example

```js
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "baileys";

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        start();
      }
    } else if (connection === "open") {
      console.log("Connected!");
    }
  });

  sock.ev.on("messages.upsert", ({ messages }) => {
    for (const msg of messages) {
      if (!msg.key.fromMe) {
        sock.sendMessage(msg.key.remoteJid, { text: "hello" });
      }
    }
  });
}

start();
```

---

## Acknowledgements

Based on [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) v7.0.0-rc10 by Rajeh Taher & the WhiskeySockets community.
