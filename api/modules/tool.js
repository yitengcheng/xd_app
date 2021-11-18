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
	},
	checkDeadbeat: (data)=>{
		return request.globalRequest(`/tool/tencent/blacklist`, 'post', data);
	},
	checkBlack: (data)=>{
		return request.globalRequest(`/system/black/check`, 'post', data);
	},
	checkIllegal: (data)=>{
		return request.globalRequest(`/tool/license/violation`, 'post', data);
	},
	checkLease: (data)=>{
		return request.globalRequest(`/system/car/check/lease`, 'post', data);
	},
}

export default tool