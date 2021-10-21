import request from '../../common/request.js';

const regionalManage = {
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
		return request.globalRequest('/system/car/update/status', 'put', data);
	},
}


export default regionalManage