/* eslint-disable */
import axios from "axios";
import CryptoJS from 'crypto-js'
// import * as $ from "jquery";

export var Tile2Layer = L.TileLayer.extend({

    createTile: function (coords, done) {
        window.__cryptoJSenc = CryptoJS.enc
        var tile = document.createElement('img');

        L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
        L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));

        if (this.options.crossOrigin || this.options.crossOrigin === '') {
            tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
        }

        // for this new option we follow the documented behavior
        // more closely by only setting the property when string
        if (typeof this.options.referrerPolicy === 'string') {
            tile.referrerPolicy = this.options.referrerPolicy;
        }

        // The alt attribute is set to the empty string,
        // allowing screen readers to ignore the decorative image tiles.
        // https://www.w3.org/WAI/tutorials/images/decorative/
        // https://www.w3.org/TR/html-aria/#el-img-empty-alt
        tile.alt = '';

        let imgurl = this.getTileUrl(coords);
        // var _url = new Promise((resolve, reject) => {
        //         resolve(obj);
        // });
        // $.ajax({
        //     url: imgurl,
        //     context: document.body
        //   }).done(function(data ) {
        //     debugger
        //     console.log("xxxx"+data)
        //   });

        // if (window.XMLHttpRequest) {
          //const imageurl='file:///storage/emulated/0/Android/data/com.piesat.xcunzhenx/files/Download/黄冈市影像切片0301/_alllayers/L00/R00000000/C00000000.by'
          //console.log("开始请求加密数据！")
          let that=this;
          try {
            let xmlhttp = new window.XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
              //console.log("读取加密瓦片成功");
              if (xmlhttp.readyState == 4) {
                let imgbase = that.uaprocess(
                  xmlhttp.responseText,
                  "ABCDEF1234567890",
                  "ABCDEF1234567890"
                );
                //console.log("解密瓦片成功");
                tile.src = imgbase;
              }
            };
            xmlhttp.open("GET", imgurl, false);
            xmlhttp.send();
          } catch (error) {}
        // // }
        // axios.get(imgurl).then(res => {
        //     console.log("读取加密瓦片成功")
        //     if (res && res.data) {
        //         let imgbase = this.uaprocess(res.data, 'ABCDEF1234567890', 'ABCDEF1234567890')
        //         console.log(imgbase);
        //         tile.src = imgbase
        //     }
        //     //   that.imageSrc = "data:image/gif;base64," + res.data.img;
        // }).catch(function (error) { })
        // tile.src = imgurl

        return tile;
    },
    uaprocess: function (dcBase64String, key, iv) {

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
        // // 把解密后的对象再转为base64编码,这步是关 键,跟解密文字不同
        var d64 = decryptedData.toString(CryptoJS.enc.Utf8);
        return d64;
    },
    getTileUrl : function (coords) {

        let z = this._getZoomForUrl()
        if (z < 10) {
          z = '0' + z
        }
        const tempX = '00000000' + coords.x.toString(16)
        const tempY = '00000000' + coords.y.toString(16)

        const data = {
          // eslint-disable-next-line no-undef
          r: L.Browser.retina ? '@2x' : '',
          s: this._getSubdomain(coords),
          x: 'C' + tempX.substring(tempX.length - 8),
          y: 'R' + tempY.substring(tempY.length - 8),
          z: 'L' + z
        }
        if (this._map && !this._map.options.crs.infinite) {
          data['-y'] = this._globalTileRange.max.y - coords.y
        }
        // eslint-disable-next-line no-undef
        return L.Util.template(this._url, L.extend(data, this.options))
    }
});


// @factory L.Tile2Layer(urlTemplate: String, options?: Tile2Layer options)
// Instantiates a tile layer object given a `URL template` and optionally an options object.

export function tile2Layer(url, options) {
    return new Tile2Layer(url, options);
}
