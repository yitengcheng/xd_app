<template>
	<view class="content" style="justify-content: space-between;">
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="280" :rules="rules"class="form">
			<FormInput :formData="formData" name="complanyName" label="公司名"/>
			<FormInput :formData="formData" name="complanyAddress" label="公司地址"/>
			<FormInput :formData="formData" name="creditCode" label="统一社会代码"/>
			<FormInput :formData="formData" name="juridicalName" label="法人姓名"/>
			<FormInput :formData="formData" name="juridicalZjhm" label="法人身份证"/>
			<FormInput :formData="formData" name="phoneNumber" label="联系电话"/>
		</uni-forms>
		<view class="bottom_btn">
			<button class="btn" @click="getLatitude">重新获取坐标</button>
			<button class="btn" type="primary" @click="sumbit">保存</button>
		</view>
	</view>
</template>

<script>
	import FormInput from '../../../components/form/FormInput.vue';
	export default {
		components:{
			FormInput,
		},
		data() {
			return {
				complany: uni.getStorageSync('user').complany,
				formData: {
					complanyName: '',
					complanyAddress: '',
					creditCode: '',
					latitude: '',
					juridicalName: '',
					juridicalZjhm: '',
					phoneNumber: '',
				},
				rules: {}
			};
		},
		mounted() {
			this.initInfo();
		},
		methods:{
			initInfo(){
				let complany = this._.find(this.complany, o => { return o.id === uni.getStorageSync('complanyId')});
				this.$nextTick(() => {
					this.$refs.form.setValue('complanyName', complany.complanyName);
					this.$refs.form.setValue('complanyAddress', complany.complanyAddress);
					this.$refs.form.setValue('creditCode', complany.creditCode);
					this.$refs.form.setValue('juridicalName', complany.juridicalName);
					this.$refs.form.setValue('juridicalZjhm', complany.juridicalZjhm);
					this.$refs.form.setValue('phoneNumber', complany.phoneNumber);
					this.formData.latitude = complany.latitude;
				});
			},
			getLatitude(){
				uni.getLocation({
					geocode: true,
					success: (res) => {
						this.formData.latitude = `${res.longitude},${res.latitude}`;
						uni.showModal({
							title: '提示',
							content: '公司坐标已重新获取，点击保存即可更新坐标',
							showCancel: false,
						})
					}
				});
			},
			sumbit(){
				this.$refs.form.validate().then(data => {
					console.log(this.formData);
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
