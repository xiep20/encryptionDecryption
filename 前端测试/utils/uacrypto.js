
import CryptoJS from 'crypto-js'
var u8array = {
    /**
     * Converts a word array to a Uint8Array.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {Uint8Array} The Uint8Array.
     *
     * @static
     *
     * @example
     *
     * var u8arr = CryptoJS.enc.u8array.stringify(wordArray);
     */
    stringify: function (wordArray) {
        // Shortcuts
        var words = wordArray.words
        var sigBytes = wordArray.sigBytes
        // Convert
        var u8 = new Uint8Array(sigBytes)
        for (var i = 0; i < sigBytes; i++) {
            var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
            u8[i] = byte
        }
        return u8
    },
    /**
     * Converts a Uint8Array to a word array.
     *
     * @param {string} u8Str The Uint8Array.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     * var wordArray = CryptoJS.enc.u8array.parse(u8arr);
     */
    parse: function (u8arr) {
        // Shortcut
        var len = u8arr.length
        // Convert
        var words = []
        for (var i = 0; i < len; i++) {
            words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8)
        }
        return CryptoJS.lib.WordArray.create(words, len)
    }
}

uaprocess = (buffer, key, iv) => {
debugger
    // 密钥转字节数组(16位)  
    let keyBy = stringToBytes(key)
    let ivBy = stringToBytes(iv)

    // 字节数组转Uint8Array
    let keyBv = new Uint8Array(keyBy)
    let ivBv = new Uint8Array(ivBy)

    // Uint8Array转WordArray
    let keyWA = u8array.parse(keyBv)
    let ivWA = u8array.parse(ivBv)
    let view = new Uint8Array(buffer)

    // 将Uint8Array 转成 WordArray
    let contentWA = u8array.parse(view)
    // base64字符串
    let dcBase64String = contentWA.toString(CryptoJS.enc.Base64)

    // 解密
    let decryptedData = CryptoJS.AES.decrypt(dcBase64String, keyWA, {
        iv: ivWA,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })

    // 把解密后的对象再转为base64编码,这步是关键,跟解密文字不同
    let d64 = decryptedData.toString(CryptoJS.enc.Base64)
}

export { u8array, uaprocess } 