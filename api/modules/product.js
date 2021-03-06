import request from '../../common/request.js'

const product = {
	applyReader:(data)=>{
		return request.globalRequest('/product/pay/goods', 'post', data);
	},
	products:(data)=>{// 库存
		return request.globalRequest('/product/goods/list', 'post', data);
	},
	renewalProduct: (data)=>{
		return request.globalRequest('/product/renewal/goods', 'post', data);
	},
	productOrders: (data)=>{
		return request.globalRequest('/product/order/list', 'post', data);
	},
	productList :(data)=>{// 商品列表
		return request.globalRequest('/product/list', 'get', data);
	},
	productById :(id)=>{// 商品列表
		return request.globalRequest(`/product/${id}`, 'get');
	},
}

export default product