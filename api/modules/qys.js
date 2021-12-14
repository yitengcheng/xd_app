import request from '../../common/request.js'

const qys = {
	send:(data)=>{
		return request.globalRequest(`/qys/send/contract`, 'post', data);
	},
	checkAuth: (name) =>{
		return request.globalRequest(`/qys/complany/auth/result?complanyName=${name}`, 'get');
	},
	getContract: (data)=>{
		return request.globalRequest(`/qys/signurl`, 'post', data);
	},
	lookContract: (data)=>{
		return request.globalRequest(`/qys/view?contractId=${data}`, 'get');
	},
	authComplany: (data)=>{
		return request.globalRequest(`/system/complany/auth/qys?complanyId=${data}`, 'get');
	},
	getQYSAuthPage: (data)=>{
		return request.globalRequest(`/qys/complany/apply/${data}`, 'post');
	},
	payAuthMoney: (data)=>{
		return request.globalRequest(`/direct/pay/native/contract/create`, 'post', data);
	},
	qysLogin: (data)=>{
		return request.globalRequest(`/qys/sso/login`, 'post', data);
	},
	saveContract: (data)=>{
		return request.globalRequest(`/system/complany/conctrat/text`, 'post', data);
	},
	
}


export default qys
