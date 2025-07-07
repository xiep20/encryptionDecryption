// import axios from 'axios'
import CryptoJS from 'crypto-js'
export var Tile2Layer1 = L.TileLayer.extend({
  getTileUrl: function (coords) {
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
  },
  createTile: function (coords, done) {
    window.__cryptoJSenc = CryptoJS.enc
    var tile = document.createElement('img')

    L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile))
    L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile))

    if (this.options.crossOrigin || this.options.crossOrigin === '') {
      tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin
    }

    // for this new option we follow the documented behavior
    // more closely by only setting the property when string
    if (typeof this.options.referrerPolicy === 'string') {
      tile.referrerPolicy = this.options.referrerPolicy
    }

    // The alt attribute is set to the empty string,
    // allowing screen readers to ignore the decorative image tiles.
    // https://www.w3.org/WAI/tutorials/images/decorative/
    // https://www.w3.org/TR/html-aria/#el-img-empty-alt
    tile.alt = ''

    const imgurl = this.getTileUrl(coords)

    // var _url = new Promise((resolve, reject) => {
    //         resolve(obj);
    // });
    /// ////////////////////////////////////////////////
    const that = this
    // const xmlhttp = new window.XMLHttpRequest()
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', imgurl, true)
    xmlhttp.responseType = 'arraybuffer' // 设置响应类型为 arraybuffer
    // xmlhttp.onreadystatechange = function () {
    //   console.log('onreadystatechange读取加密瓦片readyState：' + xmlhttp.readyState)
    //   console.log('onreadystatechange读取加密瓦片status：' + xmlhttp.status)
    // }
    xmlhttp.onload = function () {
      if (xmlhttp.status === 200 || (xmlhttp.readyState === 4 && xmlhttp.status === 0)) { // 移动端中出现status一直是0
        const imgbase = that.uaprocess(
          xmlhttp.response,
          'ABCDEF1234567890',
          'ABCDEF1234567890'
        )
        tile.src = 'data:image/gif;base64,' + imgbase
      } else {
      }
    }

    xmlhttp.onerror = function () {
      console.log('Network error')
    }

    xmlhttp.send()

    // xmlhttp.onreadystatechange = function () {
    //   console.log('读取加密瓦片readyState：' + xmlhttp.readyState)
    //   console.log('读取加密瓦片status：' + xmlhttp.status)
    //   // console.log("读取加密瓦片成功");
    //   if (xmlhttp.readyState === 4) {
    //     debugger
    //     const imgbase = that.uaprocess(
    //       xmlhttp.responseText,
    //       'ABCDEF1234567890',
    //       'ABCDEF1234567890'
    //     )
    //     console.log('读取加密瓦片responseText：' + imgbase)
    //     // console.log("解密瓦片成功");
    //     tile.src = 'data:image/gif;base64,' + imgbase
    //     console.log('获取瓦片：' + tile.src)
    //   }
    // }
    // xmlhttp.open('GET', imgurl, false)
    // xmlhttp.responseType = 'arraybuffer'
    // xmlhttp.setRequestHeader('Accept', 'application/octet-stream')
    // xmlhttp.send()
    // axios(
    //     {
    //     method: 'get',
    //     url: imgurl,
    //     responseType: 'arraybuffer',
    //     headers: {Accept: 'application/octet-stream'}
    // }
    //     ).then((response) => {
    //         console.log('获取瓦片：' + response.data)
    //         // 处理响应数据
    //     if (response && response.data) {

    //     console.log('获取瓦片：' + imgurl)
    //         let imgbase = this.uaprocess(response.data, 'ABCDEF1234567890', 'ABCDEF1234567890')
    //         tile.src = "data:image/gif;base64," + imgbase
    //         console.log('获取瓦片：' + tile.src)
    //     }
    //     }).catch(function (error) {
    //         console.log(error)
    //     });

    //         ////////////////////////////////////////
    // tile.src = imgurl

    return tile
  },
  uaprocess: function (dcBase64String, key, iv) {
    const keyWA = CryptoJS.enc.Utf8.parse(key)
    const ivWA = CryptoJS.enc.Utf8.parse(iv)

    // CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('我是一段需要处理的字符'))//base64加密
    // let dcBase64String2 = CryptoJS.enc.Base64.parse(dcBase64String).toString(CryptoJS.enc.Utf8);//base64解密
    // let dcBase64String2 = CryptoJS.enc.Base64.parse(dcBase64String).toString(CryptoJS.enc.Base64)
    // 将二进制数据转换为Base64字符串
    // dcBase64String = btoa(String.fromCharCode.apply(null, new Uint8Array(dcBase64String))); // 长的报错
    dcBase64String = arrayBufferToBase64(dcBase64String)

    // 解密
    const decryptedData = CryptoJS.AES.decrypt(dcBase64String, keyWA, {
      iv: ivWA,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    // 将解密结果转换为 Base64 字符串
    var d64 = decryptedData.toString(CryptoJS.enc.Base64)
    return d64
  }
})

function arrayBufferToBase64 (buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  // 对二进制字符串进行Base64编码
  return btoa(binary)
}

// @factory L.Tile2Layer1(urlTemplate: String, options?: Tile2Layer1 options)
// Instantiates a tile layer object given a `URL template` and optionally an options object.

export function Tile2Layer (url, options) {
  return new Tile2Layer1(url, options)
}
