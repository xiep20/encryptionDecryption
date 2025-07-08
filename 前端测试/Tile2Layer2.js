import Worker from './img.worker.js'

let worker = new Worker()

export var Tile2Layer2 = L.TileLayer.extend({

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
        // window.__cryptoJSenc = CryptoJS.enc
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
        tile.id = 'x'+coords.x+'y' + coords.y + 'z' + coords.z;

        let imgurl = this.getTileUrl(coords);
        // var _url = new Promise((resolve, reject) => {
        //         resolve(obj);
        // });
        ////////////////////////////////////////
    // 向子线程发送消息  
    worker.postMessage({img:imgurl,tileId: tile.id})
    // 注册监听函数，接收子线程消息
    worker.onmessage = (event) => {
        if(document.querySelector('#'+event.data.tileId)){
        document.querySelector('#'+event.data.tileId).src = event.data.img
        // tile.src = event.data.img
    //   worker.terminate()
}else{
    debugger
}
    }

  // 监听 Worker 的错误信息
  worker.onerror = function(error) {
    console.error('Worker 发生错误：', error);
  };
  
//         ////////////////////////////////////////
        // tile.src = imgurl

        return tile;
    },
});


// @factory L.Tile2Layer2(urlTemplate: String, options?: Tile2Layer2 options)
// Instantiates a tile layer object given a `URL template` and optionally an options object.

export function tile2Layer2(url, options) {
    return new Tile2Layer2(url, options);
}
