'use strict'

const
    assert = require('assert'),
    {
        serializeNumber,
        serializeString,
        makeAddressScript,
        makeScript
    } = require('./../index'),
    OpCodes = require('./../libs/const.OpCodes');


describe('mint-bitcoin-script', () => {

    describe('serializeNumber function', () => {

        it('should serialize number to a Buffer (0)', () => {
            const serializedBuf = serializeNumber(0);
            assert.strictEqual(serializedBuf.toString('hex'), '0100');
        });

        it('should serialize number to a Buffer (1)', () => {
            const serializedBuf = serializeNumber(1);
            assert.strictEqual(serializedBuf.toString('hex'), '51');
        });

        it('should serialize number to a Buffer (16)', () => {
            const serializedBuf = serializeNumber(16);
            assert.strictEqual(serializedBuf.toString('hex'), '60');
        });

        it('should serialize number to a Buffer (17)', () => {
            const serializedBuf = serializeNumber(17);
            assert.strictEqual(serializedBuf.toString('hex'), '0111');
        });

        it('should serialize number to a Buffer (127)', () => {
            const serializedBuf = serializeNumber(127);
            assert.strictEqual(serializedBuf.toString('hex'), '017f');
        });

        it('should serialize number to a Buffer (128)', () => {
            const serializedBuf = serializeNumber(128);
            assert.strictEqual(serializedBuf.toString('hex'), '028000');
        });

        it('should serialize number to a Buffer (4000000000000)', () => {
            const serializedBuf = serializeNumber(4000000000000);
            assert.strictEqual(serializedBuf.toString('hex'), '0400409452');
        });
    });

    describe('serializeString function', () => {

        it('should serialize string to a Buffer', () => {
            const serializedBuf = serializeString('a string');
            assert.strictEqual(serializedBuf.toString('hex'), '086120737472696e67');
        });
    });

    describe('makeAddressScript function', () => {
        it('should create an address Script from a base-58 address (1)', () => {
            const scriptBuf = makeAddressScript('TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3');
            assert.strictEqual(scriptBuf.toString('hex'),
                '76a914c6d9ca6262922e030d6cb83e03413f9f4e0e293388ac');
        });

        it('should create an address Script from a base-58 address (2)', () => {
            const scriptBuf = makeAddressScript('mtyYiH7afTYQzVgs55vgam8pTZMNRGA7E6');
            assert.strictEqual(scriptBuf.toString('hex'),
                '76a91493a12e3cdc24f8f3241d135b82b20c495dfc0fe488ac');
        });
    });

    describe('makeScript function', () => {
        context('OP_NOP', testSingleOp(OpCodes.OP_NOP));
        context('OP_IF', testSingleOp(OpCodes.OP_IF));
        context('OP_NOTIF', testSingleOp(OpCodes.OP_NOTIF));
        context('OP_ELSE', testSingleOp(OpCodes.OP_ELSE));
        context('OP_ENDIF', testSingleOp(OpCodes.OP_ENDIF));
        context('OP_VERIFY', testSingleOp(OpCodes.OP_VERIFY));
        context('OP_RETURN', testSingleOp(OpCodes.OP_RETURN));
        context('OP_TOALTSTACK', testSingleOp(OpCodes.OP_TOALTSTACK));
        context('OP_FROMALTSTACK', testSingleOp(OpCodes.OP_FROMALTSTACK));
        context('OP_IFDUP', testSingleOp(OpCodes.OP_IFDUP));
        context('OP_DEPTH', testSingleOp(OpCodes.OP_DEPTH));
        context('OP_DROP', testSingleOp(OpCodes.OP_DROP));
        context('OP_DUP', testSingleOp(OpCodes.OP_DUP));
        context('OP_NIP', testSingleOp(OpCodes.OP_NIP));
        context('OP_OVER', testSingleOp(OpCodes.OP_OVER));
        context('OP_PICK', testSingleOp(OpCodes.OP_PICK));
        context('OP_ROLL', testSingleOp(OpCodes.OP_ROLL));
        context('OP_ROT', testSingleOp(OpCodes.OP_ROT));
        context('OP_SWAP', testSingleOp(OpCodes.OP_SWAP));
        context('OP_TUCK', testSingleOp(OpCodes.OP_TUCK));
        context('OP_2DROP', testSingleOp(OpCodes.OP_2DROP));
        context('OP_2DUP', testSingleOp(OpCodes.OP_2DUP));
        context('OP_3DUP', testSingleOp(OpCodes.OP_3DUP));
        context('OP_2OVER', testSingleOp(OpCodes.OP_2OVER));
        context('OP_2ROT', testSingleOp(OpCodes.OP_2ROT));
        context('OP_2SWAP', testSingleOp(OpCodes.OP_2SWAP));
        context('OP_CAT', testSingleOp(OpCodes.OP_CAT));
        context('OP_SUBSTR', testSingleOp(OpCodes.OP_SUBSTR));
        context('OP_LEFT', testSingleOp(OpCodes.OP_LEFT));
        context('OP_RIGHT', testSingleOp(OpCodes.OP_RIGHT));
        context('OP_SIZE', testSingleOp(OpCodes.OP_SIZE));
        context('OP_INVERT', testSingleOp(OpCodes.OP_INVERT));
        context('OP_AND', testSingleOp(OpCodes.OP_AND));
        context('OP_OR', testSingleOp(OpCodes.OP_OR));
        context('OP_XOR', testSingleOp(OpCodes.OP_XOR));
        context('OP_EQUAL', testSingleOp(OpCodes.OP_EQUAL));
        context('OP_EQUALVERIFY', testSingleOp(OpCodes.OP_EQUALVERIFY));
        context('OP_1ADD', testSingleOp(OpCodes.OP_1ADD));
        context('OP_1SUB', testSingleOp(OpCodes.OP_1SUB));
        context('OP_2MUL', testSingleOp(OpCodes.OP_2MUL));
        context('OP_2DIV', testSingleOp(OpCodes.OP_2DIV));
        context('OP_NEGATE', testSingleOp(OpCodes.OP_NEGATE));
        context('OP_ABS', testSingleOp(OpCodes.OP_ABS));
        context('OP_NOT', testSingleOp(OpCodes.OP_NOT));
        context('OP_0NOTEQUAL', testSingleOp(OpCodes.OP_0NOTEQUAL));
        context('OP_ADD', testSingleOp(OpCodes.OP_ADD));
        context('OP_SUB', testSingleOp(OpCodes.OP_SUB));
        context('OP_MUL', testSingleOp(OpCodes.OP_MUL));
        context('OP_DIV', testSingleOp(OpCodes.OP_DIV));
        context('OP_MOD', testSingleOp(OpCodes.OP_MOD));
        context('OP_LSHIFT', testSingleOp(OpCodes.OP_LSHIFT));
        context('OP_RSHIFT', testSingleOp(OpCodes.OP_RSHIFT));
        context('OP_BOOLAND', testSingleOp(OpCodes.OP_BOOLAND));
        context('OP_BOOLOR', testSingleOp(OpCodes.OP_BOOLOR));
        context('OP_NUMEQUAL', testSingleOp(OpCodes.OP_NUMEQUAL));
        context('OP_NUMEQUALVERIFY', testSingleOp(OpCodes.OP_NUMEQUALVERIFY));
        context('OP_NUMNOTEQUAL', testSingleOp(OpCodes.OP_NUMNOTEQUAL));
        context('OP_LESSTHAN', testSingleOp(OpCodes.OP_LESSTHAN));
        context('OP_GREATERTHAN', testSingleOp(OpCodes.OP_GREATERTHAN));
        context('OP_LESSTHANOREQUAL', testSingleOp(OpCodes.OP_LESSTHANOREQUAL));
        context('OP_GREATERTHANOREQUAL', testSingleOp(OpCodes.OP_GREATERTHANOREQUAL));
        context('OP_MIN', testSingleOp(OpCodes.OP_MIN));
        context('OP_MAX', testSingleOp(OpCodes.OP_MAX));
        context('OP_WITHIN', testSingleOp(OpCodes.OP_WITHIN));
        context('OP_RIPEMD160', testSingleOp(OpCodes.OP_RIPEMD160));
        context('OP_SHA1', testSingleOp(OpCodes.OP_SHA1));
        context('OP_SHA256', testSingleOp(OpCodes.OP_SHA256));
        context('OP_HASH160', testSingleOp(OpCodes.OP_HASH160));
        context('OP_HASH256', testSingleOp(OpCodes.OP_HASH256));
        context('OP_CODESEPARATOR', testSingleOp(OpCodes.OP_CODESEPARATOR));
        context('OP_CHECKSIG', testSingleOp(OpCodes.OP_CHECKSIG));
        context('OP_CHECKSIGVERIFY', testSingleOp(OpCodes.OP_CHECKSIGVERIFY));
        context('OP_CHECKMULTISIG', testSingleOp(OpCodes.OP_CHECKMULTISIG));
        context('OP_CHECKMULTISIGVERIFY', testSingleOp(OpCodes.OP_CHECKMULTISIGVERIFY));
        context('OP_CHECKLOCKTIMEVERIFY', testSingleOp(OpCodes.OP_CHECKLOCKTIMEVERIFY));
        context('OP_CHECKSEQUENCEVERIFY', testSingleOp(OpCodes.OP_CHECKSEQUENCEVERIFY));

        it('should serialize multiple operations in a string', () => {
            const scriptBuf = makeScript(`OP_NOP OP_IF 0x64`);
            assert.strictEqual(scriptBuf.toString('hex'), '616364');
        });

        it('should serialize multiple operations in an array', () => {
            const scriptBuf = makeScript(['OP_NOP', Buffer.from('63', 'hex'), 0x64]);
            assert.strictEqual(scriptBuf.toString('hex'), '616364');
        });

        it('should throw for unrecognized operations', () => {
            _expectThrow(() => {
                makeScript('OP_NOP OP_FAKE');
            });
        });

        it('should allow custom data via hex', () => {
            const scriptBuf = makeScript('OP_NOP 0x0123456789abcdef');
            assert.strictEqual(scriptBuf.toString('hex'), '610123456789abcdef');
        });

        it('should allow custom data via hex', () => {
            const scriptBuf = makeScript('OP_NOP 0x0123456789abcdef');
            assert.strictEqual(scriptBuf.toString('hex'), '610123456789abcdef');
        });

        context('PUB_KEY operation', () => {
            it('should correctly serialize a value', () => {
                const scriptBuf = makeScript('PUB_KEY',
                    ['8c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153']);

                assert.strictEqual(scriptBuf.toString('hex'),
                    '8c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153');
            });
            it('should throw if value is not 33 bytes', () => {
                _expectThrow(() => {
                    makeScript('PUB_KEY', ['2e8c4891b26d160275e5172874796893481e22aef866153']);
                });
            });
        });

        context('DATA operation', () => {
            it('should correctly serialize a value of any length <= 96 bytes', () => {
                const scriptBuf = makeScript('DATA',
                    ['8c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153']);

                assert.strictEqual(scriptBuf.toString('hex'),
                    '218c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153');
            });
            it('should throw if the data length > 96 bytes', () => {
                _expectThrow(() => {
                    makeScript('DATA',
                        ['f2c256b5ec6a1471c75a8a2ab278ba070e58d1ad2a78d50c1b2219ebab6f7c23d746da921955addb298703f2b0b77fd42ea24f67f4dc804e19d8b63438460b8cb67add2a7049f92a106f8d0e2cee23abc311da872c93b326d685150526ae8e040a1671ef2d4ef56bdc603f1c9d651333abc1fe0c50f5e02e173af46d684a02bed723ed43aa908466c197c28b36e8099195d61417c5aa567168683c86908f36211d024939c9d06f1d6ec3faeed4f567f8d2f38cd825da37f58931fc3db4bf3b447a5cf9e1749c9bfd8f126293f3aec7227859dfd10a9616ff9b90a412844d0360bb10a08feb182523bbdd338f26584777c5c74704ea0c12de327139156bd456e59c45f7820494d0e1d2502b0925557b0168f4ee8836999435c5ade88fa511d03573607fe287abfb78bd92089d']);
                });
            });
        });

        context('KEY operation', () => {
            it('should correctly serialize a value of any length <= 96 bytes', () => {
                const scriptBuf = makeScript('KEY',
                    ['8c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153']);

                assert.strictEqual(scriptBuf.toString('hex'),
                    '218c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153');
            });
            it('should throw if the data length > 96 bytes', () => {
                _expectThrow(() => {
                    makeScript('KEY',
                        ['f2c256b5ec6a1471c75a8a2ab278ba070e58d1ad2a78d50c1b2219ebab6f7c23d746da921955addb298703f2b0b77fd42ea24f67f4dc804e19d8b63438460b8cb67add2a7049f92a106f8d0e2cee23abc311da872c93b326d685150526ae8e040a1671ef2d4ef56bdc603f1c9d651333abc1fe0c50f5e02e173af46d684a02bed723ed43aa908466c197c28b36e8099195d61417c5aa567168683c86908f36211d024939c9d06f1d6ec3faeed4f567f8d2f38cd825da37f58931fc3db4bf3b447a5cf9e1749c9bfd8f126293f3aec7227859dfd10a9616ff9b90a412844d0360bb10a08feb182523bbdd338f26584777c5c74704ea0c12de327139156bd456e59c45f7820494d0e1d2502b0925557b0168f4ee8836999435c5ade88fa511d03573607fe287abfb78bd92089d']);
                });
            });
        });

        context('ADDRESS operation', () => {
            it('should correctly serialize a value of any length <= 96 bytes', () => {
                const scriptBuf = makeScript('ADDRESS',
                    ['8c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153']);

                assert.strictEqual(scriptBuf.toString('hex'),
                    '218c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153');
            });
            it('should throw if the data length > 96 bytes', () => {
                _expectThrow(() => {
                    makeScript('ADDRESS',
                        ['f2c256b5ec6a1471c75a8a2ab278ba070e58d1ad2a78d50c1b2219ebab6f7c23d746da921955addb298703f2b0b77fd42ea24f67f4dc804e19d8b63438460b8cb67add2a7049f92a106f8d0e2cee23abc311da872c93b326d685150526ae8e040a1671ef2d4ef56bdc603f1c9d651333abc1fe0c50f5e02e173af46d684a02bed723ed43aa908466c197c28b36e8099195d61417c5aa567168683c86908f36211d024939c9d06f1d6ec3faeed4f567f8d2f38cd825da37f58931fc3db4bf3b447a5cf9e1749c9bfd8f126293f3aec7227859dfd10a9616ff9b90a412844d0360bb10a08feb182523bbdd338f26584777c5c74704ea0c12de327139156bd456e59c45f7820494d0e1d2502b0925557b0168f4ee8836999435c5ade88fa511d03573607fe287abfb78bd92089d']);
                });
            });
        });

        context('MINING_KEY operation', () => {
            it('should correctly serialize a value of any length <= 96 bytes', () => {
                const scriptBuf = makeScript('MINING_KEY',
                    ['8c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153']);

                assert.strictEqual(scriptBuf.toString('hex'),
                    '218c7d1aa9762328fa2672e8c4891b26d160275e5172874796893481e22aef866153');
            });
            it('should throw if the data length > 96 bytes', () => {
                _expectThrow(() => {
                    makeScript('MINING_KEY',
                        ['f2c256b5ec6a1471c75a8a2ab278ba070e58d1ad2a78d50c1b2219ebab6f7c23d746da921955addb298703f2b0b77fd42ea24f67f4dc804e19d8b63438460b8cb67add2a7049f92a106f8d0e2cee23abc311da872c93b326d685150526ae8e040a1671ef2d4ef56bdc603f1c9d651333abc1fe0c50f5e02e173af46d684a02bed723ed43aa908466c197c28b36e8099195d61417c5aa567168683c86908f36211d024939c9d06f1d6ec3faeed4f567f8d2f38cd825da37f58931fc3db4bf3b447a5cf9e1749c9bfd8f126293f3aec7227859dfd10a9616ff9b90a412844d0360bb10a08feb182523bbdd338f26584777c5c74704ea0c12de327139156bd456e59c45f7820494d0e1d2502b0925557b0168f4ee8836999435c5ade88fa511d03573607fe287abfb78bd92089d']);
                });
            });
        });

        context('BASE58_DATA operation', () => {
            it('should correctly serialize a value of any length <= 96 bytes', () => {
                const scriptBuf = makeScript('BASE58_DATA', ['TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3']);
                assert.strictEqual(scriptBuf.toString('hex'), '14c6d9ca6262922e030d6cb83e03413f9f4e0e2933');
            });
            it('should throw if the data length > 96 bytes', () => {
                _expectThrow(() => {
                    makeScript('BASE58_DATA',
                        ['TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3']);
                });
            });
        });

        context('BASE58_ADDRESS operation', () => {
            it('should correctly serialize a value of any length <= 96 bytes', () => {
                const scriptBuf = makeScript('BASE58_ADDRESS', ['TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3']);
                assert.strictEqual(scriptBuf.toString('hex'), '14c6d9ca6262922e030d6cb83e03413f9f4e0e2933');
            });
            it('should throw if the data length > 96 bytes', () => {
                _expectThrow(() => {
                    makeScript('BASE58_ADDRESS',
                        ['TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3TU6dhPsJHujzVJsKBZwQdN8sTU7dcYyqP3']);
                });
            });
        });

        context('INTEGER operation', () => {
            it('should correctly serialize a number value', () => {
                const scriptBuf = makeScript('INTEGER', [123456789]);
                assert.strictEqual(scriptBuf.toString('hex'), '0415cd5b');
            });
            it('should throw if the data is not a number', () => {
                _expectThrow(() => {
                    makeScript('INTEGER', ['hello']);
                });
            });
            it('should throw if the data is not an integer', () => {
                _expectThrow(() => {
                    makeScript('INTEGER', [1.2]);
                });
            });
        });

        context('TIMESTAMP operation', () => {
            it('should correctly serialize a number value', () => {
                const scriptBuf = makeScript('INTEGER', [123456789]);
                assert.strictEqual(scriptBuf.toString('hex'), '0415cd5b');
            });
            it('should throw if the data is not a number', () => {
                _expectThrow(() => {
                    makeScript('INTEGER', ['hello']);
                });
            });
            it('should throw if the data is not an integer', () => {
                _expectThrow(() => {
                    makeScript('INTEGER', [1.2]);
                });
            });
        });

        context('STRING operation', () => {
            it('should correctly serialize a value', () => {
                const scriptBuf = makeScript('STRING', ['this is a string']);
                assert.strictEqual(scriptBuf.toString('hex'), '1074686973206973206120737472696e67');
            });
            it('should convert non-string data into a string before serializing', () => {
                const scriptBuf = makeScript('STRING', [100]);
                assert.strictEqual(scriptBuf.toString('hex'), '03313030');
            });
        });

        it('should use multiple push data in linear order as needed', () => {
            const scriptBuf = makeScript('STRING 0x0000 STRING INTEGER', ['string', 'also string', 99]);
            assert.strictEqual(scriptBuf.toString('hex'), '06737472696e6700000b616c736f20737472696e670163');
        });
    });
});


function _expectThrow(fn) {
    try {
        fn();
    }
    catch (err) {
        return;
    }
    throw new Error('Exception expected')
}


function testSingleOp(opCode) {

    return function() {

        const OP_NAME = OpCodes.getName(opCode);

        it('should be recognized in a string', () => {
            const scriptBuf = makeScript(OP_NAME);
            assert.strictEqual(scriptBuf.toString('hex'), opCode.toString(16));
        });
        it('should be recognized as a named string in an array', () => {
            const scriptBuf = makeScript([OP_NAME]);
            assert.strictEqual(scriptBuf.toString('hex'), opCode.toString(16));
        });
        it('should be recognized as a hex string in an array', () => {
            const scriptBuf = makeScript([`0x${opCode.toString(16)}`]);
            assert.strictEqual(scriptBuf.toString('hex'), opCode.toString(16));
        });
        it('should be recognized as a number in an array', () => {
            const scriptBuf = makeScript([opCode]);
            assert.strictEqual(scriptBuf.toString('hex'), opCode.toString(16));
        });
        it('should be recognized as a Buffer in an array', () => {
            const scriptBuf = makeScript([Buffer.from([opCode])]);
            assert.strictEqual(scriptBuf.toString('hex'), opCode.toString(16));
        });

        context('with output buffer, offset 0', () => {
            it('should be recognized in a string', () => {
                const outputBuf = Buffer.alloc(1, 0);
                const scriptLen = makeScript(OP_NAME, null, outputBuf);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), opCode.toString(16));
            });
            it('should be recognized as a named string in an array', () => {
                const outputBuf = Buffer.alloc(1, 0);
                const scriptLen = makeScript([OP_NAME], null, outputBuf);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), opCode.toString(16));
            });
            it('should be recognized as a hex string in an array', () => {
                const outputBuf = Buffer.alloc(1, 0);
                const scriptLen = makeScript([`0x${opCode.toString(16)}`], null, outputBuf);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), opCode.toString(16));
            });
            it('should be recognized as a number in an array', () => {
                const outputBuf = Buffer.alloc(1, 0);
                const scriptLen = makeScript([opCode], null, outputBuf);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), opCode.toString(16));
            });
            it('should be recognized as a Buffer in an array', () => {
                const outputBuf = Buffer.alloc(1, 0);
                const scriptLen = makeScript([Buffer.from([opCode])], null, outputBuf);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), opCode.toString(16));
            });
        });

        context('with output buffer, offset 1', () => {
            it('should be recognized in a string', () => {
                const outputBuf = Buffer.alloc(2, 0);
                const scriptLen = makeScript(OP_NAME, null, outputBuf, 1);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), `00${opCode.toString(16)}`);
            });
            it('should be recognized as a named string in an array', () => {
                const outputBuf = Buffer.alloc(2, 0);
                const scriptLen = makeScript([OP_NAME], null, outputBuf, 1);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), `00${opCode.toString(16)}`);
            });
            it('should be recognized as a hex string in an array', () => {
                const outputBuf = Buffer.alloc(2, 0);
                const scriptLen = makeScript([`0x${opCode.toString(16)}`], null, outputBuf, 1);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), `00${opCode.toString(16)}`);
            });
            it('should be recognized as a number in an array', () => {
                const outputBuf = Buffer.alloc(2, 0);
                const scriptLen = makeScript([opCode], null, outputBuf, 1);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), `00${opCode.toString(16)}`);
            });
            it('should be recognized as a Buffer in an array', () => {
                const outputBuf = Buffer.alloc(2, 0);
                const scriptLen = makeScript([Buffer.from([opCode])], null, outputBuf, 1);
                assert.strictEqual(scriptLen, 1);
                assert.strictEqual(outputBuf.toString('hex'), `00${opCode.toString(16)}`);
            });
        });
    }
}