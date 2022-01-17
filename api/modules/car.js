import request from '../../common/request.js';

const car = {
	carList:(data)=>{
		return request.globalRequest('/system/car/list', 'get', data);
	},
	carInfo:(id)=>{
		return request.globalRequest(`/system/car/api/${id}`, 'get');
	},
	returnCarInfo:(id)=>{
		return request.globalRequest(`/system/car/api/${id}`, 'get');
	},
	addCar:(data)=>{
		return request.globalRequest('/system/car/insert', 'post', data);
	},
	updateCar:(data)=>{
		return request.globalRequest('/system/car/update', 'put', data);
	},
	updateCarStatus:(data)=>{
		return request.globalRequest('/system/car/update/status', 'post', data);
	},
	returnCarAndJoinBlack:(data)=>{
		return request.globalRequest('/system/car/black/return', 'post', data);
	},
	getUserByComplany:(data)=>{
		return request.globalRequest(`/system/customer/findByComplanyId?ids=${data}`, 'get');
	},
	getChangeCarList: (data)=>{
		return request.globalRequest(`/system/car/change/car`, 'post', data);
	},
	stayBackCarList: (data) => {
		return request.globalRequest(`/system/car/leased/list`, 'get', data);
	},
	returnHistoryList: (data) => {
		return request.globalRequest(`/system/car/return/list`, 'get', data);
	},
	waitCarList: (data) => {
		return request.globalRequest(`/system/car/waitcar`, 'post', data);
	},
}


export default car