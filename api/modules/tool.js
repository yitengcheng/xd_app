import request from '../../common/request.js';

const tool = {
	checkZtryService:(id)=>{
		return request.globalRequest(`/tool/license/checkZtryService?idcard=${id}`, 'post');
	},
	checkLicense:(id)=>{
		return request.globalRequest(`/tool/license/gzLicenseQuery?idcard=${id}`, 'post');
	},
	checkFace: (data)=>{
		return request.globalRequest(`/tool/tencent/face`, 'post', data);
	}
}

export default tool