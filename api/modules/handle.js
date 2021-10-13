import request from '../../common/request.js';

const handle = {
	handleRead:(data)=>{
		return request.globalRequest(`/main/handle/view`, 'post', data);
	},
	handles:(data)=>{
		return request.globalRequest(`/main/all`, 'get', data);
	},
}


export default handle