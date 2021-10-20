import request from '../../common/request.js'

const qys = {
	send:(orderId)=>{
		return request.globalRequest(`/qys/send/contract?orderId=${orderId}`, 'post');
	}
}


export default qys
