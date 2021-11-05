import request from '../../common/request.js'

const qys = {
	send:(orderId)=>{
		return request.globalRequest(`/qys/send/contract?orderId=${orderId}`, 'post');
	},
	checkAuth: (name) =>{
		return request.globalRequest(`/qys/complany/auth/result?complanyName=${name}`, 'get');
	},
}


export default qys
