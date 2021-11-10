<template>
	<view class="content">
		<uni-forms ref="form" v-model="formData" :rules="rules" :label-width="100">
			<FormPicker v-show="((user || {}).complany || []).length >= 2" label="公司" name="complanyId" :localdata="complanys" :formData="formData"></FormPicker>
			<FormRadio label="购买/租赁" :localdata="payTypeList" @change="changePay" name="payType" :formData="formData"></FormRadio>
			<FormInput label="台数" name="applyNum" :formData="formData" type="number"></FormInput>
			<FormPicker v-show="payType !== 1" label="租期" name="lease" :localdata="leaseList" :formData="formData"></FormPicker>
			<FormInput label="收货地址" name="address" :formData="formData"></FormInput>
		</uni-forms>
		<button type="primary" class="submitBtn">提交</button>
	</view>
</template>

<script>
	import FormPicker from '../../../components/form/FormPicker.vue';
	import FormInput from '../../../components/form/FormInput.vue';
	import FormRadio from '../../../components/form/FormRadio.vue';
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
					applyNum: 0,
					lease: 0,
					payType: 0,
					address: '',
					productId: 1,
				},
				rules:{},
				leaseList: [
					{value: 0, text: '三个月'},
					{value: 1, text: '六个月'},
					{value: 2, text: '一年'},
					{value: 3, text: '二年'},
				],
				payTypeList: [
					{value: 0, text: '租赁'},
					{value: 1, text: '购买'},
				]
			};
		},
		mounted() {
			this.initComplany();
		},
		methods:{
			changePay(e){
				this.$refs.form.setValue('payType', e.detail.value)
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
					this.$refs.form.setValue('complanyId', uni.getStorageSync('complanyId'));
				}
			},
		}
	}
</script>

<style lang="scss">
.submitBtn {
	width: 60%;
}
</style>
