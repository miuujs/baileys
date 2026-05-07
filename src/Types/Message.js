import { proto } from '../../WAProto/index.js';
// export the WAMessage Prototypes
export { proto as WAProto };
export const WAMessageStubType = proto.WebMessageInfo.StubType;
export const WAMessageStatus = proto.WebMessageInfo.Status;
/** Set of message types that are supported by the library */
export var WAMessageAddressingMode;
(function (WAMessageAddressingMode) {
    WAMessageAddressingMode["PN"] = "pn";
    WAMessageAddressingMode["LID"] = "lid";
})(WAMessageAddressingMode || (WAMessageAddressingMode = {}));
