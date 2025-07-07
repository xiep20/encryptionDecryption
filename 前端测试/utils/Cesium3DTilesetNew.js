
import CryptoJS from 'crypto-js'
// import {
//     Cesium3DTileset

var _Cesium3DTileset = Cesium.Cesium3DTileset

// } from 'cesium'
class Cesium3DTilesetNew {
    constructor(options) {
        var _options = options;
        var url = options.url
        // _options.url= Promise.resolve('happy chen')
        var _url = new Promise((resolve, reject) => {
            setTimeout(() => {
                var obj = { "asset": { "generatetool": "cesiumlab2@www.cesiumlab.com/model2tiles", "gltfUpAxis": "Z", "version": "1.0" }, "extras": { "scenetree": "scenetree.json" }, "geometricError": 452.194486410357, "properties": null, "root": { "boundingVolume": { "box": [-1.62981450557709e-09, 0.00238525564782321, 22.0674041188322, 226.097243205179, 0, 0, 0, 217.074006092967, 0, 0, 0, 21.0751171889715] }, "children": [{ "boundingVolume": { "box": [-7.36532816165227, -24.8268782302864, 11.8214562500412, 141.911979392618, 0, 0, 0, 107.255559616699, 0, 0, 0, 10.8222567824037] }, "content": { "uri": "NoLod_0.b3dm" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [-1.53122670430632, -20.2629381181227, 8.30705906375397, 191.413250236311, 0, 0, 0, 169.948113147926, 0, 0, 0, 7.30714361754212] }, "content": { "uri": "NoLod_1.b3dm" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [-4.54333419767288, -41.5002834676589, 12.5742345799306, 180.629020543156, 0, 0, 0, 134.241413374465, 0, 0, 0, 11.5744720791492] }, "content": { "uri": "NoLod_2.b3dm" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [11.5620703755589, -28.8847384122056, 3.81421420813079, 205.965397934807, 0, 0, 0, 182.997328315166, 0, 0, 0, 2.38369667771049] }, "content": { "uri": "NoLod_3.b3dm" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [11.117290987862, -25.9219054901109, 13.7314336479731, 209.41797496302, 0, 0, 0, 189.559069618435, 0, 0, 0, 12.0589516420082] }, "content": { "uri": "NoLod_4.b3dm" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [-4.54337867632694, 14.1568857598382, 10.1332709403935, 178.350599399497, 0, 0, 0, 187.620187364121, 0, 0, 0, 8.67014796225634] }, "content": { "uri": "NoLod_5.b3dm" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [-5.38403217896092, -20.1761860446669, 21.0555438152398, 217.336061897562, 0, 0, 0, 185.947128076332, 0, 0, 0, 19.5924599833849] }, "content": { "uri": "NoLod_6.cmpt" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [-2.98177924420895, -2.33807218447039, 9.80006836437496, 223.036912654173, 0, 0, 0, 209.518602271068, 0, 0, 0, 8.80007933705424] }, "content": { "uri": "NoLod_7.cmpt" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [-2.97150282669085, -2.33374631864753, 11.8242222262423, 222.926049523704, 0, 0, 0, 209.414224558115, 0, 0, 0, 10.8244011133619] }, "content": { "uri": "NoLod_8.cmpt" }, "geometricError": 0.0 }, { "boundingVolume": { "box": [-4.51471239731708, -18.9012953869262, 22.3055310242511, 219.946891405946, 0, 0, 0, 190.46475775466, 0, 0, 0, 20.842627308388] }, "content": { "uri": "NoLod_9.cmpt" }, "geometricError": 0.0 }], "geometricError": 452.194486410357, "transform": [-0.910483319029677, -0.413545796458752, 0.0, 0.0, 0.209507508766489, -0.461262316233889, 0.862173810430941, 0.0, -0.35654835512054, 0.784994872501627, 0.506612594204874, 0.0, -2276069.89492078, 5011110.47438178, 3212373.48018864, 1.0] } }

                resolve(obj);
            }, 1000);
        });
        // Promise.resolve(_url)
        // .then(function (url) {
        //     debugger
        //     console.log(url)
        // })

        // _options.url = _url

        _Cesium3DTileset.loadJson = function (tilesetUrl) {
            const resource = Cesium.Resource.createIfNeeded(tilesetUrl);
            let r = resource.fetchJson()
                .then(function (tilesetJson) {
                    if (tilesetJson.content) {
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
        // var _loadTileset = _Cesium3DTileset.prototype.loadTileset
        // _Cesium3DTileset.prototype.loadTileset = function (
        //     resource,
        //     tilesetJson,
        //     parentTile
        // ) {
        //     debugger
        //     _loadTileset(
        //         resource,
        //         tilesetJson,
        //         parentTile);
        // }
        var rt = new _Cesium3DTileset(_options)
        // this._readyPromise
        return rt
    };
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

export { Cesium3DTilesetNew }
