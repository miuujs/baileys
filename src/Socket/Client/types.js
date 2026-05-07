import { EventEmitter } from 'events';
import { URL } from 'url';

export class AbstractSocketClient extends EventEmitter {
    constructor(url, config) {
        super();
        this.url = url;
        this.config = config;
        this.setMaxListeners(0);
    }

    get isOpen() {
        throw new Error('not implemented');
    }

    get isClosed() {
        throw new Error('not implemented');
    }

    get isClosing() {
        throw new Error('not implemented');
    }

    get isConnecting() {
        throw new Error('not implemented');
    }

    connect() {
        throw new Error('not implemented');
    }

    close() {
        throw new Error('not implemented');
    }

    send(str, cb) {
        throw new Error('not implemented');
    }
}
