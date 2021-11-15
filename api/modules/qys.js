import request from '../../common/request.js'

const qys = {
	send:(data)=>{
		return request.globalRequest(`/qys/send/contract`, 'post', data);
	},
	checkAuth: (name) =>{
		return request.globalRequest(`/qys/complany/auth/result?complanyName=${name}`, 'get');
	},
}


export default qys
