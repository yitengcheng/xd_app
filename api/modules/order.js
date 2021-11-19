import request from '../../common/request.js';

const order = {
	orderConfirm:(data)=>{
		return request.globalRequest(`/system/wxorder/comfir`, 'post', data);
	},
	orderCannel: (data)=>{
		return request.globalRequest(`/system/wxorder/cancel`, 'post', data);
	},
	orderComfirRefund: (data)=>{
		return request.globalRequest(`/system/wxorder/comfirRefund`, 'post', data);
	},
	orders: (data)=>{
		return request.globalRequest(`/system/wxorder/list`, 'get', data);
	},
	orderDetail: (orderId, showloading)=>{
		return request.globalRequest(`/system/wxorder/${orderId}`, 'get', {}, showloading);
	},
	insertUserInfo: (data) => {
		return request.globalRequest(`/tool/idcard`, 'post', data);
	},
	reletCar: (data) => {
		return request.globalRequest(`/system/wxorder/renewal`, 'post', data);
	},
	finishCar: (data) => {
		return request.globalRequest(`/system/wxorder/uploadContract`, 'post', data);
	},
	newOrders: (data) => {
		return request.globalRequest(`/main/app/order`, 'post', data);
	},
	
}


export default order