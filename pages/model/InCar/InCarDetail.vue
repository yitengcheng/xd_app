<template>
	<view class="content">
		<swiper class="swiper_box" @change="change">
			<swiper-item v-for="(item, index) in carInfo.carPhotos" :key="index">
				<image :src="item" class="swiper_img" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="info_box">
			<text>车辆信息</text>
			<text>车辆品牌：{{ carInfo.carBrand || '无' }}</text>
			<text>车牌号：{{ carInfo.carNum || '无' }}</text>
			<text>车牌颜色：{{ carInfo.color || '无' }}</text>
			<text>车主姓名：{{ carInfo.name || '无' }}</text>
			<text>车主联系方式：{{ carInfo.phoneNum || '无' }}</text>
			<text>租车单价：{{ carInfo.unitPrice || '无' }} 元/天</text>
			<text>超过里程收取金额：{{ carInfo.maxMileagePrice || '无' }} 每日</text>
			<text>预约租车时间：{{ (carInfo.wxOrder || {}).wantCarTime || '无' }}至{{ (carInfo.wxOrder || {}).estimateReturnTime || '无' }}</text>
		</view>
		<view class="info_box">
			<text>下单人信息</text>
			<text>姓名：{{ customer.name || '无' }}</text>
			<text>身份证号：{{ customer.idcard || '无' }}</text>
			<text>手机号：{{ customer.phoneNumber || '无' }}</text>
		</view>
		<IdCardOcr @click="getIdCard" type="primary" />
		<view class="info_box">
			<uni-forms ref="form" v-model="formData" :rules="rules">
				<FormInput :formData="formData" name="name" label="姓名" />
				<FormInput :formData="formData" name="idCard" label="身份证号" />
				<FormInput :formData="formData" name="phone" label="手机号" />
				<FormInput :formData="formData" name="nowAddress" label="当前居住地" />
				<FormRadio :required="false" :multiple="true" :formData="formData" name="check" :localdata="checkList"
					label="附加核验" @change="e => $refs.form.setValue('check', e.detail.value)" />
				<button type="primary" class="btn" @click="submit">提交</button>
				<button type="warn" class="btn" @click="reset">重置</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	import IdCardOcr from '../../../components/ocr/IdCardOcr.vue';
	import FormInput from '../../../components/form/FormInput.vue';
	import FormRadio from '../../../components/form/FormRadio.vue';
	import {
		card15,
		card18,
		phoneRegex
	} from '../../../common/regex.js';
	export default {
		components: {
			IdCardOcr,
			FormInput,
			FormRadio
		},
		data() {
			return {
				carInfo: {},
				idCardInfo: {},
				customer: {},
				formData: {
					name: '',
					idCard: '',
					phone: '',
					nowAddress: '',
					check: []
				},
				checkList: [],
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请填写姓名'
						}]
					},
					nowAddress: {
						rules: [{
							required: true,
							errorMessage: '请填写当前居住地'
						}]
					},
					idCard: {
						rules: [{
								required: true,
								errorMessage: '请填写身份证号'
							},
							{
								validateFunction: (rule, value, data, callback) => {
									let card18 = new RegExp(card18);
									let card15 = new RegExp(card15);
									if (value.length !== 15 && value.length !== 18) {
										callback('身份证长度有误');
									}
									if (value.length === 15 && !card15.test(value)) {
										callback('请输入正确的身份证');
									} else if (value.length === 18 && !card18.test(value)) {
										callback('请输入正确的身份证');
									}
									return true;
								}
							}
						]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '请填写手机号'
						}, {
							pattern: phoneRegex,
							errorMessage: '请输入正确的电话号码'
						}]
					}
				},
				current: 0
			};
		},
		onLoad(option) {
			this.dictInit('additional_check').then(() => {
				this.checkList = uni.getStorageSync('additional_check');
			});
			this.getCarInfo(option.id);
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			},
			getCarInfo(id) {
				api.returnCarInfo(id).then((res = {}) => {
					if (res.data) {
						let tmp = [];
						res.data.carPhotos.split(',').forEach(o => {
							tmp.push(`${config.IMG_URL}${o}`);
						});
						delete res.data.carPhotos;
						this.carInfo = {
							carPhotos: tmp,
							...res.data
						};
						this.customer = res.data.customer || {};
						this.$refs.form.setValue('name', (res.data.customer || {}).name);
						this.$refs.form.setValue('idCard', (res.data.customer || {}).idcard);
						this.$refs.form.setValue('phone', (res.data.customer || {}).phoneNumber);
						this.$refs.form.setValue('nowAddress', (res.data.customer || {}).nowAddress);
					}
				});
			},
			getIdCard(e = {}) {
				let {
					url
				} = e;
				let {
					words_result
				} = e.ocr;
				if (url && !!words_result) {
					api.insertUserInfo({
						name: words_result.姓名.words,
						idcard: words_result.公民身份号码.words,
						address: words_result.住址.words,
						sex: words_result.性别.words === '男' ? 1 : 0,
						birthday: words_result.出生.words,
						complanyId: this.carInfo.complanyId,
						orderId: this.carInfo.orderId,
					})
					this.$refs.form.setValue('name', words_result.姓名.words);
					this.$refs.form.setValue('idCard', words_result.公民身份号码.words);
					this.$refs.form.setValue('nowAddress', words_result.住址.words);
				}
			},
			submit() {
				this.$refs.form.validate().then(data => {
					api.insertUserInfo({
						name: data.name,
						idcard: data.idCard,
						phoneNumber: data.phoneNumber,
						orderId: data.orderId, 
						nowAddress: data.nowAddress,
						complanyId: this.carInfo.complanyId,
						orderId: this.carInfo.orderId,
					});
					let checks = [];
					console.log(this.checkList);
					console.log(data.check);
					this.checkList.forEach(o => {
						data.check.forEach(item => {
							o.value === item && checks.push({
								value: o.value * 1,
								text: o.text
							});
						});
					});
					if (checks.length === 0 && typeof this.carInfo.complany.subMchId === 'string') {
						uni.navigateTo({
							url: `/pages/model/InCar/Step?orderId=${this.carInfo.orderId}&idCard=${data.idCard}&name=${data.name}`
						})
						return;
					}
					if (this.carInfo.complany.serviceInfoNum > 0 && typeof this.carInfo.complany.subMchId === 'string') {
						uni.showModal({
							title: `剩余免费核验次数${this.carInfo.complany.serviceInfoNum}次`,
							icon: 'none',
							success: (e) => {
								if(e.confirm){
									api.freeCheck({
										complanyId: this.carInfo.complanyId,
									}).then((res = {}) => {
										if (res) {
											uni.navigateTo({
												url: `/pages/model/InCar/Step?checks=${this._.map(checks, 'text').join(',')}&idCard=${data.idCard}&name=${data.name}&orderId=${this.carInfo.orderId}&macAddress=${this._.map(this.carInfo.complany.macInfo, 'macAddress')}`
											});
										}
									})
								}
							}
						})
						return;
					}
					api.payOrder({
						serviceInfoMoney: this._.sum(this._.map(checks, 'value')),
						openid: this.carInfo.wxOrder.openid,
						wantCarTime: this.carInfo.wxOrder.wantCarTime,
						estimateReturnTime: this.carInfo.wxOrder.estimateReturnTime,
						serviceRemark: this._.map(checks, 'text').join(','),
						carId: this.carInfo.id,
						orderId: this.carInfo.orderId,
						infoOrderId: this.carInfo.orderId,
					}).then((res = {}) => {
						let info = res.data;
						if (info) {
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: info,
								success: () => {
									uni.navigateTo({
										url: `/pages/model/InCar/Step?checks=${this._.map(checks, 'text').join(',')}&idCard=${data.idCard}&name=${data.name}&orderId=${this.carInfo.orderId}&macAddress=${this._.map(this.carInfo.complany.macInfo, 'macAddress')}`
									});
								},
								fail: (error) => {
									uni.showModal({
										title: error.errMsg,
										icon: 'none',
									});
								}
							});
						}
					})
				});
			},
			reset() {
				this.$refs.form.reset();
			}
		}
	};
</script>

<style lang="scss">
	.swiper_box {
		width: 100%;
		height: 300rpx;
	}

	.swiper_img {
		width: 100%;
		height: 300rpx;
	}

	.info_box {
		width: 90%;
		display: flex;
		flex-direction: column;
		padding-top: 10px;
	}

	.btn {
		margin-bottom: 10px;
	}
</style>
