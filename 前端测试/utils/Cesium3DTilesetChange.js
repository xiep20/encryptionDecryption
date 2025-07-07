
import CryptoJS from 'crypto-js'

//重写Cesium3DTileset.loadJson
Cesium.Cesium3DTileset.loadJson = function (tilesetUrl) {
    const resource = Cesium.Resource.createIfNeeded(tilesetUrl);
    let r = resource.fetchJson()
        .then(function (tilesetJson) {
            if (tilesetJson.content) {
                //解密
                var tilesetJson_ = uaprocess(tilesetJson.content, 'ABCDEF1234567890', 'ABCDEF1234567890')
                return tilesetJson_
            } else {
                return tilesetJson
            }
        })
        ;

    var rp = Promise.resolve(r)
    return rp
    // return _url;
};

var uaprocess = (dcBase64String, key, iv) => {

    let keyWA = CryptoJS.enc.Utf8.parse(key)
    let ivWA = CryptoJS.enc.Utf8.parse(iv)

    // CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('我是一段需要处理的字符'))//base64加密
    // let dcBase64String2 = CryptoJS.enc.Base64.parse(dcBase64String).toString(CryptoJS.enc.Utf8);//base64解密
    // let dcBase64String2 = CryptoJS.enc.Base64.parse(dcBase64String).toString(CryptoJS.enc.Base64)

    // 解密
    let decryptedData = CryptoJS.AES.decrypt(dcBase64String, keyWA, {
        iv: ivWA,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    // var contentu8 = u8array.stringify(decryptedData)
    // return contentu8
    // // 把解密后的对象再转为base64编码,这步是关键,跟解密文字不同
    // let d64 = decryptedData.toString(CryptoJS.enc.Base64)
    // var bv = u8array.stringify(decryptedData);
    var d64 = decryptedData.toString(CryptoJS.enc.Utf8);
    // var d64 = decryptedData.toString(CryptoJS.enc.Base64);

    // var bv = base64ToUint8Array(d64);
    // var bv = Utf8ToUint8Array(d64);
    var bv = JSON.parse(d64)
    return bv;
}
