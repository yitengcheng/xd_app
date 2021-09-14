import request from '../../common/request.js'

const user = {
	login:(data)=>{
		return request.globalRequest('/system/user/api/app/login', 'post', data);
	},
	info:(data)=>{
		return request.globalRequest('/system/user/getInfo', 'get', data);
	},
	register: (data)=>{
		return request.globalRequest('/system/complany/insert', 'post', data);
	},
	resetPassword: (data) => {
		return request.globalRequest('/system/user/resetPwd', 'put', data);
	}
}


export default user