package main

//返回解密后图片（加密方式不转base64，处理x、y）
import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

const (
	key     = "ABCDEF1234567890"
	iv      = "ABCDEF1234567890"
	dataurl = "D:/data/"
)

// 解密
func AesDecrypt(data []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//获取块的大小
	blockSize := block.BlockSize()
	//使用cbc
	blockMode := cipher.NewCBCDecrypter(block, key[:blockSize])
	//初始化解密数据接收切片
	crypted := make([]byte, len(data))
	//执行解密
	blockMode.CryptBlocks(crypted, data)
	//去填充
	crypted, err = pkcs7UnPadding(crypted)
	if err != nil {
		return nil, err
	}
	return crypted, nil
}

// pkcs7UnPadding 填充的反向操作
func pkcs7UnPadding(data []byte) ([]byte, error) {
	length := len(data)
	if length == 0 {
		return nil, errors.New("加密字符串错误！")
	}
	//获取填充的个数
	unPadding := int(data[length-1])
	return data[:(length - unPadding)], nil
}

// 层行列加密
func getlrc(_lv string, _row string, _col string) string {
	lv, verr1 := strconv.Atoi(_lv)
	if verr1 != nil {
	}
	row, verr2 := strconv.Atoi(_row)
	if verr2 != nil {
	}
	col, verr3 := strconv.Atoi(_col)
	if verr3 != nil {
	}
	/* 层行列加密计算 */
	var rad int = lv ^ col
	var r_row int = row ^ rad
	var r_col int = col ^ rad
	var _str string = Sha256(strconv.Itoa(r_row) + strconv.Itoa(r_col))
	return GetMD5Encode(_str)
}

// Sha256加密
func Sha256(src string) string {
	m := sha256.New()
	m.Write([]byte(src))
	res := hex.EncodeToString(m.Sum(nil))
	return res
}

// 返回一个32位md5加密后的字符串
func GetMD5Encode(data string) string {
	h := md5.New()
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}

// 返回一个16位md5加密后的字符串
func Get16MD5Encode(data string) string {
	return GetMD5Encode(data)[8:24]
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
	fp, err := os.OpenFile(url, os.O_APPEND, 6) // 读写方式打开
	if err != nil {
		fmt.Println("Open file error:", err)
		// 如果有错误返回错误内容
		return nil, err
	}
	defer fp.Close()
	bytes, err := ioutil.ReadAll(fp)
	if err != nil {
		fmt.Println("Read file error: ", err)
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

	params := strings.Split(img_name, "/")

	num := len(params)
	var x string = ""
	var y string = ""
	var z string = ""
	var path2 string = ""
	if num > 2 {
		for i := 0; i < num; i++ {
			if i == num-1 {
				y = strings.Split(params[i], ".")[0]
			} else if i == num-2 {
				x = params[i]
			} else if i == num-3 {
				z = params[i]
			} else {
				path2 = path2 + params[i] + "/"
			}
		}
	}
	trzxy := getlrc(z, x, y)
	file_url := dataurl + path2 + z + "/" + trzxy + ".by" //(文件服务器地址)
	fmt.Printf(file_url)
	img_data, err := getLocal(file_url)
	if err != nil {
		panic(err)
	}
	if len(img_data) == 0 {
		fmt.Println("file access forbidden:", name)
		return nil, os.ErrNotExist
	}
	newzxy, _ := AesDecrypt(img_data, []byte(key))
	fmt.Printf(img_name)
	var f http.File = &ReadImg{buf: bytes.NewReader(newzxy), fileUrl: img_name, fileData: newzxy} //标红的可以查看标准库bytes的Reader类型，NewReader(p []byte)可返回*Reader，然后调用和http.File相同的Seek()和Read()方法
	return f, nil
}

func main() {
	// 路由请求处理函数
	// http.HandleFunc("/hand/", MyHandler)

	http.Handle("/tile/", http.StripPrefix("/tile/", http.FileServer(HttpDealImg{})))

	// 在0.0.0.0:8000监听请求
	// 第二个参数nil意味着服务端调用默认的DefaultServeMux处理客户端请求
	err := http.ListenAndServe("0.0.0.0:8041", nil)
	if err != nil {
		fmt.Println(err)
	}
}
