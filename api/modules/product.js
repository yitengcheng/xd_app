import request from '../../common/request.js'

const product = {
	applyReader:(data)=>{
		return request.globalRequest('/product/pay/goods', 'post', data);
	},
	products:(data)=>{
		return request.globalRequest('/product/goods/list', 'post', data);
	},
	renewalProduct: (data)=>{
		return request.globalRequest('/product/renewal/goods', 'post', data);
	},
	productOrders: (data)=>{
		return request.globalRequest('/product/order/list', 'post', data);
	},
}


export default product