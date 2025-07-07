package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const (
	key     = "ABCDEF1234567890"
	iv      = "ABCDEF1234567890"
	dataurl = "D:/data/"
)

func AesEncrypt(encodeStr string, key []byte) (string, error) {
	encodeBytes := []byte(encodeStr)
	//根据key 生成密文
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	blockSize := block.BlockSize()
	encodeBytes = PKCS5Padding(encodeBytes, blockSize)
	blockMode := cipher.NewCBCEncrypter(block, []byte(iv))
	crypted := make([]byte, len(encodeBytes))
	blockMode.CryptBlocks(crypted, encodeBytes)
	return base64.StdEncoding.EncodeToString(crypted), nil
}
func PKCS5Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	//填充
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padtext...)
}
func aesDeCrypt(decodeStr string, key []byte) ([]byte, error) {
	//先解密base64
	decodeBytes, err := base64.StdEncoding.DecodeString(decodeStr)
	if err != nil {
		return nil, err
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	blockMode := cipher.NewCBCDecrypter(block, []byte(iv))
	origData := make([]byte, len(decodeBytes))
	blockMode.CryptBlocks(origData, decodeBytes)
	origData = PKCS5UnPadding(origData)
	return origData, nil
}
func PKCS5UnPadding(origData []byte) []byte {
	length := len(origData)
	unpadding := int(origData[length-1])
	return origData[:(length - unpadding)]
}

func MyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		// 通过 r.URL.Query()获取客户端请求的Query参数
		vars := r.URL.Query()
		// 获取Query键为key的参数值
		key, ok := vars["key"]
		// 如果获取到，打印 hello get ...
		if ok {
			// w.Header().Set("Content-Type", "image/jpeg")
			msg := "hello get " + key[0]
			// w.Write() 将数据返回给客户端
			// 因为 msg 是字符串类型，因此需要强制进行类型转换
			w.Write([]byte(msg))
		} else {
			// 如果没获取到，则打印 hello world
			w.Write([]byte("hello world!"))
		}
	}

	if r.Method == "POST" {
		r.ParseForm()
		key := r.Form.Get("name")
		msg := "hello post " + key
		w.Write([]byte(msg))
	}
}

// 实现File和FileInfo接口的类
type ReadImg struct {
	buf      *bytes.Reader
	fileUrl  string
	fileData []byte
}

// 获取C的图片数据
func ReadImgData(url string) []byte {
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	pix, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	return pix
}

// 获得资源,从本地
func getLocal(url string) ([]byte, error) {
	fp, err := os.OpenFile(url, os.O_CREATE|os.O_APPEND, 6) // 读写方式打开
	if err != nil {
		// 如果有错误返回错误内容
		return nil, err
	}
	defer fp.Close()
	bytes, err := ioutil.ReadAll(fp)
	if err != nil {
		return nil, err
	}
	return bytes, err
}

// 实现File和FileInfo接口
func (r *ReadImg) Close() (err error) {
	return nil
}

func (r *ReadImg) Read(p []byte) (n int, err error) {
	return r.buf.Read(p)
}

func (r *ReadImg) Readdir(count int) ([]os.FileInfo, error) {
	var i os.FileInfo = &ReadImg{buf: bytes.NewReader(r.fileData), fileUrl: r.fileUrl, fileData: r.fileData}
	return []os.FileInfo{i}, nil
}

func (r *ReadImg) Seek(offset int64, whence int) (int64, error) {
	return r.buf.Seek(offset, whence)
}

func (r *ReadImg) Stat() (os.FileInfo, error) {
	var i os.FileInfo = &ReadImg{buf: bytes.NewReader(r.fileData), fileUrl: r.fileUrl, fileData: r.fileData}
	return i, nil
}

func (r *ReadImg) Name() string {
	return filepath.Base(r.fileUrl)[:len(filepath.Base(r.fileUrl))-4]
}

func (r *ReadImg) Size() int64 {
	return (int64)(len(r.fileData))
}

func (r *ReadImg) Mode() os.FileMode {
	return os.ModeSetuid
}

func (r *ReadImg) ModTime() time.Time {
	return time.Now()
}

func (r *ReadImg) IsDir() bool {
	return false
}

func (r *ReadImg) Sys() interface{} {
	return nil
}

// 处理请求
type HttpDealImg struct{}

func (self HttpDealImg) Open(name string) (http.File, error) {
	img_name := name[1:]
	var strkey string = ""
	var strtype string = "png"

	params := strings.Split(img_name, "&")
	if len(params) > 1 {
		for i := 1; i < len(params); i++ {
			if strings.HasPrefix(params[i], "key=") {
				strkey = strings.Split(params[i], "key=")[1]
			}
			if strings.HasPrefix(params[i], "type=") {
				strtype = strings.Split(params[i], "type=")[1]
			}
		}
	}
	newzxy, _ := aesDeCrypt(strkey, []byte(key))
	trzxy := params[0] + "/" + string(newzxy)
	img_url := dataurl + trzxy + "." + strtype //(文件服务器地址)
	// img_data := ReadImgData(img_url) //向服务器气球图片数据
	img_data, err := getLocal(img_url)
	if err != nil {
		panic(err)
	}
	if len(img_data) == 0 {
		fmt.Println("file access forbidden:", name)
		return nil, os.ErrNotExist
	}
	var f http.File = &ReadImg{buf: bytes.NewReader(img_data), fileUrl: img_name, fileData: img_data} //标红的可以查看标准库bytes的Reader类型，NewReader(p []byte)可返回*Reader，然后调用和http.File相同的Seek()和Read()方法
	return f, nil
}

func main() {
	// 路由请求处理函数
	// http.HandleFunc("/hand/", MyHandler)

	http.Handle("/tile/", http.StripPrefix("/tile/", http.FileServer(HttpDealImg{})))

	// 在0.0.0.0:8000监听请求
	// 第二个参数nil意味着服务端调用默认的DefaultServeMux处理客户端请求
	err := http.ListenAndServe("0.0.0.0:8000", nil)
	if err != nil {
		fmt.Println(err)
	}
}
