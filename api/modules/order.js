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
	orderDetail: (orderId)=>{
		return request.globalRequest(`/system/wxorder/${orderId}`, 'get');
	},
	insertUserInfo: (data) => {
		return request.globalRequest(`/tool/idcard`, 'post', data);
	}
}


export default order