<template>
	<view class="login_container">
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
				}
			}
		},
		onLoad() {
			this.formData.userName = uni.getStorageSync('userName');
			this.formData.password = uni.getStorageSync('password');
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
						if(res.data){
							uni.setStorage({
								key:'tonken',
								data: res.data.access_token,
							});
							uni.setStorageSync('userName',data.userName);
							uni.setStorageSync('password',data.password);
							api.info(uni.getStorageSync('token')).then((info)=>{
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
