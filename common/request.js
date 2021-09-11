import {convertSerialize} from './utils.js'
import config from './config.js';
const request = {}
const headers = {}

request.globalRequest = (url, method, data) => {
	let header = {}
	let token = uni.getStorageSync('tonken');
	header['Authorization'] = 'Bearer ' + token;
	
	//接口公共参数
	const obj = {
		
	}
	let JSONParams = {
		url:`${config.API_URL}${url}` ,
		method: method,
		data: { ...obj,
			...data
		},
		dataType: 'JSON',
		header: header,
	}
	return uni.request(JSONParams).then(res => {
		console.log('response:',res[1].data);
		if (res[1]) {
			//TODO 根据实际后台返回格式修改
			if (res[1].data.code == 200) {
				// #ifdef H5
				return res[1].data;
				// #endif

				// #ifdef MP-WEIXIN
				return JSON.parse(res[1].data);
				// #endif

				// #ifdef APP-PLUS
				return res[1].data;
				// #endif
			} else {
				throw res[1].data;
				
			}
		}
	}).catch(params => {
		console.log('error:',params);
		if(params.msg === '登录状态已过期'){
			uni.showToast({
				title: params.msg,
				icon: 'none'
			});
			uni.redirectTo({
				url: '/pages/model/login/Login',
			});
		}
	})
}

export default request