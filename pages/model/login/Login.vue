<template>
	<view class="login_container">
		<uni-forms border v-model="formData" class="form" ref="form">
		    <FormInput :formData="formData" name="userName" label="用户名" :inputBorder="false" :required="false"/>
		    <FormInput :formData="formData" name="password" label="密码" type="password" :inputBorder="false" :required="false"/>
			<button type="primary" class="login" @click="login">登录</button>
			<!-- <button type="primary" class="login" @click="test">测试</button> -->
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
				}
			}
		},
		onLoad() {
			this.formData.userName = uni.getStorageSync('userName');
			this.formData.password = uni.getStorageSync('password');
		},
		methods: {
			// test(){
			// 	uni.openBluetoothAdapter({
			// 		success: () => {
			// 			uni.startBluetoothDevicesDiscovery({
			// 				success: (res) => {
			// 					uni.onBluetoothDeviceFound((e)=>{
			// 						let { devices } = e;
			// 						if(devices[0].name.search('ST710') != -1){
			// 							uni.showLoading({
			// 								mask:true,
			// 								title: '识别中...'
			// 							});
			// 							uni.stopBluetoothDevicesDiscovery({
			// 								success: (res)=> {
			// 									let device = devices[0];
			// 									if (this._.includes(['88:1B:99:15:C0:50'],device.deviceId)) {
													
			// 										const idcard = uni.requireNativePlugin('plugin_idcardModule');
			// 										idcard.readIdcard({
			// 											mac: device.deviceId
			// 										}, (e) => {
			// 											console.log(JSON.parse(e.data));
			// 										});
			// 									} else {
			// 										uni.showToast({
			// 											title: `${device.deviceId}不属于本公司授权设备`,
			// 											icon: 'none',
			// 										})
			// 									}
			// 									uni.hideLoading();
			// 									uni.closeBluetoothAdapter();
			// 								}
			// 							});
			// 						}
			// 					})
			// 				},
			// 			});
			// 		},
			// 		fail: () => {
			// 			uni.showToast({
			// 				title: '蓝牙启动失败',
			// 				icon: 'none'
			// 			})
			// 		}
			// 	});
			// },
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
						if(res.token){
							uni.setStorage({
								key:'tonken',
								data: res.token,
							});
							uni.setStorageSync('userName',data.userName);
							uni.setStorageSync('password',data.password);
							api.info(uni.getStorageSync('token')).then((info)=>{
								// 开启websocket
								info.complany.forEach(o => {
									this.$store.dispatch('WEBSOCKET_INIT', o.id);
								});
								uni.setStorage({
									key:'user',
									data: {user: info.user, complany: info.complany},
									success: () => {
										uni.switchTab({
											url: '/pages/model/InCar/index'
										});
									}
								})
							}).catch((err)=>{
								console.log(err)
							});
						}
					}).catch((err)=>{
						console.log(err)
					});
				}).catch((error)=>{
					console.log(error);
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
		margin-top: 300rpx;
		padding: 0rpx 50rpx;
	}
	.login {
		margin: 30rpx 0rpx;
	}
</style>
