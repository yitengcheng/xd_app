<template>
	<view>
		<uni-forms ref="form" v-model="formData" :rules="rules" :label-width="100">
			<FormPicker v-show="((user || {}).complany || []).length >= 2" label="公司" name="complanyId" :localdata="complanys"></FormPicker>
			<FormInput label="申领台数" name="applyNum"></FormInput>
			<FormPicker label="租期" name="lease" :localdata="leaseList"></FormPicker>
			<FormInput label="收货地址" name="address"></FormInput>
		</uni-forms>
	</view>
</template>

<script>
	import FormPicker from '../../../components/form/FormPicker.vue';
	import FormInput from '../../../components/form/FormInput.vue';
	export default {
		components:{
			FormPicker,
			FormInput,
		},
		data() {
			return {
				user: uni.getStorageSync('user'),
				complanys: [],
				formData: {
					complanyId: '',
					applyNum: 0,
					lease: 0,
				},
				rules:{},
				leaseList: [
					{value: 0, text: '三个月'},
					{value: 1, text: '六个月'},
					{value: 2, text: '一年'},
				]
			};
		},
		mounted() {
			this.initComplany();
		},
		methods:{
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
					this.$refs.form.setValue('complanyId', complany[0].id);
				}
			},
		}
	}
</script>

<style lang="scss">

</style>
