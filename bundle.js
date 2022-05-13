require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Char_text;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Char = void 0;
const regularExpressions_1 = require("./utils/regularExpressions");
const consonants = /[\u{05D0}-\u{05F2}]/u;
const ligature = /[\u{05C1}-\u{05C2}]/u;
const dagesh = /[\u{05BC}\u{05BF}]/u; // includes rafe
const niqqud = /[\u{05B0}-\u{05BB}\u{05C7}]/u;
/**
 * A Hebrew character and its positioning number for being sequenced correctly.
 * See [[`Cluster`]] for correct normalization.
 */
class Char {
    constructor(char) {
        _Char_text.set(this, void 0);
        __classPrivateFieldSet(this, _Char_text, char, "f");
    }
    /**
     * @returns the text of the Char
     *
     * ```typescript
     * const text: Text = new Text("אֱלֹהִ֑ים");
     * text.chars[0].text;
     * // "א"
     * ```
     */
    get text() {
        return __classPrivateFieldGet(this, _Char_text, "f");
    }
    findPos() {
        const char = this.text;
        if (consonants.test(char)) {
            return 0;
        }
        if (ligature.test(char)) {
            return 1;
        }
        if (dagesh.test(char)) {
            return 2;
        }
        if (niqqud.test(char)) {
            return 3;
        }
        if (regularExpressions_1.taamim.test(char)) {
            return 4;
        }
        // i.e. any non-hebrew char
        return 10;
    }
    /**
     * @returns a number used for sequencing
     *
     * - consonants = 0
     * - ligatures = 1
     * - dagesh or rafe = 2
     * - niqqud (i.e vowels) = 3
     * - taamim (i.e. accents) = 4
     *
     * ```typescript
     * const text: Text = new Text("אֱלֹהִ֑ים");
     * text.chars[0].sequencePosition; // the aleph
     * // 0
     * text.chars[1].sequencePosition; // the segol
     * // 3
     * ```
     */
    get sequencePosition() {
        return this.findPos();
    }
}
exports.Char = Char;
_Char_text = new WeakMap();

},{"./utils/regularExpressions":10}],2:[function(require,module,exports){
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Cluster_original, _Cluster_sequenced;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const char_1 = require("./char");
const node_1 = require("./node");
const regularExpressions_1 = require("./utils/regularExpressions");
/**
 * A cluster is group of Hebrew character constituted by:
 * - an obligatory Hebrew consonant character
 * - an optional ligature mark
 * - an optional vowel
 * - an optional taam
 *
 * A [[`Syllable`]] is a linguistic unit, whereas a `Cluster` is an orthgraphic one.
 * The word `יֹו֑ם` is only one syllable, but it has three clusters—`יֹ`, `ו֑`, `ם`.
 * Because Hebrew orthography is both sub and supra linear, clusters can be encoded in various ways.
 * Every [[`Char`]] is sequenced first for normalization, see the [SBL Hebrew Font Manual](https://www.sbl-site.org/Fonts/SBLHebrewUserManual1.5x.pdf), p.8.
 */
class Cluster extends node_1.Node {
    constructor(cluster) {
        super();
        _Cluster_original.set(this, void 0);
        _Cluster_sequenced.set(this, void 0);
        __classPrivateFieldSet(this, _Cluster_original, cluster, "f");
        __classPrivateFieldSet(this, _Cluster_sequenced, this.sequence(), "f");
    }
    /**
     * @returns the original string passed
     */
    get original() {
        return __classPrivateFieldGet(this, _Cluster_original, "f");
    }
    /**
     * @returns a string that has been built up from the text of its consituent Chars
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * const clusters = text.clusters.map((cluster) => cluster.text);
     * // [
     * //  "הֲ",
     * //  "בָ",
     * //  "רֹ",
     * //  "ו",
     * //  "ת"
     * // ]
     * ```
     */
    get text() {
        return this.chars.reduce((init, char) => init + char.text, "");
    }
    /**
     * @returns an array of sequenced Char objects
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.clusters[0].chars;
     * // [
     * //  Char { original: "ה" },
     * //  Char { original: "ֲ " },   i.e. \u{05B2} (does not print well)
     * // ]
     * ```
     */
    get chars() {
        return __classPrivateFieldGet(this, _Cluster_sequenced, "f");
    }
    sequence() {
        return [...this.original].map((char) => new char_1.Char(char)).sort((a, b) => a.sequencePosition - b.sequencePosition);
    }
    /**
     * Returns `true` if one of the following long vowel characters is present:
     * - \u{05B5} TSERE
     * - \u{05B8} QAMATS
     * - \u{05B9} HOLAM
     * - \u{05BA} HOLAM HASER FOR VAV
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.clusters[0].hasLongVowel;
     * // false
     * text.clusters[1].hasLongVowel;
     * // true
     * ```
     */
    get hasLongVowel() {
        return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
    }
    /**
     * Returns `true` if one of the following long vowel characters is present:
     * - \u{05B4} HIRIQ
     * - \u{05B6} SEGOL
     * - \u{05B7} PATAH
     * - \u{05BB} QUBUTS
     * - \u{05C7} QAMATS QATAN
     *
     * ```typescript
     * const text: Text = new Text("מַלְכָּה");
     * text.clusters[0].hasShortVowel;
     * // true
     * text.clusters[2].hasShortVowel;
     * // false
     * ```
     */
    get hasShortVowel() {
        return /[\u{05B4}\u{05B6}\u{05B7}\u{05BB}\u{05C7}]/u.test(this.text);
    }
    /**
     *
     * Returns `true` if one of the following long vowel characters is present:
     * - \u{05B1} HATAF SEGOL
     * - \u{05B2} HATAF PATAH
     * - \u{05B3} HATAF QAMATS
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.clusters[0].hasHalfVowel;
     * // true
     * text.clusters[1].hasHalfVowel;
     * // false
     * ```
     */
    get hasHalfVowel() {
        return /[\u{05B1}-\u{05B3}]/u.test(this.text);
    }
    /**
     * Returns `true` if `Cluster.hasLongVowel`, `Cluster.hasShortVowel`, or `Cluster.hasHalfVowel` is true.
     *
     * According to {@page Syllabification}, a shewa is a vowel and serves as the nucleus of a syllable.
     * Because `Cluster` is concerned with orthography, a shewa is **not** a vowel character.
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.clusters[0].hasVowel;
     * // true
     * text.clusters[4].hasVowel;
     * // false
     * ```
     */
    get hasVowel() {
        return this.hasLongVowel || this.hasShortVowel || this.hasHalfVowel;
    }
    /**
     *
     * Returns `true` if `Cluster.hasVowel` is `false` and `Cluster.text` is a waw followed by a dagesh (e.g. `וּ`)
     * A shureq is a vowel itself, but contains no vowel characters (hence why `hasVowel` cannot be `true`).
     * This allows for easier syllabification.
     *
     * ```typescript
     * const text: Text = new Text("קוּם");
     * text.clusters[0].isShureq;
     * // false
     * text.clusters[1].isShureq;
     * // true
     * ```
     */
    get isShureq() {
        const shureq = /\u{05D5}\u{05BC}/u;
        return !this.hasVowel ? shureq.test(this.text) : false;
    }
    /**
     * Returns `true` if `Cluster.hasVowel`, `Cluster.hasShewa`, and, `Cluster.isShureq` are all `false` and `Cluster.text` contains a:
     * - `ה` preceded by a qamets, tsere, or seghol
     * - `ו` preceded by a holem
     * - `י` preceded by a hiriq, tsere, or seghol
     *
     * There are potentially other instances when a consonant may be a _mater_ (e.g. a silent aleph), but these are the most common.
     * Though a shureq is a _mater_ letter, it is also a vowel itself, and thus separate from `isMater`.
     *
     * ```typescript
     * const text: Text = new Text("סוּסָה");
     * text.clusters[1].isMater; // the shureq
     * // false
     * text.clusters[3].isMater; // the heh
     * // true
     * ```
     */
    get isMater() {
        const nxtIsShureq = this.next instanceof Cluster ? this.next.isShureq : false;
        if (!this.hasVowel && !this.isShureq && !this.hasShewa && !nxtIsShureq) {
            const text = this.text;
            const prevText = this.prev instanceof Cluster ? this.prev.text : "";
            const maters = /[היו](?!\u{05BC})/u;
            if (!maters.test(text)) {
                return false;
            }
            if (/ה/.test(text) && /\u{05B8}|\u{05B6}|\u{05B5}/u.test(prevText)) {
                return true;
            }
            if (/ו/.test(text) && /\u{05B9}/u.test(prevText)) {
                return true;
            }
            if (/י/.test(text) && /\u{05B4}|\u{05B5}|\u{05B6}/u.test(prevText)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns `true` if the following character is present and a _sof pasuq_ does not follow it:
     * - \u{05BD} METEG
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.clusters[0].hasMetheg;
     * // false
     * ```
     */
    get hasMetheg() {
        const metheg = /\u{05BD}/u;
        const text = this.text;
        if (!metheg.test(text)) {
            return false;
        }
        let next = this.next;
        while (next) {
            if (next instanceof Cluster) {
                const nextText = next.text;
                const sofPassuq = /\u{05C3}/u;
                if (metheg.test(nextText)) {
                    return true;
                }
                if (sofPassuq.test(nextText)) {
                    return false;
                }
                next = next.next;
            }
        }
        return true;
    }
    /**
     * Returns `true` if the following character is present:
     * - \u{05B0} SHEWA
     *
     * ```typescript
     * const text: Text = new Text("מַלְכָּה");
     * text.clusters[0].hasShewa;
     * // false
     * text.clusters[1].hasShewa;
     * // true
     * ```
     */
    get hasShewa() {
        return /\u{05B0}/u.test(this.text);
    }
    /**
     * Returns `true` if the following characters are present:
     * - \u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}
     *
     * ```typescript
     * const text: Text = new Text("אֱלֹהִ֑ים");
     * text.clusters[0].hasTaamim;
     * // false
     * text.clusters[2].hasTaamim;
     * // true
     * ```
     */
    get hasTaamim() {
        return regularExpressions_1.taamim.test(this.text);
    }
    /**
     * Returns `true` if the Cluster does not have Hebrew chars
     *
     * ```typescript
     * * const text: Text = new Text("(לְעֹלָם)");
     * text.clusters[0].isNotHebrew;
     * // true
     * ```
     */
    get isNotHebrew() {
        return !/[\u{0590}-\u{05FF}\u{FB1D}-\u{FB4F}]/u.test(this.text);
    }
}
exports.Cluster = Cluster;
_Cluster_original = new WeakMap(), _Cluster_sequenced = new WeakMap();

},{"./char":1,"./node":4,"./utils/regularExpressions":10}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const text_1 = require("./text");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return text_1.Text; } });

},{"./text":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    constructor() {
        this.next = null;
        this.prev = null;
    }
    set children(arr) {
        const head = arr[0];
        const remainder = arr.slice(1);
        this.child = head;
        head.siblings = remainder;
    }
    set siblings(arr) {
        const len = arr.length;
        for (let index = 0; index < len; index++) {
            const curr = arr[index];
            const nxt = arr[index + 1] || null;
            const prv = arr[index - 1] || this;
            curr.prev = prv;
            prv.next = curr;
            curr.next = nxt;
        }
    }
    get siblings() {
        let curr = this.next;
        const res = [];
        while (curr) {
            res.push(curr);
            curr = curr.next;
        }
        return res;
    }
}
exports.Node = Node;

},{}],5:[function(require,module,exports){
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Syllable_clusters, _Syllable_isClosed, _Syllable_isAccented, _Syllable_isFinal;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Syllable = void 0;
/**
 * A `Syllable` is created from an array of [[`Clusters`]].
 */
class Syllable {
    /**
     *
     * @param clusters
     * @param param1
     *
     * See the {@page Syllabification} page for how a syllable is determined.
     * Currently, the Divine Name (e.g. יהוה), non-Hebrew text, and Hebrew punctuation (e.g. _passeq_, _nun hafucha_) are treated as a _single syllable_ because these do not follow the rules of Hebrew syllabification.
     */
    constructor(clusters, { isClosed = false, isAccented = false, isFinal = false } = {}) {
        _Syllable_clusters.set(this, void 0);
        _Syllable_isClosed.set(this, void 0);
        _Syllable_isAccented.set(this, void 0);
        _Syllable_isFinal.set(this, void 0);
        __classPrivateFieldSet(this, _Syllable_clusters, clusters, "f");
        __classPrivateFieldSet(this, _Syllable_isClosed, isClosed, "f");
        __classPrivateFieldSet(this, _Syllable_isAccented, isAccented, "f");
        __classPrivateFieldSet(this, _Syllable_isFinal, isFinal, "f");
    }
    /**
     * @returns a string that has been built up from the .text of its consituent Clusters
     *
     * ```typescript
     * const text: Text = new Text("וַיִּקְרָ֨א");
     * const sylText = text.syllables.map((syl) => syl.text);
     * sylText;
     * //  [
     * //    "וַ"
     * //    "יִּקְ"
     * //    "רָ֨א"
     * //  ]
     * ```
     */
    get text() {
        return this.clusters.reduce((init, cluster) => init + cluster.text, "");
    }
    /**
     * @returns a one dimensional array of Clusters
     *
     * ```typescript
     * const text: Text = new Text("וַיִּקְרָ֨א");
     * text.syllables[1].clusters;
     * // [
     * //    Cluster { original: "יִּ" },
     * //    Cluster { original: "קְ" }
     * //  ]
     * ```
     */
    get clusters() {
        return __classPrivateFieldGet(this, _Syllable_clusters, "f");
    }
    /**
     * @returns a one dimensional array of Chars
     *
     * ```typescript
     * const text: Text = new Text("וַיִּקְרָ֨א");
     * text.syllables[2].chars;
     * // [
     * //    Char { original: "ר" },
     * //    Char { original: "ָ" },
     * //    Char { original: "" }, i.e. \u{05A8} (does not print well)
     * //    Char { original: "א" }
     * //  ]
     * ```
     */
    get chars() {
        return this.clusters.map((cluster) => cluster.chars).flat();
    }
    /**
     * @returns true if Syllable is closed
     *
     * a closed syllable in Hebrew is a CVC or CVCC type, a mater letter does not close a syllable
     *
     * ```typescript
     * const text: Text = new Text("וַיִּקְרָ֨א");
     * text.syllables[0].isClosed; // i.e. "וַ"
     * // true
     * text.syllables[2].isClosed; // i.e. "רָ֨א"
     * // false
     * ```
     */
    get isClosed() {
        return __classPrivateFieldGet(this, _Syllable_isClosed, "f");
    }
    /**
     * @param closed a boolean for whether the Syllable is closed
     *
     * a closed syllable in Hebrew is a CVC or CVCC type, a _mater_ letter does not close a syllable
     */
    set isClosed(closed) {
        __classPrivateFieldSet(this, _Syllable_isClosed, closed, "f");
    }
    /**
     * @returns true if Syllable is accented
     *
     * an accented syllable receives stress
     *
     * ```typescript
     * const text: Text = new Text("וַיִּקְרָ֨א"); // note the taam over the ר
     * text.syllables[0].isAccented; // i.e. "וַ"
     * // false
     * text.syllables[2].isAccented; // i.e. "רָ֨א"
     * // true
     * ```
     */
    get isAccented() {
        return __classPrivateFieldGet(this, _Syllable_isAccented, "f");
    }
    /**
     * @param accented a boolean for whether the Syllable is accented
     *
     * an accented syllable receives stress
     */
    set isAccented(accented) {
        __classPrivateFieldSet(this, _Syllable_isAccented, accented, "f");
    }
    /**
     * @returns true if Syllable is final
     *
     * ```typescript
     * const text: Text = new Text("וַיִּקְרָ֨א");
     * text.syllables[0].isFinal; // i.e. "וַ"
     * // false
     * text.syllables[2].isFinal; // i.e. "רָ֨א"
     * // true
     * ```
     */
    get isFinal() {
        return __classPrivateFieldGet(this, _Syllable_isFinal, "f");
    }
    /**
     * @param final a boolean for whether the Syllable is the final Syallble
     */
    set isFinal(final) {
        __classPrivateFieldSet(this, _Syllable_isFinal, final, "f");
    }
}
exports.Syllable = Syllable;
_Syllable_clusters = new WeakMap(), _Syllable_isClosed = new WeakMap(), _Syllable_isAccented = new WeakMap(), _Syllable_isFinal = new WeakMap();

},{}],6:[function(require,module,exports){
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Text_original;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const word_1 = require("./word");
const qametsQatan_1 = require("./utils/qametsQatan");
const sequence_1 = require("./utils/sequence");
const holemWaw_1 = require("./utils/holemWaw");
const regularExpressions_1 = require("./utils/regularExpressions");
/**
 * `Text` is the main exported class.
 *
 */
class Text {
    /**
     * `Text` requires an input string,
     * and has optional arguments for syllabification,
     * which can be read about in the {@page Syllabification} page
     */
    constructor(text, options = {}) {
        _Text_original.set(this, void 0);
        __classPrivateFieldSet(this, _Text_original, this.validateInput(text), "f");
        this.options = this.setOptions(options);
    }
    validateInput(text) {
        const niqqud = /[\u{05B0}-\u{05BC}\u{05C7}]/u;
        if (!niqqud.test(text)) {
            throw new Error("Text must contain niqqud");
        }
        return text;
    }
    validateOptions(options) {
        const validOpts = ["sqnmlvy", "longVowels", "wawShureq", "qametsQatan", "article"];
        for (const [k, v] of Object.entries(options)) {
            if (!validOpts.includes(k)) {
                throw new Error(`${k} is not a valid option`);
            }
            if (typeof v !== "boolean") {
                throw new Error(`The value ${String(v)} is not a valid option for ${k}`);
            }
        }
        return options;
    }
    setOptions(options) {
        const schema = options.schema;
        return schema ? this.setSchemaOptions(schema) : this.setDefaultOptions(options);
    }
    setSchemaOptions(schema) {
        const schemaText = schema.toLowerCase();
        if (schemaText !== "traditional" && schemaText !== "tiberian") {
            throw new Error(`${schemaText} is not a valid schema`);
        }
        const traditionalOpts = { qametsQatan: true, sqnmlvy: true, longVowels: true, vavShureq: true };
        const tiberianOpts = { qametsQatan: false, sqnmlvy: true, longVowels: false, vavShureq: false };
        return schemaText === "traditional" ? traditionalOpts : tiberianOpts;
    }
    setDefaultOptions(options) {
        var _a, _b, _c, _d, _e;
        options = this.validateOptions(options);
        return {
            sqnmlvy: (_a = options.sqnmlvy) !== null && _a !== void 0 ? _a : true,
            article: (_b = options.article) !== null && _b !== void 0 ? _b : true,
            longVowels: (_c = options.longVowels) !== null && _c !== void 0 ? _c : true,
            wawShureq: (_d = options.wawShureq) !== null && _d !== void 0 ? _d : true,
            qametsQatan: (_e = options.qametsQatan) !== null && _e !== void 0 ? _e : true
        };
    }
    get normalized() {
        return this.original.normalize("NFKD");
    }
    get sanitized() {
        const text = this.normalized.trim();
        const sequencedChar = (0, sequence_1.sequence)(text).flat();
        const sequencedText = sequencedChar.reduce((a, c) => a + c.text, "");
        // split text at spaces and maqqef, spaces are added to the array as separate entries
        const textArr = sequencedText.split(regularExpressions_1.splitGroup).filter((group) => group);
        const mapQQatan = this.options.qametsQatan ? textArr.map((word) => (0, qametsQatan_1.convertsQametsQatan)(word)) : textArr;
        const mapHolemWaw = mapQQatan.map((word) => (0, holemWaw_1.holemWaw)(word));
        return mapHolemWaw.join("");
    }
    /**
     * @returns the original string passed
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.original;
     * // "הֲבָרֹות"
     * ```
     */
    get original() {
        return __classPrivateFieldGet(this, _Text_original, "f");
    }
    /**
     * @returns a string that has been decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected
     *
     * ```typescript
     * import { Text } from "havarotjs";
     * const text: Text = new Text("וַתָּשָׁב");
     * text.text;
     * // וַתָּשׇׁב
     * ```
     */
    get text() {
        return this.words.reduce((a, c) => { var _a; return `${a}${c.text}${(_a = c.whiteSpaceAfter) !== null && _a !== void 0 ? _a : ""}`; }, "");
    }
    /**
     * @returns a one dimensional array of Words
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.words;
     * // [Word { original: "הֲבָרֹות" }]
     * ```
     */
    get words() {
        const split = this.sanitized.split(regularExpressions_1.splitGroup);
        const groups = split.filter((group) => group);
        const words = groups.map((word) => new word_1.Word(word, this.options));
        return words;
    }
    /**
     * @returns a one dimensional array of Syllables
     *
     * ```typescript
     * const text: Text = new Text("הֲבָרֹות");
     * text.syllables;
     * // [
     * //    Syllable { original: "הֲ" },
     * //    Syllable { original: "בָ" },
     * //    Syllable { original: "רֹות" }
     * //  ]
     * ```
     */
    get syllables() {
        return this.words.map((word) => word.syllables).flat();
    }
    /**
     * @returns a one dimensional array of Clusters
     *
     * ```typescript
     * const text: Text = new Text("יָד");
     * text.clusters;
     * // [
     * //    Cluster { original: "יָ" },
     * //    Cluster { original: "ד" }
     * //  ]
     * ```
     */
    get clusters() {
        return this.syllables.map((syllable) => syllable.clusters).flat();
    }
    /**
     * @returns a one dimensional array of Chars
     *
     * ```typescript
     * const text: Text = new Text("יָד");
     * text.chars;
     * //  [
     * //    Char { original: "י" },
     * //    Char { original: "ָ" },
     * //    Char { original: "ד" }
     * //  ]
     * ```
     */
    get chars() {
        return this.clusters.map((cluster) => cluster.chars).flat();
    }
}
exports.Text = Text;
_Text_original = new WeakMap();

},{"./utils/holemWaw":8,"./utils/qametsQatan":9,"./utils/regularExpressions":10,"./utils/sequence":12,"./word":14}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDivineName = exports.isDivineName = void 0;
const nonChars = /[\u{0591}-\u{05C7}]/gu;
const isDivineName = (text) => {
    return text.replace(nonChars, "") === "יהוה";
};
exports.isDivineName = isDivineName;
const hasDivineName = (text) => {
    return /יהוה/.test(text.replace(nonChars, ""));
};
exports.hasDivineName = hasDivineName;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holemWaw = void 0;
const removeTaamim_1 = require("./removeTaamim");
const holemWaw = (word) => {
    const wawRegX = /\u{05D5}/u;
    const holemRegx = /\u{05B9}/u;
    const holemHaser = /\u{05BA}/u;
    const wawHolemRegX = /\u{05D5}\u{05B9}/u;
    const vowels = /[\u{05B0}-\u{05BB}\u{05C7}]/u;
    const vowelBeforeWawHolem = new RegExp("(?<!" + vowels.source + ")" + wawHolemRegX.source, "gu");
    // replace holem haser with regular holem
    if (holemHaser.test(word)) {
        word = word.replace(holemHaser, "\u{05B9}");
    }
    // if there is no waw or holem, there is nothing to check
    if (!wawRegX.test(word) || !holemRegx.test(word)) {
        return word;
    }
    const [noTaamim, charPos] = (0, removeTaamim_1.removeTaamim)(word);
    // check for the waw + holem pattern
    if (!wawHolemRegX.test(noTaamim)) {
        return word;
    }
    // check for waw + holem preceded by vowel
    const matches = noTaamim.matchAll(vowelBeforeWawHolem);
    if (!matches) {
        return word;
    }
    for (const match of matches) {
        const start = charPos[match.index]; // eslint-disable-line
        const end = charPos[match[0].length] + start;
        word =
            word.substring(0, start) +
                "\u{05B9}\u{05D5}" +
                (word.substring(end) || word.substring(end - 1)).replace(holemRegx, "");
    }
    return word;
};
exports.holemWaw = holemWaw;

},{"./removeTaamim":11}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertsQametsQatan = void 0;
const sequence_1 = require("./sequence");
const removeTaamim_1 = require("./removeTaamim");
const snippets = [
    "אָבְדַן",
    "אָבְנ",
    "אָזְנ",
    "אָכְל",
    "אָנִיּ",
    "אָפְנ",
    "אָרְח",
    "אָרְכּ",
    "אָשְׁר",
    "בָאְשׁ",
    "בָשְׁתּ",
    "בָּשְׁתּ",
    "גָבְה",
    "גָּבְה",
    "גָדְל",
    "גָּדְל",
    "גָרְנ",
    "גָּרְנ",
    "דָּכְי",
    "דָּרְבָֽן",
    "חָדְשׁ",
    "חָכְמ",
    "חָלְיֽוֹ",
    "חָלְיֹו",
    "חָפְנ",
    "חָפְשִׁי",
    "חָפְשִׁית",
    "חָרְב",
    "חָרְנֶפֶר",
    "חָרְפּ",
    "חָשְׁכּ",
    "יָפְי",
    "יָשְׁר",
    "מָרְדְּכַי",
    "מָתְנ",
    "סָלְתּ",
    "עָזּ",
    "עָמְרִי",
    "עָנְי",
    "עָפְנִי",
    "עָפְר",
    "עָרְל",
    "עָרְפּ",
    "עָשְׁר",
    "צָרְכּ",
    "קָדְק",
    "קָדְשׁ",
    "קָרְבּ",
    "קָרְח",
    "רָגְז",
    "רָחְבּ",
    "שָׁרְשׁ",
    "שָׁרָשׁ",
    "תָּכְנִית"
];
const wholeWords = [
    // nouns
    "חָק־",
    "^יָמִים$",
    "כָּל־",
    "כָל־",
    "^כָּל $",
    "^כָל $",
    "מָר־",
    "רָב־",
    "תָם־",
    "תָּם־",
    // verbs
    "חָנֵּנִי",
    "וַיָּמָת",
    "וַיָּנָס",
    "וַיָּקָם",
    "וַיָּרָם",
    "וַיָּשָׁב",
    "וַתָּמָת",
    "וַתָּקָם",
    "וַתָּשָׁב"
];
const sequenceSnippets = (arr) => {
    return arr.map((snippet) => {
        const text = snippet.normalize("NFKD");
        const sequencedChar = (0, sequence_1.sequence)(text).flat();
        return sequencedChar.reduce((a, c) => a + c.text, "");
    });
};
const snippetsRegx = sequenceSnippets(snippets);
const wholeWordsRegx = sequenceSnippets(wholeWords);
const convertsQametsQatan = (word) => {
    const qametsReg = /\u{05B8}/u;
    const hatefQamRef = /\u{05B3}/u;
    // if no qamets, return
    if (!qametsReg.test(word)) {
        return word;
    }
    // check for hatef qamets followed by qamets pattern
    if (hatefQamRef.test(word)) {
        const hatefPos = word.indexOf("\u{05B3}");
        const qamPos = word.indexOf("\u{05B8}");
        if (qamPos !== -1 && qamPos < hatefPos) {
            return word.substring(0, qamPos) + "\u{05C7}" + word.substring(qamPos + 1);
        }
    }
    const [noTaamim, charPos] = (0, removeTaamim_1.removeTaamim)(word);
    // check if in verbal list (more frequent)
    for (const wholeWord of wholeWordsRegx) {
        const regEx = new RegExp(wholeWord);
        const match = noTaamim.match(regEx);
        if (!match) {
            continue;
        }
        else {
            const lastQam = word.lastIndexOf("\u{05B8}");
            return word.substring(0, lastQam) + "\u{05C7}" + word.substring(lastQam + 1);
        }
    }
    // check if in nominal list
    for (const snippet of snippetsRegx) {
        const regEx = new RegExp(snippet);
        const match = noTaamim.match(regEx);
        if (!match) {
            continue;
        }
        else {
            const start = charPos[match.index]; // eslint-disable-line
            const end = charPos[match[0].length] + start;
            const matched = word.substring(start, end);
            const withQQatan = matched.split(qametsReg).join("\u{05C7}");
            word = word.split(matched).join(withQQatan);
            return word;
        }
    }
    return word;
};
exports.convertsQametsQatan = convertsQametsQatan;

},{"./removeTaamim":11,"./sequence":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitGroup = exports.taamim = void 0;
exports.taamim = /[\u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}]/u;
/**
 * @description group1: word w/ maqqef followed by word w/ maqqef;
 * group2: word w/ maqqef not followed by word w/ maqqef
 * group3: word followed by white space
 */
exports.splitGroup = /(\S*\u{05BE}(?=\S*\u{05BE})|\S*\u{05BE}(?!\S*\u{05BE})|\S*\s*)/u;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTaamim = void 0;
const regularExpressions_1 = require("./regularExpressions");
const removeTaamim = (word) => {
    // https://stackoverflow.com/questions/4590298/how-to-ignore-whitespace-in-a-regular-expression-subject-string
    const globalTaamim = new RegExp(regularExpressions_1.taamim.source, "gu");
    let noTaamim = "";
    const charPos = [];
    // builds a string with no taamim, while keeping track of the index
    for (const [index, element] of [...word].entries()) {
        if (!globalTaamim.test(element)) {
            noTaamim += element;
            charPos.push(index);
        }
    }
    return [noTaamim, charPos];
};
exports.removeTaamim = removeTaamim;

},{"./regularExpressions":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence = void 0;
const cluster_1 = require("../cluster");
/**
 * @returns a two dimensional array of sequenced Char objects
 */
const sequence = (text) => {
    const splits = /(?=[\u{05C0}\u{05D0}-\u{05F2}])/u;
    const hiriqPatach = /\u{5B4}\u{5B7}/u;
    const hiriqQamets = /\u{5B4}\u{5B8}/u;
    // for Jerusalem, where hiriq precedes patah, replace w/ correct patch-hiriq
    if (hiriqPatach.test(text))
        text = text.replace(hiriqPatach, "\u{5B7}\u{5B4}");
    else if (hiriqQamets.test(text))
        text = text.replace(hiriqQamets, "\u{5B8}\u{5B4}");
    const clusters = text.split(splits).map((word) => new cluster_1.Cluster(word));
    const sequenced = clusters.map((cluster) => cluster.chars);
    return sequenced;
};
exports.sequence = sequence;

},{"../cluster":2}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syllabify = exports.makeClusters = void 0;
const cluster_1 = require("../cluster");
const syllable_1 = require("../syllable");
/**
 * @description creates a new Syllable, pushes to results[], and resets syl[]
 */
const createNewSyllable = (result, syl, isClosed) => {
    isClosed = isClosed || false;
    const syllable = new syllable_1.Syllable(syl, { isClosed });
    result.push(syllable);
    return [];
};
/**
 * @description determines the Cluster[] that will become the final Syllable
 */
const groupFinal = (arr) => {
    // grouping the final first helps to avoid issues with final kafs/tavs
    const len = arr.length;
    let i = 0;
    const syl = [];
    let result = [];
    let vowelPresent = false;
    let isClosed = false;
    // get final cluster and push to syl
    // but first check if final cluster is not Hebrew
    const finalCluster = arr[i];
    syl.unshift(finalCluster);
    if (finalCluster.hasVowel) {
        // check if finalCluster is syllable
        vowelPresent = true;
        i++;
    }
    else if (finalCluster.isShureq) {
        // check if final cluster isShureq and get preceding Cluster
        i++;
        if (i <= len) {
            syl.unshift(arr[i]);
        }
        vowelPresent = true;
        i++;
    }
    else {
        isClosed = !finalCluster.isMater;
        i++;
    }
    while (!vowelPresent) {
        const nxt = arr[i];
        const curr = nxt ? nxt : false;
        if (!curr) {
            break;
        }
        syl.unshift(curr);
        if (curr.isShureq) {
            i++;
            syl.unshift(arr[i]);
            vowelPresent = true;
        }
        else {
            const clusterHasVowel = "hasVowel" in curr ? curr.hasVowel : true;
            vowelPresent = clusterHasVowel || curr.isShureq;
        }
        i++;
        if (i > len) {
            break;
        }
    }
    const finalSyllable = new syllable_1.Syllable(syl, { isClosed });
    const remainder = arr.slice(i);
    result = remainder.length ? remainder : [];
    result.unshift(finalSyllable);
    return result;
};
/**
 * @description groups shewas either by themselves or with preceding short vowel
 */
const groupShewas = (arr, options) => {
    let shewaPresent = false;
    let syl = [];
    const result = [];
    const len = arr.length;
    const shewaNewSyllable = createNewSyllable.bind(groupShewas, result);
    for (let index = 0; index < len; index++) {
        const cluster = arr[index];
        // skip if already a syllable
        if (cluster instanceof syllable_1.Syllable) {
            result.push(cluster);
            continue;
        }
        const clusterHasShewa = cluster.hasShewa;
        if (!shewaPresent && clusterHasShewa) {
            shewaPresent = true;
            syl.unshift(cluster);
            continue;
        }
        if (shewaPresent && clusterHasShewa) {
            syl = shewaNewSyllable(syl);
            syl.unshift(cluster);
            continue;
        }
        if (shewaPresent && cluster.hasShortVowel) {
            if (cluster.hasMetheg) {
                syl = shewaNewSyllable(syl);
                syl.unshift(cluster);
                continue;
            }
            const dageshRegx = /\u{05BC}/u;
            const prev = syl[0].text;
            const sqenemlevy = /[שסצקנמלוי]/;
            const wawConsecutive = /וַ/;
            // check if there is a doubling dagesh
            if (dageshRegx.test(prev)) {
                syl = shewaNewSyllable(syl);
            }
            // check for waw-consecutive w/ sqenemlevy letter
            else if (options.sqnmlvy && sqenemlevy.test(prev) && wawConsecutive.test(cluster.text)) {
                syl = shewaNewSyllable(syl);
                result.push(new syllable_1.Syllable([cluster]));
                shewaPresent = false;
                continue;
            }
            // check for article preceding yod w/ shewa
            else if (options.article && /[ילמ]/.test(prev) && /הַ/.test(cluster.text)) {
                syl = shewaNewSyllable(syl);
                result.push(new syllable_1.Syllable([cluster]));
                shewaPresent = false;
                continue;
            }
            syl.unshift(cluster);
            syl = shewaNewSyllable(syl, true);
            shewaPresent = false;
            continue;
        }
        if (shewaPresent && cluster.hasLongVowel) {
            if (options.longVowels) {
                syl = shewaNewSyllable(syl);
                result.push(cluster);
                shewaPresent = false;
            }
            else {
                syl.unshift(cluster);
                syl = shewaNewSyllable(syl, true);
                shewaPresent = false;
            }
            continue;
        }
        if (shewaPresent && cluster.isShureq) {
            if (!options.wawShureq && !cluster.hasMetheg && len - 1 === index) {
                syl.unshift(cluster);
                syl = shewaNewSyllable(syl, true);
            }
            else {
                syl = shewaNewSyllable(syl);
                result.push(cluster);
                shewaPresent = false;
            }
            continue;
        }
        if (shewaPresent && cluster.isMater) {
            syl = shewaNewSyllable(syl);
            result.push(cluster);
            shewaPresent = false;
            continue;
        }
        if (shewaPresent && !cluster.hasVowel) {
            syl.unshift(cluster);
            continue;
        }
        result.push(cluster);
    }
    if (syl.length) {
        shewaNewSyllable(syl);
    }
    return result;
};
/**
 * @description groups non-final maters with preceding cluster
 */
const groupMaters = (arr) => {
    const len = arr.length;
    let syl = [];
    const result = [];
    const materNewSyllable = createNewSyllable.bind(groupMaters, result);
    for (let index = 0; index < len; index++) {
        const cluster = arr[index];
        if (cluster instanceof syllable_1.Syllable) {
            result.push(cluster);
            continue;
        }
        if (cluster.isMater) {
            syl.unshift(cluster);
            const nxt = arr[index + 1];
            if (nxt instanceof syllable_1.Syllable) {
                throw new Error("Syllable should not precede a Cluster with a Mater");
            }
            syl.unshift(nxt);
            syl = materNewSyllable(syl);
            index++;
        }
        // check for quiesced alef — not a mater, but similar
        else if (!cluster.hasVowel && /א/.test(cluster.text)) {
            syl.unshift(cluster);
            const nxt = arr[index + 1];
            // at this point, only final syllables and shewas are Syllables
            if (nxt instanceof syllable_1.Syllable) {
                result.push(cluster);
                continue;
            }
            syl.unshift(nxt);
            syl = materNewSyllable(syl);
            index++;
        }
        else {
            result.push(cluster);
        }
    }
    return result;
};
/**
 * @description groups non-final shureqs with preceding cluster
 */
const groupShureqs = (arr) => {
    const len = arr.length;
    let syl = [];
    const result = [];
    const shureqNewSyllable = createNewSyllable.bind(groupShureqs, result);
    for (let index = 0; index < len; index++) {
        const cluster = arr[index];
        if (cluster instanceof syllable_1.Syllable) {
            result.push(cluster);
            continue;
        }
        if (cluster.isShureq) {
            syl.unshift(cluster);
            const nxt = arr[index + 1];
            if (nxt instanceof syllable_1.Syllable) {
                throw new Error("Syllable should not precede a Cluster with a Mater");
            }
            if (nxt !== undefined) {
                syl.unshift(nxt);
            }
            syl = shureqNewSyllable(syl);
            index++;
        }
        else {
            result.push(cluster);
        }
    }
    return result;
};
/**
 * @description a preprocessing step that groups clusters into intermediate syllables by vowels or shewas
 */
const groupClusters = (arr, options) => {
    const rev = arr.reverse();
    const finalGrouped = groupFinal(rev);
    const shewasGrouped = groupShewas(finalGrouped, options);
    const shureqGroups = groupShureqs(shewasGrouped);
    const matersGroups = groupMaters(shureqGroups);
    const result = matersGroups.reverse();
    return result;
};
/**
 *
 * @param word the word to be split into Cluster
 * @description splits a word at each consonant or the punctuation character
 * Sof Pasuq and Nun Hafukha
 */
const makeClusters = (word) => {
    const split = /(?=[\u{05C3}\u{05C6}\u{05D0}-\u{05F2}\u{2000}-\u{206F}\u{2E00}-\u{2E7F}'!"#$%&()*+,-.\/:;<=>?@\[\]^_`\{|\}~])/u;
    const groups = word.split(split);
    const clusters = groups.map((group) => new cluster_1.Cluster(group));
    return clusters;
};
exports.makeClusters = makeClusters;
const setIsClosed = (syllable, index, arr) => {
    // no need to check, groupFinal takes care of it
    if (index === arr.length - 1) {
        return syllable;
    }
    if (!syllable.isClosed) {
        const dageshRegx = /\u{05BC}/u;
        const hasShortVowel = !!syllable.clusters.filter((cluster) => cluster.hasShortVowel).length;
        /**
         * if `hasShortVowel` is true, nothing to check;
         * if a syllable has only one cluster with a shewa, then it is false;
         * else, it means the preceding cluster has no vowel
         */
        const hasNoVowel = hasShortVowel || !!(syllable.clusters.filter((cluster) => !cluster.hasVowel).length - 1);
        const prev = arr[index + 1];
        const prevDagesh = dageshRegx.test(prev.clusters[0].text);
        syllable.isClosed = (hasShortVowel || hasNoVowel) && prevDagesh;
    }
};
const setIsAccented = (syllable) => {
    const isAccented = syllable.clusters.filter((cluster) => cluster.hasTaamim).length ? true : false;
    syllable.isAccented = isAccented;
};
/**
 *
 * @description a step to get a Cluster's original position before filtering out latin
 */
const clusterPos = (cluster, i) => {
    return { cluster, pos: i };
};
const reinsertLatin = (syls, latin) => {
    const numOfSyls = syls.length;
    for (let index = 0; index < latin.length; index++) {
        const group = latin[index];
        const partial = [];
        // if a latin cluster was at the beginning
        if (group.pos === 0) {
            partial.push(group.cluster);
            while (index + 1 < latin.length && latin[index + 1].pos === group.pos + 1) {
                partial.push(latin[index + 1].cluster);
                index++;
            }
            const firstSyl = syls[0];
            syls[0] = new syllable_1.Syllable([...partial, ...firstSyl.clusters], {
                isClosed: firstSyl.isClosed,
                isAccented: firstSyl.isAccented,
                isFinal: firstSyl.isFinal
            });
        }
        else {
            const lastSyl = syls[numOfSyls - 1];
            while (index < latin.length) {
                partial.push(latin[index].cluster);
                index++;
            }
            syls[numOfSyls - 1] = new syllable_1.Syllable([...lastSyl.clusters, ...partial], {
                isClosed: lastSyl.isClosed,
                isAccented: lastSyl.isAccented,
                isFinal: lastSyl.isFinal
            });
        }
    }
    return syls;
};
const syllabify = (clusters, options) => {
    const removeLatin = clusters.filter((cluster) => !cluster.isNotHebrew);
    const latinClusters = clusters.map(clusterPos).filter((c) => c.cluster.isNotHebrew);
    const groupedClusters = groupClusters(removeLatin, options);
    const syllables = groupedClusters.map((group) => (group instanceof syllable_1.Syllable ? group : new syllable_1.Syllable([group])));
    syllables.forEach((syllable, index, arr) => setIsClosed(syllable, index, arr));
    syllables.forEach((syllable) => setIsAccented(syllable));
    syllables[syllables.length - 1].isFinal = true;
    return latinClusters.length ? reinsertLatin(syllables, latinClusters) : syllables;
};
exports.syllabify = syllabify;

},{"../cluster":2,"../syllable":5}],14:[function(require,module,exports){
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Word_text;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Word = void 0;
const syllabifier_1 = require("./utils/syllabifier");
const syllable_1 = require("./syllable");
const divineName_1 = require("./utils/divineName");
/**
 * [[`Text.text`]] is split at each space and maqqef (U+05BE) both of which are captured.
 * Thus, the string passed to instantiate each `Word` is already properly decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected.
 */
class Word {
    constructor(text, sylOpts) {
        _Word_text.set(this, void 0);
        __classPrivateFieldSet(this, _Word_text, text, "f");
        const startMatch = text.match(/^\s*/g);
        const endMatch = text.match(/\s*$/g);
        this.whiteSpaceBefore = startMatch ? startMatch[0] : null;
        this.whiteSpaceAfter = endMatch ? endMatch[0] : null;
        this.sylOpts = sylOpts;
    }
    /**
     * @returns the word's text trimmed of any whitespace characters
     *
     * ```typescript
     * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
     * const words = text.words.map((word) => word.text);
     * words;
     * // [
     * //    "אֵיפֹה־",
     * //    "אַתָּה",
     * //    "מֹשֶׁה"
     * //  ]
     * ```
     */
    get text() {
        return __classPrivateFieldGet(this, _Word_text, "f").trim();
    }
    /**
     * @returns a one dimensional array of Syllables
     *
     * ```typescript
     * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
     * text.words[0].syllables;
     * // [
     * //    Syllable { original: "אֵי" },
     * //    Syllable { original: "פֹה־" }
     * //  ]
     * ```
     */
    get syllables() {
        if (/\w/.test(this.text) || this.isDivineName) {
            const syl = new syllable_1.Syllable(this.clusters);
            return [syl];
        }
        return (0, syllabifier_1.syllabify)(this.clusters, this.sylOpts);
    }
    /**
     * @returns a one dimensional array of Clusters
     *
     * ```typescript
     * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
     * text.words[0].clusters;
     * // [
     * //    Cluster { original: "אֵ" },
     * //    Cluster { original: "י" },
     * //    Cluster { original: "פֹ" },
     * //    Cluster { original: "ה־" }
     * //  ]
     * ```
     */
    get clusters() {
        const clusters = (0, syllabifier_1.makeClusters)(this.text);
        const firstCluster = clusters[0];
        const remainder = clusters.slice(1);
        firstCluster.siblings = remainder;
        return clusters;
    }
    /**
     * @returns a one dimensional array of Chars
     *
     * ```typescript
     * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");text.words[0].chars;
     * // [
     * //    Char { original: "א" },
     * //    Char { original: "ֵ" }, (tsere)
     * //    Char { original: "פ" },
     * //    Char { original: "ֹ" }, (holem)
     * //    Char { original: "ה"},
     * //    Char { original: "־" }
     * //  ]
     * ```
     */
    get chars() {
        return this.clusters.map((cluster) => cluster.chars).flat();
    }
    /**
     * @returns a boolean indicating if the text is a form of the Divine Name
     *
     * ```typescript
     * const text: Text = new Text("יְהוָה");
     * text.words[0].isDivineName;
     * // true
     * ```
     */
    get isDivineName() {
        return (0, divineName_1.isDivineName)(this.text);
    }
    /**
     * @returns a boolean indicating if the word has a form of the Divine Name
     *
     * ```typescript
     * const text: Text = new Text("בַּֽיהוָ֔ה");
     * text.words[0].hasDivineName;
     * // true
     * ```
     */
    get hasDivineName() {
        return (0, divineName_1.hasDivineName)(this.text);
    }
}
exports.Word = Word;
_Word_text = new WeakMap();

},{"./syllable":5,"./utils/divineName":7,"./utils/syllabifier":13}],"hebrew-transliteration":[function(require,module,exports){
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Schema: () => Schema,
  Text: () => import_havarotjs3.Text,
  remove: () => remove,
  sequence: () => sequence,
  transliterate: () => transliterate
});
module.exports = __toCommonJS(src_exports);
var import_havarotjs3 = require("havarotjs");

// src/sequence.ts
var import_havarotjs = require("havarotjs");
var vowels = /[\u{05B0}-\u{05BD}\u{05BF}\u{05C7}]/u;
var sequence = (text, qametsQatan = false) => {
  return vowels.test(text) ? new import_havarotjs.Text(text, { qametsQatan }).text : text;
};

// src/rules.ts
var import_cluster = require("havarotjs/dist/cluster");

// src/hebCharsTrans.ts
var transliterateMap = {
  "\u05B0": "VOCAL_SHEVA",
  "\u05B1": "HATAF_SEGOL",
  "\u05B2": "HATAF_PATAH",
  "\u05B3": "HATAF_QAMATS",
  "\u05B4": "HIRIQ",
  "\u05B5": "TSERE",
  "\u05B6": "SEGOL",
  "\u05B7": "PATAH",
  "\u05B8": "QAMATS",
  "\u05B9": "HOLAM",
  "\u05BA": "HOLAM",
  "\u05BB": "QUBUTS",
  "\u05BC": "DAGESH",
  "\u05BE": "MAQAF",
  "\u05C0": "PASEQ",
  "\u05C3": "SOF_PASUQ",
  "\u05C7": "QAMATS_QATAN",
  \u05D0: "ALEF",
  \u05D1: "BET",
  \u05D2: "GIMEL",
  \u05D3: "DALET",
  \u05D4: "HE",
  \u05D5: "VAV",
  \u05D6: "ZAYIN",
  \u05D7: "HET",
  \u05D8: "TET",
  \u05D9: "YOD",
  \u05DA: "FINAL_KAF",
  \u05DB: "KAF",
  \u05DC: "LAMED",
  \u05DD: "FINAL_MEM",
  \u05DE: "MEM",
  \u05DF: "FINAL_NUN",
  \u05E0: "NUN",
  \u05E1: "SAMEKH",
  \u05E2: "AYIN",
  \u05E3: "FINAL_PE",
  \u05E4: "PE",
  \u05E5: "FINAL_TSADI",
  \u05E6: "TSADI",
  \u05E7: "QOF",
  \u05E8: "RESH",
  \u05E9: "SHIN",
  \u05EA: "TAV"
};

// src/mapChars.ts
var mapChars = (text, schema) => [...text].map((char) => char in transliterateMap ? schema[transliterateMap[char]] : char).join("");

// src/rules.ts
var taamim = /[\u{0590}-\u{05AF}\u{05BD}\u{05BF}]/u;
var changeElementSplit = (input, split, join) => input.split(split).join(join);
var consonantFeatures = (clusterText, syl, cluster, schema) => {
  var _a;
  if ((_a = schema.ADDITIONAL_FEATURES) == null ? void 0 : _a.length) {
    const clusterSeqs = schema.ADDITIONAL_FEATURES.filter((s) => s.FEATURE === "cluster");
    for (const seq of clusterSeqs) {
      const heb = new RegExp(seq.HEBREW, "u");
      if (heb.test(clusterText)) {
        const sylSeq = changeElementSplit(clusterText, heb, seq.TRANSLITERATION);
        return [...sylSeq].map((char) => mapChars(char, schema)).join("");
      }
    }
  }
  clusterText = cluster.hasShewa && syl.isClosed ? clusterText.replace(/\u{05B0}/u, "") : clusterText;
  if (/ה\u{05BC}$/mu.test(clusterText)) {
    return changeElementSplit(clusterText, /ה\u{05BC}/u, schema.HE);
  }
  if (syl.isFinal && !syl.isClosed) {
    const furtiveChet = /\u{05D7}\u{05B7}$/mu;
    if (furtiveChet.test(clusterText)) {
      return changeElementSplit(clusterText, furtiveChet, "\u05B7\u05D7");
    }
    const furtiveAyin = /\u{05E2}\u{05B7}$/mu;
    if (furtiveAyin.test(clusterText)) {
      return changeElementSplit(clusterText, furtiveAyin, "\u05B7\u05E2");
    }
    const furtiveHe = /\u{05D4}\u{05BC}\u{05B7}$/mu;
    if (furtiveHe.test(clusterText)) {
      return changeElementSplit(clusterText, furtiveHe, "\u05B7\u05D4\u05BC");
    }
  }
  const prevHasVowel = cluster.prev instanceof import_cluster.Cluster ? cluster.prev.hasVowel : false;
  const isDoubled = schema.DAGESH_CHAZAQ && prevHasVowel && /\u{05BC}/u.test(clusterText);
  if (schema.BET_DAGESH && /ב\u{05BC}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /ב\u{05BC}/u, schema.BET_DAGESH.repeat(isDoubled ? 2 : 1));
  }
  if (schema.GIMEL_DAGESH && /ג\u{05BC}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /ג\u{05BC}/u, schema.GIMEL_DAGESH.repeat(isDoubled ? 2 : 1));
  }
  if (schema.DALET_DAGESH && /ד\u{05BC}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /ד\u{05BC}/u, schema.DALET_DAGESH.repeat(isDoubled ? 2 : 1));
  }
  if (schema.KAF_DAGESH && /כ\u{05BC}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /כ\u{05BC}/u, schema.KAF_DAGESH.repeat(isDoubled ? 2 : 1));
  }
  if (schema.KAF_DAGESH && /ך\u{05BC}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /ך\u{05BC}/u, schema.KAF_DAGESH.repeat(isDoubled ? 2 : 1));
  }
  if (schema.PE_DAGESH && /פ\u{05BC}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /פ\u{05BC}/u, schema.PE_DAGESH.repeat(isDoubled ? 2 : 1));
  }
  if (schema.TAV_DAGESH && /ת\u{05BC}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /ת\u{05BC}/u, schema.TAV_DAGESH.repeat(isDoubled ? 2 : 1));
  }
  if (/ש\u{05C1}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /ש\u{05C1}/u, schema.SHIN.repeat(isDoubled ? 2 : 1));
  }
  if (/ש\u{05C2}/u.test(clusterText)) {
    return changeElementSplit(clusterText, /ש\u{05C2}/u, schema.SIN.repeat(isDoubled ? 2 : 1));
  }
  if (isDoubled) {
    const consonant = cluster.chars[0].text;
    const consonantDagesh = new RegExp(consonant + "\u05BC", "u");
    return changeElementSplit(clusterText, consonantDagesh, `${consonant + consonant}`);
  }
  if (cluster.isShureq) {
    return schema.SHUREQ;
  }
  return clusterText;
};
var materFeatures = (syl, schema) => {
  const mater = syl.clusters.filter((c) => c.isMater)[0];
  const prev = mater.prev instanceof import_cluster.Cluster ? mater.prev : null;
  const materText = mater.text;
  const prevText = ((prev == null ? void 0 : prev.text) || "").replace(taamim, "");
  let noMaterText = syl.clusters.filter((c) => !c.isMater).map((c) => consonantFeatures(c.text.replace(taamim, ""), syl, c, schema)).join("");
  const hasMaqaf = mater.text.includes("\u05BE");
  noMaterText = hasMaqaf ? noMaterText.concat("\u05BE") : noMaterText;
  if (/י/.test(materText)) {
    if (/\u{05B4}/u.test(prevText)) {
      return changeElementSplit(noMaterText, /\u{05B4}/u, schema.HIRIQ_YOD);
    }
    if (/\u{05B5}/u.test(prevText)) {
      return changeElementSplit(noMaterText, /\u{05B5}/u, schema.TSERE_YOD);
    }
    if (/\u{05B6}/u.test(prevText)) {
      return changeElementSplit(noMaterText, /\u{05B6}/u, schema.SEGOL_YOD);
    }
  }
  if (/ו/u.test(materText)) {
    if (/\u{05B9}/u.test(prevText)) {
      return changeElementSplit(noMaterText, /\u{05B9}/u, schema.HOLAM_VAV);
    }
  }
  if (/ה/.test(materText)) {
    if (/\u{05B8}/u.test(prevText)) {
      return changeElementSplit(noMaterText, /\u{05B8}/u, schema.QAMATS_HE);
    }
    if (/\u{05B6}/u.test(prevText)) {
      return changeElementSplit(noMaterText, /\u{05B6}/u, schema.SEGOL_HE);
    }
    if (/\u{05B5}/u.test(prevText)) {
      return changeElementSplit(noMaterText, /\u{05B5}/u, schema.SEGOL_HE);
    }
  }
  return materText;
};
var joinChars = (isAccented, sylChars, schema) => {
  if (!isAccented) {
    return sylChars.map((char) => mapChars(char, schema)).join("");
  }
  if (schema.STRESS_MARKER) {
    const location = schema.STRESS_MARKER.location;
    const mark = schema.STRESS_MARKER.mark;
    if (location === "before-syllable") {
      return `${mark}${sylChars.map((char) => mapChars(char, schema)).join("")}`;
    }
    if (location === "after-syllable") {
      return `${sylChars.map((char) => mapChars(char, schema)).join("")}${mark}`;
    }
    const vowels3 = [
      schema.PATAH,
      schema.HATAF_PATAH,
      schema.QAMATS,
      schema.HATAF_QAMATS,
      schema.SEGOL,
      schema.HATAF_SEGOL,
      schema.TSERE,
      schema.HIRIQ,
      schema.HOLAM,
      schema.QAMATS_QATAN,
      schema.QUBUTS,
      schema.QAMATS_HE,
      schema.SEGOL_HE,
      schema.TSERE_HE,
      schema.HIRIQ_YOD,
      schema.TSERE_YOD,
      schema.SEGOL_YOD,
      schema.HOLAM_VAV,
      schema.SHUREQ
    ].sort((a, b) => b.length - a.length);
    const vowelRgx = new RegExp(`${vowels3.join("|")}`);
    const str = sylChars.map((char) => mapChars(char, schema)).join("");
    const match = str.match(vowelRgx);
    if (location === "before-vowel") {
      return (match == null ? void 0 : match.length) ? str.replace(match[0], `${mark}${match[0]}`) : str;
    }
    return (match == null ? void 0 : match.length) ? str.replace(match[0], `${match[0]}${mark}`) : str;
  }
  return sylChars.map((char) => mapChars(char, schema)).join("");
};
var sylRules = (syl, schema) => {
  var _a;
  const sylTxt = syl.text.replace(taamim, "");
  if ((_a = schema.ADDITIONAL_FEATURES) == null ? void 0 : _a.length) {
    const sylSeqs = schema.ADDITIONAL_FEATURES.filter((s) => s.FEATURE === "syllable");
    for (const seq of sylSeqs) {
      const heb = new RegExp(seq.HEBREW, "u");
      if (heb.test(sylTxt)) {
        const wordSeq = changeElementSplit(sylTxt, heb, seq.TRANSLITERATION);
        return joinChars(syl.isAccented, [...wordSeq], schema);
      }
    }
  }
  const mSSuffix = /\u{05B8}\u{05D9}\u{05D5}/u;
  if (syl.isFinal && mSSuffix.test(sylTxt)) {
    const sufxSyl = changeElementSplit(sylTxt, mSSuffix, schema.MS_SUFX);
    return joinChars(syl.isAccented, [...sufxSyl], schema);
  }
  const hasMater = syl.clusters.map((c) => c.isMater).includes(true);
  if (hasMater) {
    const materSyl = materFeatures(syl, schema);
    return joinChars(syl.isAccented, [...materSyl], schema);
  }
  const returnTxt = syl.clusters.map((cluster) => {
    const clusterText = cluster.text.replace(taamim, "");
    return consonantFeatures(clusterText, syl, cluster, schema);
  });
  return joinChars(syl.isAccented, returnTxt, schema);
};
var wordRules = (word, schema) => {
  var _a;
  if (word.isDivineName)
    return schema.DIVINE_NAME;
  if (word.hasDivineName)
    return `${sylRules(word.syllables[0], schema)}-${schema.DIVINE_NAME}`;
  if ((_a = schema.ADDITIONAL_FEATURES) == null ? void 0 : _a.length) {
    const wordSeqs = schema.ADDITIONAL_FEATURES.filter((s) => s.FEATURE === "word");
    for (const seq of wordSeqs) {
      const heb = new RegExp(seq.HEBREW, "u");
      const wordText = word.text.replace(taamim, "");
      if (heb.test(wordText)) {
        const wordSeq = changeElementSplit(wordText, heb, seq.TRANSLITERATION);
        return [...wordSeq].map((char) => mapChars(char, schema)).join("");
      }
    }
  }
  return word;
};

// src/schema.ts
var Schema = class {
  constructor(schema) {
    this.VOCAL_SHEVA = schema.VOCAL_SHEVA, this.HATAF_SEGOL = schema.HATAF_SEGOL, this.HATAF_PATAH = schema.HATAF_PATAH, this.HATAF_QAMATS = schema.HATAF_QAMATS, this.HIRIQ = schema.HIRIQ, this.TSERE = schema.TSERE, this.SEGOL = schema.SEGOL, this.PATAH = schema.PATAH, this.QAMATS = schema.QAMATS, this.HOLAM = schema.HOLAM, this.QUBUTS = schema.QUBUTS, this.DAGESH = schema.DAGESH, this.DAGESH_CHAZAQ = schema.DAGESH_CHAZAQ, this.MAQAF = schema.MAQAF, this.PASEQ = schema.PASEQ, this.SOF_PASUQ = schema.SOF_PASUQ, this.QAMATS_QATAN = schema.QAMATS_QATAN, this.FURTIVE_PATAH = schema.FURTIVE_PATAH, this.HIRIQ_YOD = schema.HIRIQ_YOD, this.TSERE_YOD = schema.TSERE_YOD, this.SEGOL_YOD = schema.SEGOL_YOD, this.SHUREQ = schema.SHUREQ, this.HOLAM_VAV = schema.HOLAM_VAV, this.QAMATS_HE = schema.QAMATS_HE, this.SEGOL_HE = schema.SEGOL_HE, this.TSERE_HE = schema.TSERE_HE, this.MS_SUFX = schema.MS_SUFX, this.ALEF = schema.ALEF, this.BET_DAGESH = schema.BET_DAGESH, this.BET = schema.BET, this.GIMEL = schema.GIMEL, this.GIMEL_DAGESH = schema.GIMEL_DAGESH, this.DALET = schema.DALET, this.DALET_DAGESH = schema.DALET_DAGESH, this.HE = schema.HE, this.VAV = schema.VAV, this.ZAYIN = schema.ZAYIN, this.HET = schema.HET, this.TET = schema.TET, this.YOD = schema.YOD, this.FINAL_KAF = schema.FINAL_KAF, this.KAF = schema.KAF, this.KAF_DAGESH = schema.KAF_DAGESH, this.LAMED = schema.LAMED, this.FINAL_MEM = schema.FINAL_MEM, this.MEM = schema.MEM, this.FINAL_NUN = schema.FINAL_NUN, this.NUN = schema.NUN, this.SAMEKH = schema.SAMEKH, this.AYIN = schema.AYIN, this.FINAL_PE = schema.FINAL_PE, this.PE = schema.PE, this.PE_DAGESH = schema.PE_DAGESH, this.FINAL_TSADI = schema.FINAL_TSADI, this.TSADI = schema.TSADI, this.QOF = schema.QOF, this.RESH = schema.RESH, this.SHIN = schema.SHIN, this.SIN = schema.SIN, this.TAV = schema.TAV, this.TAV_DAGESH = schema.TAV_DAGESH, this.DIVINE_NAME = schema.DIVINE_NAME, this.SYLLABLE_SEPARATOR = schema.SYLLABLE_SEPARATOR, this.ADDITIONAL_FEATURES = schema.ADDITIONAL_FEATURES, this.STRESS_MARKER = schema.STRESS_MARKER, this.longVowels = schema.longVowels, this.qametsQatan = schema.qametsQatan, this.sqnmlvy = schema.sqnmlvy, this.wawShureq = schema.wawShureq, this.article = schema.article;
  }
};
var SBL = class extends Schema {
  constructor(schema) {
    var _a, _b, _c, _d, _e, _f;
    super({
      VOCAL_SHEVA: schema.VOCAL_SHEVA || "\u01DD",
      HATAF_SEGOL: schema.HATAF_SEGOL || "\u0115",
      HATAF_PATAH: schema.HATAF_PATAH || "\u0103",
      HATAF_QAMATS: schema.HATAF_QAMATS || "\u014F",
      HIRIQ: schema.HIRIQ || "i",
      TSERE: schema.TSERE || "\u0113",
      SEGOL: schema.SEGOL || "e",
      PATAH: schema.PATAH || "a",
      QAMATS: schema.QAMATS || "\u0101",
      HOLAM: schema.HOLAM || "\u014D",
      QUBUTS: schema.QUBUTS || "\u016B",
      DAGESH: schema.DAGESH || "",
      DAGESH_CHAZAQ: (_a = schema.DAGESH_CHAZAQ) != null ? _a : true,
      MAQAF: schema.MAQAF || "-",
      PASEQ: schema.PASEQ || "",
      SOF_PASUQ: schema.SOF_PASUQ || "",
      QAMATS_QATAN: schema.QAMATS_QATAN || "o",
      FURTIVE_PATAH: schema.FURTIVE_PATAH || "a",
      HIRIQ_YOD: schema.HIRIQ_YOD || "\xEE",
      TSERE_YOD: schema.TSERE_YOD || "\xEA",
      SEGOL_YOD: schema.SEGOL_YOD || "\xEA",
      SHUREQ: schema.SHUREQ || "\xFB",
      HOLAM_VAV: schema.HOLAM_VAV || "\xF4",
      QAMATS_HE: schema.QAMATS_HE || "\xE2",
      SEGOL_HE: schema.SEGOL_HE || "\xEA",
      TSERE_HE: schema.TSERE_HE || "\xEA",
      MS_SUFX: schema.MS_SUFX || "\u0101yw",
      ALEF: schema.ALEF || "\u02BE",
      BET: schema.BET || "b",
      BET_DAGESH: schema.BET_DAGESH || void 0,
      GIMEL: schema.GIMEL || "g",
      GIMEL_DAGESH: schema.GIMEL_DAGESH || void 0,
      DALET: schema.DALET || "d",
      DALET_DAGESH: schema.DALET_DAGESH || void 0,
      HE: schema.HE || "h",
      VAV: schema.VAV || "w",
      ZAYIN: schema.ZAYIN || "z",
      HET: schema.HET || "\u1E25",
      TET: schema.TET || "\u1E6D",
      YOD: schema.YOD || "y",
      FINAL_KAF: schema.FINAL_KAF || "k",
      KAF: schema.KAF || "k",
      KAF_DAGESH: schema.KAF_DAGESH || void 0,
      LAMED: schema.LAMED || "l",
      FINAL_MEM: schema.FINAL_MEM || "m",
      MEM: schema.MEM || "m",
      FINAL_NUN: schema.FINAL_NUN || "n",
      NUN: schema.NUN || "n",
      SAMEKH: schema.SAMEKH || "s",
      AYIN: schema.AYIN || "\u02BF",
      FINAL_PE: schema.FINAL_PE || "p",
      PE: schema.PE || "p",
      PE_DAGESH: schema.PE_DAGESH || void 0,
      FINAL_TSADI: schema.FINAL_TSADI || "\u1E63",
      TSADI: schema.TSADI || "\u1E63",
      QOF: schema.QOF || "q",
      RESH: schema.RESH || "r",
      SHIN: schema.SHIN || "\u0161",
      SIN: schema.SIN || "\u015B",
      TAV: schema.TAV || "t",
      TAV_DAGESH: schema.TAV_DAGESH || void 0,
      DIVINE_NAME: schema.DIVINE_NAME || "yhwh",
      SYLLABLE_SEPARATOR: schema.SYLLABLE_SEPARATOR || void 0,
      ADDITIONAL_FEATURES: schema.ADDITIONAL_FEATURES || void 0,
      STRESS_MARKER: schema.STRESS_MARKER || void 0,
      longVowels: (_b = schema.longVowels) != null ? _b : true,
      qametsQatan: (_c = schema.qametsQatan) != null ? _c : true,
      sqnmlvy: (_d = schema.sqnmlvy) != null ? _d : true,
      wawShureq: (_e = schema.wawShureq) != null ? _e : true,
      article: (_f = schema.article) != null ? _f : true
    });
  }
};

// src/transliterate.ts
var import_havarotjs2 = require("havarotjs");
var import_word = require("havarotjs/dist/word");
var getSylOpts = (schema) => {
  const options = {};
  if ("longVowels" in schema)
    options.longVowels = schema.longVowels;
  if ("qametsQatan" in schema)
    options.qametsQatan = schema.qametsQatan;
  if ("sqnmlvy" in schema)
    options.sqnmlvy = schema.sqnmlvy;
  if ("wawShureq" in schema)
    options.wawShureq = schema.wawShureq;
  if ("article" in schema)
    options.article = schema.article;
  return options;
};
var transliterate = (text, schema) => {
  const transSchema = schema instanceof Schema ? schema : new SBL(schema != null ? schema : {});
  const isText = text instanceof import_havarotjs2.Text;
  if (!isText && !vowels.test(text))
    return mapChars(text, transSchema);
  const sylOptions = getSylOpts(transSchema != null ? transSchema : {});
  const newText = isText ? text : new import_havarotjs2.Text(text, sylOptions);
  return newText.words.map((word) => {
    var _a, _b;
    let transliteration = wordRules(word, transSchema);
    if (transliteration instanceof import_word.Word) {
      transliteration = word.syllables.map((s) => sylRules(s, transSchema)).join((_a = transSchema.SYLLABLE_SEPARATOR) != null ? _a : "");
    }
    return `${transliteration}${(_b = word.whiteSpaceAfter) != null ? _b : ""}`;
  }).join("");
};

// src/remove.ts
var cantillation = /[\u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}]/gu;
var vowels2 = /[\u{05B0}-\u{05BD}\u{05BF}-\u{05C7}]/gu;
var shinDot = /\u{05C1}/gu;
var sinDot = /\u{05C2}/gu;
var removeItem = (text, item) => text.replace(item, "");
var remove = (text, { removeVowels = false, removeShinDot = false, removeSinDot = false } = {}) => {
  const sequenced = sequence(text);
  const remCantillation = removeItem(sequenced, cantillation);
  const remVowels = removeVowels ? removeItem(remCantillation, vowels2) : remCantillation;
  const remShin = removeShinDot ? removeItem(remVowels, shinDot) : remVowels;
  return removeSinDot ? removeItem(remShin, sinDot) : remShin;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Schema,
  Text,
  remove,
  sequence,
  transliterate
});

},{"havarotjs":3,"havarotjs/dist/cluster":2,"havarotjs/dist/word":14}]},{},[]);
