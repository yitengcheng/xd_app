import request from "./request.js";
import _ from 'lodash';

// 普通的 get 请求
const get = (apiUrl) => {
	return request.globalRequest(apiUrl, "get");
};

// 字典缓存
const getDictCache = (apiUrl, type) => {
	return new Promise((resolve, reject) => {
		let result = [];
		uni.getStorage({
			key: type,
			success: (res) => {
				resolve(res);
			},
			fail: () => {
				let request = get(apiUrl).then((res = {}) => {
					if (res.data) {
						_.forEach(res.data, (value) => {
							result.push({
								value: value.dictValue,
								text: value.dictLabel
							});
						});
						uni.setStorageSync(type, result);
						resolve(res);
					} else {
						reject(res);
					}
				});
			}
		});
	});
};

/**
 * 返回请求的函数
 * @param {String} apiUrl
 * @param {Object} options 配置项
 */
const getDict = (apiUrl, type) => {
	return getDictCache(apiUrl, type);
};

export default getDict;
