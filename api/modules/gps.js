import request from '../../common/request.js';

const gps = {
	gpsList:(data)=>{
		return request.globalRequest('/system/operator/listAll', 'get', data);
	},
}


export default gps