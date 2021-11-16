<template>
	<view class="content">
		<web-view :src="src" :webview-styles="webviewStyles"></web-view>
		<u-popup v-model="show" mode="bottom">
			<view class="tips_box">
				<view class="tips_title">提示：请核对以下信息是否正确</view>
				<uni-forms ref="form" v-model="formData" :rules="rules" :labelWidth="100" class="form_box">
					<FormInput :formData="formData" name="unitPrice" label="租车单价"/>
					<FormInput :formData="formData" name="rentCarDays" label="租车天数"/>
					<FormInput :formData="formData" name="bondMoney" label="租车保证金"/>
					<FormInput :formData="formData" name="violationBondMoney" label="违章保证金"/>
				</uni-forms>
				<u-button type="primary" class="form_btn" @click="submit">确认</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import FormInput from '../../../components/form/FormInput.vue';
	export default {
		components:{
			FormInput,
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.initOrderDetail(option.orderId);
		},
		data() {
			return {
				src: '',
				orderId: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				rules: {
					unitPrice: {
						rules: [{
							required: true,
							errorMessage: '请填写租车单价'
						}]
					},
					rentCarDays: {
						rules: [{
							required: true,
							errorMessage: '请填写租车天数'
						}]
					},
					bondMoney: {
						rules: [{
							required: true,
							errorMessage: '请填写租车保证金'
						}]
					},
					violationBondMoney: {
						rules: [{
							required: true,
							errorMessage: '请填写违章保证金'
						}]
					},
				},
				formData: {
					unitPrice: '',
					rentCarDays: '',
					bondMoney: '',
					violationBondMoney: '',
				},
				show: false,
			};
		},
		methods:{
			getContract(data){
				api.send({orderId: this.orderId, ...data}).then((res = {}) => {
					if (res.data) {
						this.src = res.data;
						let timer = setInterval(()=>{
							api.orderDetail(option.orderId).then((res = {}) => {
								let { data } = res;
								if (data.signStatus === 1) {
									clearInterval(timer);
									uni.navigateTo({
										url: `/pages/model/InCar/PactQrcode?pactId=${data.contract}&orderId=${option.orderId}`
									})
								}
							})
						}, 3000);
					} else {
						uni.navigateBack()
					}
				});
			},
			initOrderDetail(orderId){
				api.orderDetail(orderId).then(res => {
					if(res?.data?.payStatus === '到店付款'){
						let { data } = res;
						this.formData.bondMoney = data?.car?.bondMoney;
						this.formData.unitPrice = data?.car?.unitPrice;
						this.formData.violationBondMoney = data?.car?.violationBondMoney;
						this.formData.rentCarDays = data?.rentCarDays;
						this.show = true;
					} else {
						this.getContract({});
					}
				});
			},
			submit(){
				this.$refs.form.validate().then(data => {
					this.getContract(this.formData);
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tips_box {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 10px;
	}
	.tips_title {
		font-size: 18px;
		font-weight: 700;
	}
	.form_box {
		width: 80%;
		margin: 10px 0px;
	}
	.form_btn {
		width: 80%;
	}
</style>
