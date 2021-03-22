'use strict';

const
    base58 = require('bs58'),
    precon = require('@makipool/mint-precon'),
    OpCodes = require('./libs/const.OpCodes');

const SERIALIZE_NUM_BUFFER = Buffer.alloc(12);

let _scriptBuffer = Buffer.alloc(64);
let _scriptPos = 0;


module.exports = {

    /**
     * Op Code constants
     */
    OpCodes: OpCodes,

    /**
     * Make a common locking script from a base58 wallet address.
     *
     * @param address {string}
     * @returns {Buffer} Bitcoin Script
     */
    makeAddressScript: makeAddressScript,

    /**
     * Make a Bitcoin Script using the specified OpCodes and push data.
     *
     * There are additional special string push codes that are not opcodes but specify that data is to be pushed. When
     * these are encountered, the next pushData value is placed into the Script.
     *
     * Special Push Codes:
     * "PUB_KEY" - Expects a 33-byte hex or Buffer of data which will be inserted without push code prefix.
     * "DATA"
     * "KEY"
     * "ADDRESS"
     * "MINING_KEY" - Adds hex or buffer along with a push code prefix.
     * "BASE58_DATA"
     * "BASE58_ADDRESS" - Adds base58 hex data along with a push code prefix.
     * "INTEGER" - Adds a serialized integer
     * "TIMESTAMP"
     * "STRING" - Adds a serialized string
     *
     * @param opCodes {string|string[]|buffer[]|number[]} Space delimited list of OpCodes, or Array of
     *                                                   OpCode numbers, names or buffers.
     * @param pushData {string[]|buffer[]} Array of data to be used with push operations.
     * @param [outputBuf] {Buffer} Optional Buffer to copy results into.
     * @param [offset=0] {number} The offset position to begin writing into the output buffer (outputBuf).
     *
     * @returns {Buffer|number} Bitcoin Script in a Buffer or, if an outputBuf is supplied, the number
     * of bytes written to the outputBuf.
     */
    makeScript: makeScript,

    /**
     * Serialize number into Buffer.
     *
     * @param num {number} The number to serialize.
     * @param [outputBuf] An optional output buffer to write results into.
     * @param [offset=0] The offset position to begin writing into the output buffer (outputBuf).
     *
     * @returns {Buffer|number}  Returns the result as a Buffer. If a Buffer was passed into the outputBuf
     * parameter then the number of bytes written is returned.
     */
    serializeNumber: serializeNumber,

    /**
     * Serialize string into Buffer.
     *
     * @param str {string} The string to serialize
     * @param [outputBuf] An optional output buffer to write results into.
     * @param [offset=0] The offset position to begin writing into the output buffer (outputBuf).
     *
     * @returns {Buffer|number} Returns the result as a Buffer. If a Buffer was passed into the outputBuf
     * parameter then the number of bytes written is returned.
     */
    serializeString: serializeString
};


function makeAddressScript(address) {
    precon.string(address, 'address');

    return makeScript('OP_DUP OP_HASH160 BASE58_ADDRESS OP_EQUALVERIFY OP_CHECKSIG', [address]);
}


function makeScript(opCodes, pushData, outputBuf, offset) {
    precon.opt_array(pushData, 'pushData');
    precon.opt_buffer(outputBuf, 'outputBuf');
    precon.opt_positiveInteger(offset, 'offset');

    offset = outputBuf ? offset || 0 : 0;

    _scriptPos = 0;
    let pushDataIndex = 0;

    if (typeof opCodes === 'string')
        opCodes = opCodes.split(' ');

    precon.array(opCodes, 'opCodes');

    opCodes.forEach(op => {

        !outputBuf && _ensureBuffer();

        if (Buffer.isBuffer(op)) {
            op.copy(_scriptBuffer, _scriptPos, 0, 1);
            _scriptPos++;
        }
        else if (typeof op === 'number') {
            const name = OpCodes.getName(op);
            if (!name)
                throw new Error(`Unrecognized script operation: ${op}`);

            _scriptBuffer.writeUInt8(op, _scriptPos);
            _scriptPos++;
        }
        else if (typeof op === 'string') {

            const code = OpCodes[op.toUpperCase()];
            if (typeof code === 'number') {
                _scriptBuffer.writeUInt8(code, _scriptPos);
                _scriptPos++;
            }
            else {
                switch (op) {
                    case 'PUB_KEY':
                        const pubKeyLen = _writePushData(pushData, pushDataIndex);
                        if (pubKeyLen !== 33)
                            throw new Error(`Invalid pubkey: ${pubKeyLen}: ${pushData[pushDataIndex]}`);

                        pushDataIndex++;
                        break;

                    case 'DATA':
                    case 'KEY':
                    case 'ADDRESS':
                    case 'MINING_KEY':
                        const dataLen = _getPushDataLen(pushData, pushDataIndex);

                        if (dataLen > 0x60)
                            throw new Error(`Data length cannot be more than 96. It is ${dataLen}.`);

                        _scriptBuffer.writeUInt8(dataLen, _scriptPos);
                        _scriptPos++;

                        _writePushData(pushData, pushDataIndex);

                        pushDataIndex++;
                        break;

                    case 'BASE58_DATA':
                    case 'BASE58_ADDRESS':
                        const base58Decoded = _getBase58PushData(pushData, pushDataIndex);
                        if (base58Decoded.length > 0x60)
                            throw new Error(`Data length cannot be more than 96. It is ${base58Decoded.length}.`);

                        _scriptBuffer.writeUInt8(base58Decoded.length, _scriptPos);
                        _scriptPos++;

                        base58Decoded.copy(_scriptBuffer, _scriptPos, 0);
                        _scriptPos += base58Decoded.length;

                        pushDataIndex++;
                        break;

                    case 'INTEGER':
                    case 'TIMESTAMP':
                        const number = pushData[pushDataIndex];
                        _scriptPos += serializeNumber(number, _scriptBuffer, _scriptPos);
                        pushDataIndex++;
                        break;

                    case 'STRING':
                        const str = pushData[pushDataIndex];
                        _scriptPos += serializeString(String(str), _scriptBuffer, _scriptPos);
                        pushDataIndex++;
                        break;

                    default:
                        if (op.startsWith('0x')) {
                            const hex = op.substr(2);
                            _scriptBuffer.write(hex, _scriptPos, 'hex');
                            _scriptPos += hex.length / 2;
                        }
                        else {
                            throw new Error(`Unrecognized script operation: ${op}`);
                        }
                        break;
                }
            }
        }
    });

    const resultBuf = outputBuf || Buffer.alloc(_scriptPos);
    _scriptBuffer.copy(resultBuf, offset + 0, 0, _scriptPos);

    return outputBuf ? _scriptPos : resultBuf;
}


function serializeNumber(num, outputBuf, offset) {
    precon.positiveInteger(num, 'num');
    precon.opt_buffer(outputBuf, 'outputBuf');
    precon.opt_positiveInteger(offset, 'offset');

    offset = outputBuf ? offset || 0 : 0;

    if (num >= 1 && num <= 16) {
        const buff = outputBuf || Buffer.alloc(1);
        buff.writeUInt8(0x50 + num, offset);
        return buff;
    }

    if (num <= 0x7F) {
        const buff = outputBuf || Buffer.alloc(2);
        buff.writeUInt8(1, offset + 0);
        buff.writeUInt8(num, offset + 1);
        return outputBuf ? 2 : buff;
    }

    let byteCount = 0;
    let n = num;
    while (n > 0x7F) {
        SERIALIZE_NUM_BUFFER.writeUInt8(n & 0xFF, byteCount);
        n = n >> 8;
        byteCount++;
    }

    const buff = outputBuf || Buffer.alloc(byteCount + 2);
    buff.writeUInt8(byteCount + 1, offset + 0);
    SERIALIZE_NUM_BUFFER.copy(buff, offset + 1, 0, byteCount);
    buff.writeUInt8(n, offset + byteCount + 1);

    return outputBuf ? byteCount + 1 : buff;
}


function serializeString(str, outputBuf, offset) {
    precon.string(str, 's');
    precon.opt_buffer(outputBuf, 'outputBuf');
    precon.opt_positiveInteger(offset, 'offset');

    offset = outputBuf ? offset || 0 : 0;

    const len = Buffer.byteLength(str);

    if (len < 0xFD) {

        const buff = outputBuf || Buffer.alloc(len + 1);
        buff.writeUInt8(len, offset + 0);
        buff.write(str, offset + 1, 'utf8');
        return outputBuf ? len + 1 : buff;
    }
    else if (len < 0x10000) {

        const buff = outputBuf || Buffer.alloc(len + 3);
        buff.writeUInt8(0xFD, offset + 0);
        buff.writeUInt16LE(len, offset + 1)
        buff.write(str, offset + 3);
        return outputBuf ? len + 3 : buff;
    }
    else if (str.length < 0x100000000) {

        const buff = outputBuf || Buffer.alloc(len + 5);
        buff.writeUInt8(0xFE, offset + 0);
        buff.writeUInt32LE(len, offset + 1);
        buff.write(str, offset + 5);
        return outputBuf ? len + 5 : buff;
    }
    else {

        const buff = outputBuf || Buffer.alloc(len + 9);
        buff.writeUInt8(0xFF, offset + 0);
        buff.writeInt32LE(len & -1, offset + 1);
        buff.writeUInt32LE(Math.floor(len / 0x100000000), offset + 5);
        buff.write(str, offset + 9)
        return outputBuf ? len + 9 : buff;
    }
}


function _writePushData(pushData, index) {

    const data = pushData[index];
    if (Buffer.isBuffer(data)) {
        data.copy(_scriptBuffer, _scriptPos);
        _scriptPos += data.length;
        return data.length;
    }
    else if (typeof data === 'string') {
        const written = _scriptBuffer.write(data, _scriptPos, 'hex');
        _scriptPos += written;
        return written;
    }

    throw new Error('Bad data type. Must be buffer or hex string.');
}


function _getPushDataLen(pushData, index) {
    const data = pushData[index];
    if (Buffer.isBuffer(data)) {
        return data.length;
    }
    else if (typeof data === 'string') {
        return data.length / 2;
    }

    throw new Error('Bad data type. Must be buffer or hex string.');
}


function _getBase58PushData(pushData, index) {

    const data = pushData[index];
    if (typeof data === 'string') {
        const base58Decoded = base58.decode(data);
        if (!base58Decoded) {
            throw new Error(`base58 decode failed for address: ${data}`);
        }
        return base58Decoded.slice(1, -4);
    }

    throw new Error('Bad data type. Must be hex string.');
}


function _ensureBuffer() {
    if (_scriptPos >= _scriptBuffer.length * 0.75) {
        const oldBuffer = _scriptBuffer;
        _scriptBuffer = Buffer.alloc(oldBuffer.length * 2);
        oldBuffer.copy(_scriptBuffer, 0, 0, _scriptPos);
    }
}