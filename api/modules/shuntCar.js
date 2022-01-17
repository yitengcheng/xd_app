import request from '../../common/request.js';

const shuntCar = {
	verbCar: (data) => {
		return request.globalRequest(`/system/car/upper/${data.id}/${data.price}`, 'post');
	},
	shuntCarList: (data) => {
		return request.globalRequest(`/system/shunt/list`, 'post', data);
	},
	shuntCarDetail: (data) => {
		return request.globalRequest(`/system/shunt/info/${data}`, 'get');
	},
	applyShuntCar: (data) => {
		return request.globalRequest(`/system/shunt/apply`, 'post', data);
	},
	comments:(data)=>{
		return request.globalRequest('/system/shunt/evaluates', 'post', data);
	},
	applyList: (data) => {
		return request.globalRequest('/system/shunt/apply/list', 'post', data);
	},
	meApplyList: (data) => {
		return request.globalRequest('/system/shunt/apply/me/list', 'post', data);
	},
	applyDetail:(data) => {
		return request.globalRequest(`/system/shunt/${data}`, 'get');
	},
	handleShunt:(data) => {
		return request.globalRequest(`/system/shunt/handle`, 'post', data);
	},
	returnShuntCar:(data) => {
		return request.globalRequest(`/system/shunt/retrun`, 'post', data);
	},
	cancelShunt: (data) => {
		return request.globalRequest(`/system/shunt/delete/${data}`, 'delete', );
	},
}


export default shuntCar