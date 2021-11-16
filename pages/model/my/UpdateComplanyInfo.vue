<template>
	<view class="content" style="justify-content: space-between; align-items: center;background-color: #FFFFFF;">
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="280" :rules="rules"class="form">
			<FormInput :decoration="true" :formData="formData" name="complanyName" label="公司名"/>
			<FormInput :decoration="true" :formData="formData" name="creditCode" label="统一社会代码"/>
			<FormInput :decoration="true" :formData="formData" name="juridicalName" label="法人姓名"/>
			<FormInput :decoration="true" :formData="formData" name="juridicalZjhm" label="法人身份证"/>
			<FormInput :decoration="true" :formData="formData" name="phoneNumber" label="联系电话"/>
			<FormInput :decoration="true" :formData="formData" name="businessAddress" label="公司经营地址" disable/>
		</uni-forms>
		<view class="bottom_btn">
			<u-button class="btn" @click="getLatitude">获取公司经营地址</u-button>
			<u-button class="btn" type="primary" @click="sumbit">保存</u-button>
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
					this.formData.complanyName = complany.complanyName;
					this.formData.businessAddress = complany.businessAddress;
					this.formData.creditCode = complany.creditCode;
					this.formData.juridicalName = complany.juridicalName;
					this.formData.juridicalZjhm = complany.juridicalZjhm;
					this.formData.phoneNumber = complany.phoneNumber;
					this.formData.latitude = complany.latitude;
				});
			},
			getLatitude(){
				uni.chooseLocation({
					latitude: this.latitude,
					longitude: this.longitude,
					success: (res) => {
						this.formData.latitude = `${res.longitude},${res.latitude}`;
						this.formData.businessAddress = res.address;
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

<style lang="scss" scoped>
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
