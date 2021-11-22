<template>
	<view class="content" style="align-items: center;background-color: #FFFFFF;">
		<view class="page_title">
			<text class="page_title_text">您好，</text>
			<text class="page_title_text">欢迎来到优行小滴</text>
		</view>
		<uni-forms border v-model="formData" class="form" ref="form">
		    <FormInput :formData="formData" name="userName" label="" :inputBorder="false" :required="false" placeholder="请输入手机号"/>
		    <FormInput :formData="formData" name="password" label="" type="password" :inputBorder="false" :required="false" placeholder="请输入密码"/>
		</uni-forms>
		<view class="login_option">
			<!-- <view @click="forgetPassword">忘记密码?</view> -->
			<view @click="register">快速注册</view>
		</view>
		<u-button type="primary" class="login" @click="login">账号登录</u-button>
	</view>
</template>

<script>
	import FormInput from '../../../components/form/FormInput.vue';
	import api from '../../../api/index.js';
	export default {
		components:{
			FormInput,
		},
		data() {
			return {
				formData: {
					userName: '',
					password: '',
				},
				appVersion: '',
			}
		},
		mounted() {
			uni.getStorage({
				key: 'userName',
				success: (res) => {
					this.formData.userName = res?.data;
				}
			});
			uni.getStorage({
				key: 'password',
				success: (res) => {
					this.formData.password = res?.data;
				}
			});
			this.appVersion = plus.runtime.versionCode
		},
		methods: {
			forgetPassword(){
				uni.navigateTo({
					url:'/pages/model/login/ForgetPassword'
				})
			},
			register(e){
				uni.navigateTo({
					url: '/pages/model/login/Register'
				})
			},
			login(){
				this.$refs.form.validate().then((data)=>{
					api.login({
						sginType: 1,
						type: 'app',
						...data,
					}).then((res = {})=>{
						if(process.env.NODE_ENV !== 'development'){
							if (uni.getSystemInfoSync().platform == "android" && this.appVersion * 1 < res.appVersion * 1) {
								uni.showModal({
									content: '当前使用版本过低，请更新',
									showCancel: false,
									success: (e) => {
										if(e.confirm){
											if(uni.getSystemInfoSync().platform == 'android'){
												uni.showLoading({
													mask:true,
													title: '更新中，请稍后'
												})
												uni.downloadFile({
													url: 'http://www.fanzehua.cn/uploads/xd-app.apk',
													success: (downloadResult) => {
														uni.hideLoading();
														plus.runtime.install(downloadResult.tempFilePath, {force: false}, ()=> {
															plus.runtime.restart();
														});
													},
													fail: () => {
														uni.hideLoading();
														uni.showToast({
															title: '更新失败',
															icon: 'error',
														})
													}
												});
											} else if(uni.getSystemInfoSync().platform == 'ios'){
												plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
											}
										}
									}
								});
								return;
							}
						}
						if(res.token){
							uni.setStorage({
								key:'tonken',
								data: res.token,
							});
							uni.setStorage({
								key: 'userName',
								data: data.userName,
							});
							uni.setStorage({
								key: 'password',
								data: data.password,
							});
							api.info(uni.getStorageSync('token')).then((info)=>{
								// 开启websocket
								let complanyId = uni.getStorageSync('complanyId');
								this.$store.dispatch('WEBSOCKET_INIT', complanyId ? complanyId : info.complany[0].id);
								uni.setStorage({
									key:'user',
									data: {user: info.user, complany: info.complany},
									success: () => {
										uni.switchTab({
											url: '/pages/model/car/Car'
										});
									}
								});
								uni.setStorage({
									key: 'complanyId',
									data: complanyId ? complanyId : info.complany[0].id,
								});
							});
						}
					});
				}).catch(err => {
						uni.showModal({
							title: '提示',
							content: '必填项请填写完整',
							showCancel: false,
						})
					});
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	.page_title {
		width: 80%;
		display: flex;
		flex-direction: column;
		margin-top: 122rpx;
		margin-bottom: 60rpx;
	}
	.page_title_text {
		height: 62rpx;
		font-size: 24px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		line-height: 62rpx;
		color: #333333;
	}
	.form {
		width: 80%;
		border-bottom: 1px #eee solid;
	}
	.login_option {
		width: 80%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 19rpx;
		font-size: 12px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #FFD101;
	}
	.login {
		margin-top: 60rpx;
		width: 80%;
	}
</style>
