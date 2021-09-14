import request from '../../common/request.js';

const tool = {
	checkZtryService:(data)=>{
		return request.globalRequest('/tool/license/checkZtryService', 'post', data);
	},
}


export default tool