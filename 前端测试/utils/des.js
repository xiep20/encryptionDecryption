// import CryptoJS from 'crypto-js'

// 随机生成指定数量的16进制key(该方法非必须，可直接指定固定key值，看后端怎么定义key和偏移量)
const generatekey = (num) => {
    const library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let key = ""
    for (let i = 0; i < num; i++) {
        const randomPoz = Math.floor(Math.random() * library.length)
        key += library.substring(randomPoz, randomPoz + 1)
    }
    return key
}

//DES加密 Pkcs7填充方式
const encrypt = (message, key = '123456', iv = '123456') => {
    const keyHex = CryptoJS.enc.Utf8.parse(key) // 秘钥
    const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
    const option = { iv: ivHex, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 } // Pkcs7填充方式
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, option)
    return encrypted.toString() //  加密出来为 hex格式密文
}

// 解密
const decrypt = (message, key = '123456', iv = '123456') => {
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Utf8.parse(iv)
    const decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(message)
    }, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const EncryptAES = (message, key, iv) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Utf8.parse(iv)
    // key 和 iv 使用同一个值
    const encrypted = CryptoJS.AES.encrypt(message, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC, // CBC算法
        padding: CryptoJS.pad.Pkcs7, //使用pkcs7 进行padding 后端需要注意
    });

    return encrypted.toString();
}

const DecryptAES = (message, key, iv) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Utf8.parse(iv)
    // key 和 iv 使用同一个值
    const decrypted = CryptoJS.AES.decrypt(message, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC, // CBC算法
        padding: CryptoJS.pad.Pkcs7, //使用pkcs7 进行padding 后端需要注意
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}




const aseEncrypt = (message, key, iv) => {
    key = PaddingLeft(key, 16);//保证key的长度为16byte,进行'0'补位
    key = CryptoJS.enc.Utf8.parse(key);
    const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
    // 加密结果返回的是CipherParams object类型
    // key 和 iv 使用同一个值
    var encrypted = CryptoJS.AES.encrypt(message, key, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,// CBC算法
        padding: CryptoJS.pad.Pkcs7 //使用pkcs7 进行padding 后端需要注意
    });
    // ciphertext是密文，toString()内传编码格式，比如Base64，这里用了16进制
    // 如果密文要放在 url的参数中 建议进行 base64-url-encoding 和 hex encoding, 不建议使用base64 encoding
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex)  //后端必须进行相反操作

}
// 确保key的长度,使用 0 字符来补位
// length 建议 16 24 32
function PaddingLeft(key, length) {
    let pkey = key.toString();
    let l = pkey.length;
    if (l < length) {
        pkey = new Array(length - l + 1).join('0') + pkey;
    } else if (l > length) {
        pkey = pkey.slice(length);
    }
    return pkey;
}

export {
    encrypt,
    decrypt,
    EncryptAES,
    DecryptAES,
    aseEncrypt
}