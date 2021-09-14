<template>
	<uni-forms ref="form" v-model="formData">
		<FormInput label="原始密码" :formData="formData" name="oldPassword" type="password"/>
		<FormInput label="新密码" :formData="formData" name="newPassword1" type="password"/>
		<FormInput label="新密码" :formData="formData" name="newPassword2" placeholder="请再次输入新密码" type="password"/>
		<button type="primary" class="btn" @click="submit">提交</button>
		<button type="warn" class="btn" @click="reset">重置</button>
	</uni-forms>
</template>

<script>
	import FormInput from '../../../components/form/FormInput.vue';
	import api from '../../../api/index.js';
	export default {
		components: {
			FormInput,
		},
		data() {
			return {
				rules:{
					oldPassword: {rules: [{ required: true, errorMessage: '请输入原始密码' }]},
					newPassword1: {rules: [{ required: true, errorMessage: '请输入新密码' }]},
					newPassword2: {rules: [{ required: true, errorMessage: '请再次输入新密码' }]},
				},
				formData: {
					oldPassword: '',
					newPassword1: '',
					newPassword2: '',
				}
			};
		},
		methods:{
			reset(){
				this.$refs.form.resetFields();
			},
			submit(){
				this.$refs.form.validate().then(data => {
					let currentPassword = uni.getStorageSync('password');
					let user = uni.getStorageSync('user');
					if(currentPassword !== data.oldPassword){
						uni.showToast({
							title: '原始密码输入错误',
							icon:'none'
						});
						return;
					}
					if(data.newPassword1 !== data.newPassword2){
						uni.showToast({
							title: '新密码两次输入不同',
							icon:'none'
						});
						return;
					}
					api.resetPassword({
						newPassword: data.newPassword1,
						userId: user.user.userId,
					}).then(res => {
						if(!!res.msg){
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
						}
						uni.redirectTo({
							url:'/pages/model/login/Login',
						})
					}).catch(error => {
						uni.showToast({
							title: error.msg,
							icon:'none'
						})
					});
				});
			}
		}
	}
</script>

<style lang="scss">
.btn {
	width: 60%;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
}
</style>
