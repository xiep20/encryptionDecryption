package main

// 打乱切片层、行、列；生成新的层、行、列（移动文件）。
import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
)

// var oldpath = "D:\\data\\czgyyq1"
// var newpath = "D:\\data\\czgyyq2"
var oldpath = ""
var newpath = ""

func main() {
	fmt.Printf("请输入数据目录：")
	fmt.Scan(&oldpath)
	fmt.Printf("请输入打乱后数据目录：")
	fmt.Scan(&newpath)
	// fmt.Println(oldpath, newpath)

	ise := PathExists(newpath)
	if !ise {
		// 创建文件夹
		os.MkdirAll(newpath, 0777)
	}

	listAll(oldpath, 0)
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
			zxystr := strings.Replace(path, oldpath, "", 1)
			zxylist := strings.Split(zxystr, "\\")
			v1, verr1 := strconv.Atoi(zxylist[1])
			if verr1 != nil {
			}
			v2, verr2 := strconv.Atoi(zxylist[2])
			if verr2 != nil {
			}
			v3, verr3 := strconv.Atoi(strings.Split(info.Name(), ".")[0])
			if verr3 != nil {
			}
			// fmt.Println(v1, v2, v3)
			a, b, c := getlrc(v1, v2, v3)
			var a2 string = strconv.Itoa(a)
			var b2 string = strconv.Itoa(b)
			var c2 string = strconv.Itoa(c)
			// ise := PathExists(newpath + "\\" + a2 + "\\" + b2)
			// if !ise {
			// 	// 创建文件夹
			// 	os.MkdirAll(newpath+"\\"+a2+"\\"+b2, 0777)
			// }
			copeFile(path+"\\"+info.Name(), newpath+"\\"+a2+b2+c2+".png")

			// fmt.Println(info.Name())

		}
	}
}

// 层行列加密
func getlrc(lv int, row int, col int) (int, int, int) {
	/* 层行列加密计算 */
	var rad int = (lv * lv * row) ^ col
	var _lv int = lv ^ rad
	var _row int = row ^ rad
	var _col int = col ^ rad
	return _lv, _row, _col
}

// 移动文件
func copeFile(oldLocation, newLocation string) {
	// // 创建文件夹
	// os.MkdirAll("D:\\data\\czgyyq2\\15\\26799", 0777)
	// oldLocation := "D:\\data\\czgyyq1\\15\\26799\\13472.png"
	// newLocation := "D:\\data\\czgyyq2\\15\\26799\\13472.png"
	err := os.Rename(oldLocation, newLocation)
	if err != nil {
		log.Fatal(err)
	}
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
