<template>
	<view class="content">
		<uni-forms border v-model="formData" class="form" ref="form">
		    <FormInput :formData="formData" name="userName" label="用户名" :inputBorder="false" :required="false"/>
		    <FormInput :formData="formData" name="password" label="密码" type="password" :inputBorder="false" :required="false"/>
			<button type="primary" class="login" @click="login">登录</button>
			<button type="warn" @click="forgetPassword">忘记密码</button>
		</uni-forms>
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
					this.$refs.form.setValue('userName',res.data);
				}
			});
			uni.getStorage({
				key: 'password',
				success: (res) => {
					this.$refs.form.setValue('password',res.data);
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
			login(){
				this.$refs.form.validate().then((data)=>{
					api.login({
						sginType: 1,
						type: 'app',
						...data,
					}).then((res = {})=>{
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
											url: '/pages/model/InCar/index'
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
				});
			}
		},
		onNavigationBarButtonTap(e){
			uni.navigateTo({
				url: '/pages/model/login/Register'
			})
		}
	}
</script>

<style lang="scss">
	.login_container {
		overflow: hidden;
	}
	.form {
		width: 80%;
		margin-top: 300rpx;
		padding: 0rpx 50rpx;
	}
	.login {
		margin: 30rpx 0rpx;
	}
</style>
