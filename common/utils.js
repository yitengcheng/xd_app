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
export function convertSerialize(data) {
	let list = [];
	Object.keys(data).forEach(ele => {
		list.push(`${ele}=${data[ele]}`)
	})
	return list.join('&');
}

// 整理照片回显格式
export function formattingPhoto(url) {
	let result;
	if (url) {
		result = {
			name: url?.substring(url?.lastIndexOf('/') +
				1),
			extname: url?.substring(url?.lastIndexOf(
				'.') + 1),
			url: `${config.IMG_URL}${url}`
		};
	}
	return result
}

// 阿拉伯数字转中文
export function toChinese(num) {
	let i;
	if (!/^\d*(\.\d*)?$/.test(num)) {
		alert("Number is wrong!");
		return "Number is wrong!";
	}
	const AA = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	const BB = ["", "十", "百", "千", "万", "亿", "点", ""];
	let a = ("" + num).replace(/(^0*)/g, "").split("."),
		k = 0,
		re = "";
	for (i = a[0].length - 1; i >= 0; i--) {
		switch (k) {
			case 0:
				re = BB[7] + re;
				break;
			case 4:
				if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
					re = BB[4] + re;
				break;
			case 8:
				re = BB[5] + re;
				BB[7] = BB[5];
				k = 0;
				break;
		}
		if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
		if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
		k++;
	}
	if (a.length > 1) {
		re += BB[6];
		for (i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
	}
	return re;
};

// 拼接照片地址
export function verbUrl(url){
	return `${config.IMG_URL}${url}`;
}
