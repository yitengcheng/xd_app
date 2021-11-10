import request from '../../common/request.js'

const product = {
	applyReader:(data)=>{
		return request.globalRequest('/product/pay/goods', 'post', data);
	},
}


export default product