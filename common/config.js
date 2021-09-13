let API_URL = ""
let IMG_URL = ""
//默认路径应与 manifest.json 一致，同时修改
let DEFAULT_API_URL = "http://192.168.0.45:8080";
let DEFAULT_IMG_URL = 'http://116.62.54.239:9000';

if (process.env.NODE_ENV === 'development') {
	// #ifdef H5
	API_URL = DEFAULT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	// #endif

	// #ifdef MP-WEIXIN
	API_URL = DEFAULT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	// #endif

	// #ifdef APP-PLUS
	API_URL = DEFAULT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	// #endif

} else {
	API_URL = DEFAULT_API_URL
	IMG_URL = DEFAULT_IMG_URL
}

export default {
	API_URL,
	IMG_URL,
}