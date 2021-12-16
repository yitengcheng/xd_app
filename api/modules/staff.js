import request from '../../common/request.js'

const staff = {
	getstaffList:(data)=>{
		return request.globalRequest('/system/user/employees', 'get', data);
	},
	deleteStaff:(data)=>{
		return request.globalRequest( `/system/user/${data}`, 'delete');
	},
	addStaff:(data)=>{
		return request.globalRequest( `/system/user/insertEmployees`, 'post', data);
	},
	updateStaff:(data)=>{
		return request.globalRequest( `/system/user/updateEmployees`, 'put', data);
	},
	staffDetail:(data)=>{
		return request.globalRequest( `/system/user/getInfoById/${data}`, 'get');
	},
}


export default staff