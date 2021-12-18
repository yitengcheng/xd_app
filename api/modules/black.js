import request from '../../common/request.js';

const black = {
	blackList:(data)=>{
		return request.globalRequest('/system/black/list', 'get', data, true, false);
	},
}


export default black