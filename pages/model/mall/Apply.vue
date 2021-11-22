<template>
	<view class="content" style="align-items: center;">
		<uni-forms ref="form" v-model="formData" :rules="rules" :label-width="100" class="form_box">
			<view class="form_row">
				<view class="form_adorn"></view>
				<view>{{productName}}</view>
			</view>
			<view class="line"></view>
			<FormPicker v-show="((user || {}).complany || []).length >= 2" label="公司" name="complanyId" :localdata="complanys" :formData="formData" :required="false"></FormPicker>
			<FormRadio label="购买/租赁" :localdata="payTypeList" @change="changePay" name="payType" :formData="formData" :required="false"></FormRadio>
			<FormInput label="台数" name="applyNum" :formData="formData" type="number" :required="false"></FormInput>
			<FormPicker v-show="formData.payType !== 0" label="租期" name="lease" :localdata="leaseTermList" :formData="formData" :required="false"></FormPicker>
			<FormInput label="收货地址" name="address" :formData="formData" :required="false"></FormInput>
			<view class="form_price">{{formData.payType === 1 ? `租金：￥${rent} 元/月`: `单价：￥ ${price} 元`}}</view>
			<view class="form_price">{{formData.payType === 1 ? `押金：￥${deposit} 元`: `总计：￥ ${price * formData.applyNum} 元`}}</view>
			<view class="form_price" v-if="formData.payType === 1">总计：{{rent * formData.applyNum * formData.lease * 1 + deposit * 1}} 元</view>
		</uni-forms>
		<view class="bottom_box">
			<u-button class="btn">联系客服</u-button>
			<u-button type="primary" class="btn" @click="apply">提交</u-button>
		</view>
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
				productName: '',
				formData: {
					complanyId: '',
					applyNum: '',
					lease: 3,
					payType: '',
					address: '',
					productId: '',
					flag: 1,
				},
				price: '',
				rent: '',
				deposit: '',
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
		onLoad(option) {
			this.initProduct(option.id);
		},
		methods:{
			changePay(e){
				this.formData.payType = e.detail.value;
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
			initProduct(id){
				api.productById(id).then( res => {
					if(res?.data){
						let { data } = res;
						this.formData.productId = data.id;
						this.formData.payType = data.recommend;
						this.price = data.price;
						this.rent = data.rent;
						this.deposit = data.deposit;
						this.productName = data.title;
					}
				});
			},
			apply(){
				this.$refs.form.validate().then(data => {
					api.applyReader(this.formData).then((res) => {
						if(res?.data){
							console.log(res?.data);
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
				}).catch(err => {
						uni.showModal({
							title: '提示',
							content: '必填项请填写完整',
							showCancel: false,
						})
					});
			},
			priceFormat(){
				if(this.formData.payType === 1){
					return ``
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.form_box {
	width: 90%;
	background-color: #FFFFFF;
	border-radius: 5px;
	padding: 10px;
	margin-top: 10px;
}
.form_row {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 75rpx;
	align-items: center;
}
.form_adorn {
	width: 3px;
	height: 40%;
	background-color: #FFD101;
	margin-right: 10px;
}
.line {
	width: 100%;
	height: 1px;
	background-color: #EEEEEE;
	margin-bottom: 10px;
}
.form_price {
	font-size: 16px;
	width: 100%;
	display: flex;
	flex-direction: row;
}
.bottom_box {
	display: flex;
	flex-direction: row;
	flex: 1;
	width: 100%;
	align-items: flex-end;
}
.btn {
	flex: 1
}
</style>
