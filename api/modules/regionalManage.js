import request from '../../common/request.js';

const regionalManage = {
	regionalListArea:(data)=>{
		return request.globalRequest('/system/region/lazy', 'get', data);
	},
}


export default regionalManage