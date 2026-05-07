import { getBinaryNodeChild, getBinaryNodeChildren, isHostedLidUser, isHostedPnUser, isJidMetaAI, isLidUser, isPnUser, jidNormalizedUser } from '../WABinary/index.js';
const BOT_PHONE_REGEX = /^1313555\d{4}$|^131655500\d{2}$/;
function isRegularUser(jid) {
    if (!jid)
        return false;
    const user = jid.split('@')[0] ?? '';
    if (user === '0')
        return false;
    if (BOT_PHONE_REGEX.test(user))
        return false;
    if (isJidMetaAI(jid))
        return false;
    return !!(isPnUser(jid) || isLidUser(jid) || isHostedPnUser(jid) || isHostedLidUser(jid) || jid.endsWith('@c.us'));
}
const TC_TOKEN_BUCKET_DURATION = 604800;
const TC_TOKEN_NUM_BUCKETS = 4;
export async function readTcTokenIndex(keys) {
    const data = await keys.get('tctoken', [TC_TOKEN_INDEX_KEY]);
    const entry = data[TC_TOKEN_INDEX_KEY];
    if (!entry?.token?.length)
        return [];
    try {
        const parsed = JSON.parse(Buffer.from(entry.token).toString());
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((j) => typeof j === 'string' && j.length > 0 && j !== TC_TOKEN_INDEX_KEY);
    }
    catch {
        return [];
    }
}
export async function resolveTcTokenJid(jid, getLIDForPN) {
    if (isLidUser(jid))
        return jid;
    const lid = await getLIDForPN(jid);
    return lid ?? jid;
}
