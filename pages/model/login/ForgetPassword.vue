<template>
	<view class="content">
		<view class="tips" v-show="codeFlag !== 3">{{tips}}</view>
		<view v-show="codeFlag === 1" class="inputBox">
			<uni-easyinput v-model="phone" placeholder="请输入手机号" :inputBorder="false"></uni-easyinput>
		</view>
		<ValidCode v-show="codeFlag === 2" ref="code" :maxlength="6" :isPwd="false" @finish="getCode" />
		<view v-show="codeFlag === 3" class="new_password_box">
			<uni-easyinput  class="new_password"  v-model="password1" placeholder="请输入新的密码" :inputBorder="false"></uni-easyinput>
			<uni-easyinput class="new_password" v-model="password2" placeholder="请再次输入新的密码" :inputBorder="false"></uni-easyinput>
		</view>
		
		<button v-show="codeFlag !== 2"  type="primary" @click="codeFuc">{{btnText}}</button>
	</view>
</template>

<script>
import ValidCode from '../../../components/p-validCode/validCode.vue';
export default {
	components: {
		ValidCode,
	},
	data() {
		return {
			codeFlag: 1,
			phone: '',
			tips: '请输入账号绑定的手机号码，并点击获取验证码，验证码将发送到您的手机上.',
			btnText: '获取验证码',
			password1: '',
			password2: '',
		};
	},
	methods: {
		getCode(val) {
			console.log(val);
			this.codeFlag = 3;
		},
		getPhone(val){
			console.log(val);
		},
		codeFuc(){
			switch(this.codeFlag){
				case 1:
					this.codeFlag = 2;
					let reg = /1(\d{2})\d{4}(\d{4})/g;
					this.tips = `验证码已发送至${this.phone.replace(reg,"1$1****$2")},请在下方输入框内输入6位数字验证码`;
					this.btnText = '设置密码'
					break;
				case 3:
					uni.redirectTo({
						url: '/pages/model/login/Login',
					});
					break;
			}
		}
	}
};
</script>

<style lang="scss">
	.tips {
		padding: 0px 80rpx;
		line-height: 50px;
		margin-top: 150rpx;
		margin-bottom: 100rpx;
	}
	.inputBox {
		border-bottom: 1px solid #888888;
		margin-bottom: 50rpx;
		width: 80%;
	}
	.new_password_box {
		width: 80%;
		margin-top: 300rpx;
		margin-bottom: 80rpx;
	}
	.new_password {
		border-bottom: 1px solid #888888;
	}
</style>
