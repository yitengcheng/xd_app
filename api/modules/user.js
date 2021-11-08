import request from '../../common/request.js'

const user = {
	login:(data)=>{
		return request.globalRequest('/auth/app/login', 'post', data);
	},
	info:(data)=>{
		return request.globalRequest('/system/user/getInfo', 'get', data);
	},
	register: (data)=>{
		return request.globalRequest('/system/complany/insert', 'post', data);
	},
	resetPassword: (data) => {
		return request.globalRequest('/system/user/resetPwd', 'put', data);
	},
	updateComplany: (data) => {
		return request.globalRequest('/system/complany/app/update', 'put', data);
	},
}


export default user