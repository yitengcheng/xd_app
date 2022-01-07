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
		return request.globalRequest(`/system/user/profile/updatePwd?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`, 'put');
	},
	updateComplany: (data) => {
		return request.globalRequest('/system/complany/app/update', 'put', data);
	},
	getComplanyInfo: (data) => {
		return request.globalRequest(`/system/complany/${data}`, 'get');
	},
	logout: (data) => {
		return request.globalRequest(`/auth/logout`, 'delete');
	},
	
}


export default user