/*
 * @Author: liuwei 893624020@qq.com
 * @Date: 2024-09-25 11:07:20
 * @LastEditors: liuwei 893624020@qq.com
 * @LastEditTime: 2024-09-25 11:38:35
 * @FilePath: \plat-mobile\src\views\offLine\img.worker.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
import CryptoJS from 'crypto-js'
// 子线程注册监听函数，接收到主线程消息后，将消息回发
self.addEventListener('message',  (e) => {
    /////////////////////////
    let imgurl = e.data.img
    let tileId = e.data.tileId
    console.log(imgurl)
     axios(
            {
            method: 'get',
            url: imgurl,
            responseType: 'arraybuffer',
            headers: {Accept: 'application/octet-stream'}
        }
            ).then((response) => {
                // 处理响应数据
            if (response && response.data) {
                let imgbase = uaprocess(response.data, 'ABCDEF1234567890', 'ABCDEF1234567890')
                self.postMessage({img:"data:image/gif;base64," + imgbase,tileId: tileId});
            }
            }).catch(function (error) {
                if(error.response.status !== 404){
                debugger
            }
                console.log(error);
            });
/////////////////////////////
            // fetch(self.origin + '/' + e.data, {
            //     method: "GET",
            //     responseType: 'arraybuffer',
            //     headers: {
            //         // "Content-Type": "application/json",
            //         "Accept": "application/octet-stream"
            //     }
            // }).then(res => {
            //     if (res.status && res.status === 200){
            //         debugger
            //         self.postMessage(res.data);
            //     }
            // });
  }, false);


   function uaprocess(dcBase64String, key, iv) {
    let keyWA = CryptoJS.enc.Utf8.parse(key)
    let ivWA = CryptoJS.enc.Utf8.parse(iv)

    // 将二进制数据转换为Base64字符串
    // dcBase64String = btoa(String.fromCharCode.apply(null, new Uint8Array(dcBase64String))); // 长的报错
   dcBase64String= arrayBufferToBase64(dcBase64String)


    // 解密
    let decryptedData = CryptoJS.AES.decrypt(dcBase64String, keyWA, {
        iv: ivWA,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })

// 将解密结果转换为 Base64 字符串
var d64 = decryptedData.toString(CryptoJS.enc.Base64)
    return d64;
}
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    // 对二进制字符串进行Base64编码
    return btoa(binary);
}
