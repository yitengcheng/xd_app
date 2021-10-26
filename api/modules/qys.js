import request from '../../common/request.js'

const qys = {
	send:(orderId)=>{
		return request.globalRequest(`/qys/send/contract?orderId=${orderId}`, 'post');
	},
	sign: (orderId) =>{
		return request.globalRequest(`/qys/sign/${orderId}`, 'get');
	}
}


export default qys
