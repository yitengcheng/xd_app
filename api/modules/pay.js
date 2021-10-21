import request from '../../common/request.js'

const pay = {
	payOrder:(data)=>{
		return request.globalRequest('/direct/pay/app/create', 'post', data);
	},
}


export default pay
