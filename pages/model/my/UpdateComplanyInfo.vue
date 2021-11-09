<template>
	<view class="content" style="justify-content: space-between;">
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="280" :rules="rules"class="form">
			<FormInput :formData="formData" name="complanyName" label="公司名"/>
			<FormInput :formData="formData" name="creditCode" label="统一社会代码"/>
			<FormInput :formData="formData" name="juridicalName" label="法人姓名"/>
			<FormInput :formData="formData" name="juridicalZjhm" label="法人身份证"/>
			<FormInput :formData="formData" name="phoneNumber" label="联系电话"/>
			<FormInput :formData="formData" name="businessAddress" label="公司经营地址" disable/>
		</uni-forms>
		<view class="bottom_btn">
			<button class="btn" @click="getLatitude">获取公司经营地址</button>
			<button class="btn" type="primary" @click="sumbit">保存</button>
		</view>
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
				complany: uni.getStorageSync('user').complany,
				formData: {
					complanyName: '',
					businessAddress: '',
					creditCode: '',
					latitude: '',
					juridicalName: '',
					juridicalZjhm: '',
					phoneNumber: '',
				},
				rules: {
					complanyName: {
						rules: [{
							required: true,
							errorMessage: '请填写公司名称'
						}]
					},
					businessAddress: {
						rules: [{
							required: true,
							errorMessage: '请填写公司经营地址'
						}]
					},
					creditCode: {
						rules: [{
							required: true,
							errorMessage: '请填写统一社会代码'
						}]
					},
					juridicalName: {
						rules: [{
							required: true,
							errorMessage: '请填写法人姓名'
						}]
					},
					juridicalZjhm: {
						rules: [{
							required: true,
							errorMessage: '请填写法人身份证'
						}]
					},
					phoneNumber: {
						rules: [{
							required: true,
							errorMessage: '请填写联系电话'
						}]
					},
					longitude:'',
					latitude: '',
				}
			};
		},
		mounted() {
			this.initInfo();
			uni.getLocation({
				geocode: true,
				success: (res) => {
					this.longitude = res.longitude;
					this.latitude = res.latitude;
					
				}
			});
		},
		methods:{
			initInfo(){
				let complany = this._.find(this.complany, o => { return o.id === uni.getStorageSync('complanyId')});
				this.$nextTick(() => {
					this.$refs.form.setValue('complanyName', complany.complanyName);
					this.$refs.form.setValue('businessAddress', complany.businessAddress);
					this.$refs.form.setValue('creditCode', complany.creditCode);
					this.$refs.form.setValue('juridicalName', complany.juridicalName);
					this.$refs.form.setValue('juridicalZjhm', complany.juridicalZjhm);
					this.$refs.form.setValue('phoneNumber', complany.phoneNumber);
					this.formData.latitude = complany.latitude;
				});
			},
			getLatitude(){
				uni.chooseLocation({
					latitude: this.latitude,
					longitude: this.longitude,
					success: (res) => {
						this.formData.latitude = `${res.longitude},${res.latitude}`;
						this.$refs.form.setValue('businessAddress', res.address);
					},
				})
			},
			sumbit(){
				this.$refs.form.validate().then(data => {
					api.updateComplany({
						id: uni.getStorageSync('complanyId'),
						...this.formData
					}).then(res => {
						uni.showModal({
							title: '提示',
							content: '信息修改成功',
							showCancel: false,
							success: () => {
								uni.navigateBack();
							}
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.form {
	width: 90%;
}
.bottom_btn {
	display: flex;
	flex-direction: row;
	width: 100%;
}
.btn {
	flex: 1;
}
</style>
