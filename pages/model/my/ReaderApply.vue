<template>
	<view class="content" style="align-items: center;">
		<uni-forms ref="form" v-model="formData" :rules="rules" :label-width="100" class="form_box">
			<FormPicker v-show="((user || {}).complany || []).length >= 2" label="公司" name="complanyId" :localdata="complanys" :formData="formData"></FormPicker>
			<FormRadio label="购买/租赁" :localdata="payTypeList" @change="changePay" name="payType" :formData="formData" :required="false"></FormRadio>
			<FormInput label="台数" name="applyNum" :formData="formData" type="number"></FormInput>
			<FormPicker v-show="payType !== 0" label="租期" name="leaseTerm" :localdata="leaseTermList" :formData="formData"></FormPicker>
			<FormInput label="收货地址" name="address" :formData="formData"></FormInput>
		</uni-forms>
		<button type="primary" class="submitBtn" @click="apply">提交</button>
	</view>
</template>

<script>
	import FormPicker from '../../../components/form/FormPicker.vue';
	import FormInput from '../../../components/form/FormInput.vue';
	import FormRadio from '../../../components/form/FormRadio.vue';
	import { integerRegex } from '../../../common/regex.js';
	import api from '../../../api/index.js';
	export default {
		components:{
			FormPicker,
			FormInput,
			FormRadio,
		},
		data() {
			return {
				user: uni.getStorageSync('user'),
				complanys: [],
				payType: '',
				formData: {
					complanyId: '',
					applyNum: '',
					leaseTerm: 3,
					payType: 1,
					address: '',
					productId: 1,
					flag: 1,
				},
				rules:{
					complanyId: {
						rules: [{
							required: true,
							errorMessage: '请选择公司'
						}]
					},
					applyNum: {
						rules: [{
							required: true,
							errorMessage: '请输入台数'
						},{ 
							pattern: integerRegex, 
							errorMessage: '请输入正确的台数' ,
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '请输入收货地址'
						}]
					},
				},
				leaseTermList: [
					{value: 3, text: '三个月'},
					{value: 6, text: '六个月'},
					{value: 12, text: '一年'},
					{value: 24, text: '二年'},
				],
				payTypeList: [
					{value: 1, text: '租赁'},
					{value: 0, text: '购买'},
				]
			};
		},
		mounted() {
			this.initComplany();
		},
		methods:{
			changePay(e){
				this.formData.payType = e.detail.value;
				this.payType = e.detail.value;
			},
			initComplany() {
				let { complany } = this.user;
				if(complany){
					this.complany = complany[0];
					complany.forEach(o => {
						this.complanys.push({
							text: o.complanyName,
							value: o.id,
						});
					});
					this.formData.complanyId = uni.getStorageSync('complanyId');
				}
			},
			apply(){
				this.$refs.form.validate().then(data => {
					api.applyReader(this.formData).then((res) => {
						if(res.data){
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: res.data,
								success: () => {
									uni.showModal({
										title: '提示',
										content: '预定成功',
										showCancel: false,
										success: (e) => {
											if(e.confirm){
												uni.navigateBack();
											}
										}
									})
								},
								fail: (error) => {
									uni.showModal({
										title: error.errMsg,
										icon: 'none',
									});
								}
							});
						}
					});
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.submitBtn {
	width: 60%;
}
.form_box {
	width: 90%;
}
</style>
