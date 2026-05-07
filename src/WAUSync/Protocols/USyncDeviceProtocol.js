import { assertNodeErrorFree, getBinaryNodeChild } from '../../WABinary/index.js';
export class USyncDeviceProtocol {
    constructor() {
        this.name = 'devices';
    }
    getQueryElement() {
        return {
            tag: 'devices',
            attrs: {
                version: '2'
            }
        };
    }
