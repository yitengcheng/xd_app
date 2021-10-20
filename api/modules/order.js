import request from '../../common/request.js';

const order = {
	orderConfirm:(orderId)=>{
		return request.globalRequest(`/system/wxorder/comfir?orderId=${orderId}`, 'post');
	},
	orderCannel: (orderId)=>{
		return request.globalRequest(`/system/wxorder/cancel?orderId=${orderId}`, 'post');
	},
	orderComfirRefund: (orderId)=>{
		return request.globalRequest(`/system/wxorder/comfirRefund?orderId=${orderId}`, 'post');
	},
	orders: (data)=>{
		return request.globalRequest(`/system/wxorder/list`, 'get', data);
	},
	orderDetail: (orderId)=>{
		return request.globalRequest(`/system/wxorder/${orderId}`, 'get');
	},
}


export default order