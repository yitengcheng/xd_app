import request from '../../common/request.js'

const customer = {
	getCustomerList:(data)=>{
		return request.globalRequest('/system/customer/list', 'get', data);
	},
	deleteCustomer:(data)=>{
		return request.globalRequest( `/system/customer/del/${data}`, 'delete');
	},
	addCustomer:(data)=>{
		return request.globalRequest( `/system/customer/insert`, 'post', data);
	},
	updateCustomer:(data)=>{
		return request.globalRequest( `/system/customer/update`, 'put', data);
	},
	customerDetail:(data)=>{
		return request.globalRequest( `/system/customer/${data}`, 'get');
	},
}


export default customer