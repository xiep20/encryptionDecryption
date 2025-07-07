package main

//加密目录图片（不转base64，处理x、y）
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
	"os"
	"strconv"
	"strings"
)

// var oldpath = "D:\\data\\czgyyq1"
// var newpath = "D:\\data\\czgyyq2"
var oldpath = ""
var newpath = ""
var PwdKey = "ABCDEF1234567890"

func main() {
	fmt.Printf("请输入数据目录url：")
	fmt.Scan(&oldpath)
	fmt.Printf("请输入加密后数据目录url：")
	fmt.Scan(&newpath)
	fmt.Printf("请输入加密Key：")
	fmt.Scan(&PwdKey)
	// fmt.Println(oldpath, newpath)

	ise := PathExists(newpath)
	if !ise {
		// 创建文件夹
		os.MkdirAll(newpath, 0777)
	}

	listAll(oldpath, 0)
}

// pkcs7Padding 填充
func pkcs7Padding(data []byte, blockSize int) []byte {
	//判断缺少几位长度。最少1，最多 blockSize
	padding := blockSize - len(data)%blockSize
	//补足位数。把切片[]byte{byte(padding)}复制padding个
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(data, padText...)
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

// AesEncrypt 加密
func AesEncrypt(data []byte, key []byte) ([]byte, error) {
	// NewCipher creates and returns a new cipher.Block. The key argument should be the AES key, either 16, 24, or 32 bytes to select AES-128, AES-192, or AES-256.
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//判断加密快的大小
	blockSize := block.BlockSize()
	//填充
	encryptBytes := pkcs7Padding(data, blockSize)
	//初始化加密数据接收切片
	crypted := make([]byte, len(encryptBytes))
	//使用cbc加密模式
	blockMode := cipher.NewCBCEncrypter(block, key[:blockSize])
	//执行加密
	blockMode.CryptBlocks(crypted, encryptBytes)
	return crypted, nil
}

// aescode to origin
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

func listAll(path string, curHier int) {
	readerInfos, err := ioutil.ReadDir(path)
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, info := range readerInfos {
		if info.IsDir() {
			for tmpheir := curHier; tmpheir > 0; tmpheir-- {
				fmt.Printf("|\t")
			}
			// fmt.Println(info.Name(), "\\")

			// nowPath := strings.Replace(path+"\\"+info.Name(), oldpath, newpath, 1)
			// ise := PathExists(nowPath)
			// if !ise {
			// 	// 创建文件夹
			// 	os.MkdirAll(nowPath, 0777)
			// }

			listAll(path+"\\"+info.Name(), curHier+1)
		} else {
			for tmpheir := curHier; tmpheir > 0; tmpheir-- {
				// fmt.Printf("|\t")
			}
			//////
			zxystr := strings.Replace(path, oldpath, "", 1)
			zxylist := strings.Split(zxystr, "\\")
			v1 := zxylist[1]
			v2 := zxylist[2]
			v3 := strings.Split(info.Name(), ".")[0]
			ise := PathExists(newpath + "\\" + v1 + "\\" + v2)
			if !ise {
				// 创建文件夹
				os.MkdirAll(newpath+"\\"+v1, 0777)
			}
			//////////////

			content, error := getLocal(path + "\\" + info.Name())
			if error != nil {
				panic(error)
			}
			// content, err := ioutil.ReadFile(path + "\\" + info.Name())
			// if err != nil {
			// 	panic(err)
			// }
			var kn string = getlrc(v1, v2, v3)
			//写入文件
			file1, error := os.Create(newpath + "\\" + v1 + "\\" + kn + ".by")
			if error != nil {
				fmt.Println(error)
			}

			content2, err2 := AesEncrypt(content, []byte(PwdKey))
			if err2 != nil {
				fmt.Println(err2)
				return
			}

			//写入byte的slice数据
			file1.Write(content2)
			// file1.Write([]byte(content))
			//写入字符串
			// file1.WriteString(data)
			file1.Close()

		}
	}
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

// 判断文件是否存在
func PathExists(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	return false
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
