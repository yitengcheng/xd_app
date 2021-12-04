import request from '../../common/request.js'

const pay = {
	payOrder:(data)=>{
		return request.globalRequest('/direct/pay/app/create', 'post', data);
	},
	checkService:(data)=>{
		return request.globalRequest(`/direct/pay/service`, 'post', data);
	},
	deduct:(data)=>{
		return request.globalRequest(`/system/complany/deduct`, 'post', data);
	},
	qrCode:(data)=>{
		return request.globalRequest(`/direct/pay/native/create`, 'post', data);
	}
}


export default pay
