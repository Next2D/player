"use strict";

/**
 * @description fflate非依存の高速 zlib/DEFLATE 解凍ワーカー (RFC 1950 / RFC 1951)
 *              High-performance zlib/DEFLATE decompression worker without fflate dependency.
 */

const _$LEN_BASE = new Uint16Array([
    3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,
    35,43,51,59,67,83,99,115,131,163,195,227,258
]);
const _$LEN_EXTRA = new Uint8Array([
    0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,
    3,3,3,3,4,4,4,4,5,5,5,5,0
]);
const _$DIST_BASE = new Uint16Array([
    1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,
    257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577
]);
const _$DIST_EXTRA = new Uint8Array([
    0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,
    7,7,8,8,9,9,10,10,11,11,12,12,13,13
]);
const _$CL_ORDER = new Uint8Array([
    16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15
]);

const _$MASK = new Uint32Array(17);
for (let i = 1; i < 17; i++) { _$MASK[i] = (1 << i) - 1 }

const _$FIXED_LIT_CL = new Uint8Array(288);
for (let i = 0; i <= 143; i++) { _$FIXED_LIT_CL[i] = 8 }
for (let i = 144; i <= 255; i++) { _$FIXED_LIT_CL[i] = 9 }
for (let i = 256; i <= 279; i++) { _$FIXED_LIT_CL[i] = 7 }
for (let i = 280; i <= 287; i++) { _$FIXED_LIT_CL[i] = 8 }

const _$FIXED_DIST_CL = new Uint8Array(32).fill(5);

const _$decoder = new TextDecoder();

let _$outBuf = new Uint8Array(65536);

const _$blCount = new Uint16Array(16);
const _$nextCode = new Uint16Array(16);
const _$clLens = new Uint8Array(19);
const _$codeLens = new Uint8Array(320);

let _$dynClTbl: Uint32Array<ArrayBuffer> = new Uint32Array(128);
let _$dynLitTbl: Uint32Array<ArrayBuffer> = new Uint32Array(2048);
let _$dynDistTbl: Uint32Array<ArrayBuffer> = new Uint32Array(1024);

/**
 * @description canonical Huffmanルックアップテーブルを構築する。
 *              各エントリは (symbol << 4) | codeLength の形式で格納される。
 *              Builds a canonical Huffman lookup table. Each entry stores (symbol << 4) | codeLength.
 *
 * @param  {Uint8Array}                  codeLens - シンボルごとのコード長配列
 * @param  {number}                      n        - codeLensの有効要素数
 * @param  {Uint32Array<ArrayBuffer>}    [reuse]  - 再利用するテーブルバッファ（GC回避用）
 * @return {[Uint32Array<ArrayBuffer>, number]} [テーブル, 最大コード長]
 * @method
 * @private
 */
const _$buildTable = (codeLens: Uint8Array, n: number, reuse?: Uint32Array<ArrayBuffer>): [Uint32Array<ArrayBuffer>, number] =>
{
    let max = 0;
    _$blCount.fill(0);
    for (let i = 0; i < n; i++) {
        const l = codeLens[i];
        if (l) {
            _$blCount[l]++;
            if (l > max) { max = l }
        }
    }
    if (!max) {
        if (reuse) {
            reuse[0] = 0;
            return [reuse, 1];
        }
        return [new Uint32Array(2), 1];
    }

    _$nextCode.fill(0);
    for (let b = 1, c = 0; b <= max; b++) {
        c = c + _$blCount[b - 1] << 1;
        _$nextCode[b] = c;
    }

    const size = 1 << max;
    let tbl: Uint32Array<ArrayBuffer>;
    if (reuse && reuse.length >= size) {
        tbl = reuse;
        tbl.fill(0, 0, size);
    } else {
        tbl = new Uint32Array(size);
    }

    for (let s = 0; s < n; s++) {
        const l = codeLens[s];
        if (!l) { continue }
        let c = _$nextCode[l]++;
        let r = 0;
        for (let i = 0; i < l; i++) {
            r = r << 1 | c & 1;
            c >>= 1;
        }
        const entry = s << 4 | l;
        for (let j = r; j < size; j += 1 << l) {
            tbl[j] = entry;
        }
    }

    return [tbl, max];
};

const [_$FIXED_LIT_TBL, _$FIXED_LIT_BITS] = _$buildTable(_$FIXED_LIT_CL, 288);
const [_$FIXED_DIST_TBL, _$FIXED_DIST_BITS] = _$buildTable(_$FIXED_DIST_CL, 32);
const _$FIXED_LIT_MASK = _$MASK[_$FIXED_LIT_BITS];
const _$FIXED_DIST_MASK = _$MASK[_$FIXED_DIST_BITS];

let _$src: Uint8Array;
let _$pos: number;
let _$buf: number;
let _$cnt: number;

/**
 * @description ビットストリームからnビットを読み取って返す。
 *              Reads n bits from the bit stream and returns the value.
 *
 * @param  {number} n - 読み取るビット数
 * @return {number} 読み取った値
 * @method
 * @private
 */
const _$bits = (n: number): number =>
{
    while (_$cnt < n) {
        _$buf |= _$src[_$pos++] << _$cnt;
        _$cnt += 8;
    }
    const v = _$buf & _$MASK[n];
    _$buf >>>= n;
    _$cnt -= n;
    return v;
};

/**
 * @description Huffmanルックアップテーブルから1シンボルをデコードする。
 *              Decodes one symbol from the Huffman lookup table.
 *
 * @param  {Uint32Array} tbl     - Huffmanルックアップテーブル
 * @param  {number}      maxBits - テーブルの最大コード長
 * @param  {number}      mask    - ビットマスク ((1 << maxBits) - 1)
 * @return {number} デコードされたシンボル値
 * @method
 * @private
 */
const _$huf = (tbl: Uint32Array, maxBits: number, mask: number): number =>
{
    while (_$cnt < maxBits) {
        _$buf |= _$src[_$pos++] << _$cnt;
        _$cnt += 8;
    }
    const e = tbl[_$buf & mask];
    _$buf >>>= e & 0xF;
    _$cnt -= e & 0xF;
    return e >> 4;
};

/**
 * @description DEFLATEストリームを解凍する (RFC 1951)。
 *              stored / fixed Huffman / dynamic Huffman の全ブロックタイプに対応。
 *              Decompresses a DEFLATE stream. Supports all block types: stored, fixed and dynamic Huffman.
 *
 * @param  {Uint8Array} data   - 圧縮データ
 * @param  {number}     offset - DEFLATEストリームの開始オフセット
 * @return {Uint8Array} 解凍されたバイト列
 * @method
 * @private
 */
const _$inflate = (data: Uint8Array, offset: number): Uint8Array =>
{
    _$src = data;
    _$pos = offset;
    _$buf = 0;
    _$cnt = 0;

    const estimatedSize = Math.max(data.length * 6, 4096);
    if (_$outBuf.length < estimatedSize) {
        _$outBuf = new Uint8Array(estimatedSize);
    }
    let out = _$outBuf;
    let op = 0;

    let fin = 0;
    while (!fin) {
        fin = _$bits(1);
        const bt = _$bits(2);

        if (bt === 0) {
            const skip = _$cnt & 7;
            _$buf >>>= skip;
            _$cnt -= skip;
            const len = _$bits(16);
            _$bits(16);

            if (op + len > out.length) {
                let sz = out.length;
                while (sz < op + len) { sz <<= 1 }
                const nb = new Uint8Array(sz);
                nb.set(out);
                out = nb;
            }

            out.set(_$src.subarray(_$pos, _$pos + len), op);
            _$pos += len;
            op += len;

        } else if (bt === 3) {
            throw new Error("Invalid DEFLATE block type");

        } else {
            let lt: Uint32Array, lm: number, lb: number;
            let dt: Uint32Array, dm: number, db: number;

            if (bt === 1) {
                lt = _$FIXED_LIT_TBL;
                lb = _$FIXED_LIT_BITS;
                lm = _$FIXED_LIT_MASK;
                dt = _$FIXED_DIST_TBL;
                db = _$FIXED_DIST_BITS;
                dm = _$FIXED_DIST_MASK;
            } else {
                const hlit = _$bits(5) + 257;
                const hdist = _$bits(5) + 1;
                const hclen = _$bits(4) + 4;

                _$clLens.fill(0);
                for (let i = 0; i < hclen; i++) {
                    _$clLens[_$CL_ORDER[i]] = _$bits(3);
                }
                let clb: number;
                [_$dynClTbl, clb] = _$buildTable(_$clLens, 19, _$dynClTbl);
                const clm = _$MASK[clb];

                const total = hlit + hdist;
                _$codeLens.fill(0, 0, total);
                for (let i = 0; i < total;) {
                    const s = _$huf(_$dynClTbl, clb, clm);
                    if (s < 16) {
                        _$codeLens[i++] = s;
                    } else if (s === 16) {
                        const p = _$codeLens[i - 1];
                        for (let r = _$bits(2) + 3; r > 0; r--) { _$codeLens[i++] = p }
                    } else if (s === 17) {
                        i += _$bits(3) + 3;
                    } else {
                        i += _$bits(7) + 11;
                    }
                }

                [_$dynLitTbl, lb] = _$buildTable(_$codeLens.subarray(0, hlit), hlit, _$dynLitTbl);
                lm = _$MASK[lb];
                lt = _$dynLitTbl;
                [_$dynDistTbl, db] = _$buildTable(_$codeLens.subarray(hlit, total), hdist, _$dynDistTbl);
                dm = _$MASK[db];
                dt = _$dynDistTbl;
            }

            for (;;) {

                while (_$cnt < lb) {
                    _$buf |= _$src[_$pos++] << _$cnt;
                    _$cnt += 8;
                }
                const le = lt[_$buf & lm];
                const sl = le & 0xF;
                _$buf >>>= sl;
                _$cnt -= sl;
                const sym = le >> 4;

                if (sym < 256) {
                    if (op >= out.length) {
                        const nb = new Uint8Array(out.length << 1);
                        nb.set(out);
                        out = nb;
                    }
                    out[op++] = sym;

                } else if (sym === 256) {
                    break;

                } else {
                    const li = sym - 257;
                    let length = _$LEN_BASE[li];
                    const le2 = _$LEN_EXTRA[li];
                    if (le2) {
                        while (_$cnt < le2) {
                            _$buf |= _$src[_$pos++] << _$cnt;
                            _$cnt += 8;
                        }
                        length += _$buf & _$MASK[le2];
                        _$buf >>>= le2;
                        _$cnt -= le2;
                    }

                    while (_$cnt < db) {
                        _$buf |= _$src[_$pos++] << _$cnt;
                        _$cnt += 8;
                    }
                    const de = dt[_$buf & dm];
                    const dl = de & 0xF;
                    _$buf >>>= dl;
                    _$cnt -= dl;
                    const di = de >> 4;

                    let dist = _$DIST_BASE[di];
                    const de2 = _$DIST_EXTRA[di];
                    if (de2) {
                        while (_$cnt < de2) {
                            _$buf |= _$src[_$pos++] << _$cnt;
                            _$cnt += 8;
                        }
                        dist += _$buf & _$MASK[de2];
                        _$buf >>>= de2;
                        _$cnt -= de2;
                    }

                    if (op + length > out.length) {
                        let sz = out.length;
                        while (sz < op + length) { sz <<= 1 }
                        const nb = new Uint8Array(sz);
                        nb.set(out);
                        out = nb;
                    }

                    const sp = op - dist;
                    if (dist === 1) {
                        out.fill(out[sp], op, op + length);
                        op += length;
                    } else if (dist >= length) {
                        out.copyWithin(op, sp, sp + length);
                        op += length;
                    } else {
                        out.copyWithin(op, sp, sp + dist);
                        let copied = dist;
                        while (copied < length) {
                            const chunk = Math.min(copied, length - copied);
                            out.copyWithin(op + copied, op, op + chunk);
                            copied += chunk;
                        }
                        op += length;
                    }
                }
            }
        }
    }

    _$outBuf = out;

    return out.subarray(0, op);
};

/**
 * @description zlibラッパー付きデータを解凍する (RFC 1950)。
 *              zlibヘッダーを検出した場合は2バイトスキップし、それ以外は生DEFLATEとして処理する。
 *              Decompresses zlib-wrapped data. Skips the 2-byte zlib header if detected,
 *              otherwise treats input as raw DEFLATE.
 *
 * @param  {Uint8Array} input - zlib圧縮データまたは生DEFLATEストリーム
 * @return {Uint8Array} 解凍されたバイト列
 * @method
 * @private
 */
const _$zlibDecompress = (input: Uint8Array): Uint8Array =>
{
    const cmf = input[0];
    const flg = input[1];

    const isZlib = (cmf & 0x0F) === 8
        && (cmf * 256 + flg) % 31 === 0
        && !(flg & 0x20);

    return _$inflate(input, isZlib ? 2 : 0);
};

/**
 * @description zlibの圧縮されたデータを解凍し、JSONとしてパースして返すワーカーエントリポイント。
 *              Worker entry point that decompresses zlib data, decodes as URI-encoded string,
 *              parses as JSON and posts the result back.
 *
 * @param  {MessageEvent} event - 圧縮データ (Uint8Array) を含むメッセージイベント
 * @return {void}
 * @method
 * @public
 */
self.addEventListener("message", (event: MessageEvent): void =>
{
    try {

        const buffer = _$zlibDecompress(event.data);

        self.postMessage(JSON.parse(
            decodeURIComponent(_$decoder.decode(buffer))
        ));

    } catch (e) {

        self.postMessage({
            "error": e instanceof Error ? e.message : "Unknown decompression error"
        });

    }
});

export default {};