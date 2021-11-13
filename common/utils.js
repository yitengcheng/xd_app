import config from "./config.js"
/**
 * 拼接对象为请求字符串
 * 对于需要编码的文本（比如说中文）我们要进行编码
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 **/
export function formatGetUri(obj, Object) {
	// const params: Array < string >= []
	const params = []
	Object.keys(obj).forEach((key) => {
		let value = obj[key]
		if (typeof value !== 'undefined' || value !== null) {
			params.push([key, encodeURIComponent(value)].json('='))
		}
	})
	return '?' + params.join('&')
}

//表单序列化
export function convertSerialize(data){
    let list = [];
    Object.keys(data).forEach(ele => {
        list.push(`${ele}=${data[ele]}`)
    })
    return list.join('&');
}

// 整理照片回显格式
export function formattingPhoto(url){
	let result;
	if(url){
		result = {
			name: url?.substring( url?.lastIndexOf( '/' ) +
				1 ),
			extname: url?.substring( url?.lastIndexOf(
				'.' ) + 1 ),
			url: `${config.IMG_URL}${url}`
		};
	}
	return result
}