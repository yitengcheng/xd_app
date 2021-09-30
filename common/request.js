import {
	convertSerialize
} from './utils.js'
import _ from 'lodash';
import config from './config.js';
const request = {}
const headers = {}

request.globalRequest = (url, method, data) => {
	let header = {}
	let token = uni.getStorageSync('tonken');
	header['Authorization'] = 'Bearer ' + token;
	header['content-type'] = 'application/json';

	//接口公共参数
	const obj = {

	}
	let JSONParams = {
		url: `${config.API_URL}${url}`,
		method: method,
		data: {
			...obj,
			...data
		},
		dataType: 'JSON',
		header: header,
		sslVerify: "false",
	}
	// #ifdef APP-PLUS
	console.log('request:', JSONParams);
	// #endif

	return uni.request(JSONParams).then(res => {
		console.log('response:', res.length > 1 ? JSON.parse(res[1].data) : JSON.parse(res));
		if (res[1]) {
			let data = '';
			// #ifdef MP-WEIXIN
			data = JSON.parse(res[1].data);
			//#endif

			// #ifdef H5
			data = res[1].data;
			// #endif

			// #ifdef APP-PLUS
			data = res[1].data;
			// #endif

			//TODO 根据实际后台返回格式修改
			if (data.code == 200) {
				// #ifdef H5
				return data;
				// #endif

				// #ifdef MP-WEIXIN
				return data;
				// #endif

				// #ifdef APP-PLUS
				return data;
				// #endif
			} else {
				throw data;
			}
		}
	}).catch(params => {
		uni.showToast({
			title: params.msg,
			icon: 'none'
		});
		if (params.msg === '登录状态已过期') {
			uni.redirectTo({
				url: '/pages/model/login/Login',
			});
		}
	})
}

export default request
