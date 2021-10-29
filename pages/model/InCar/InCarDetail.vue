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
		<button @click="readIdcard" class="readIdcard" type="primary">身份证阅读器</button>
		<view class="info_box">
			<uni-forms ref="form" v-model="formData" :rules="rules">
				<uni-forms-item label="姓名" :name="formData.name" :required="true">
					<Combox :value="formData.name" :candidates="candidates" :isJSON="true" keyName="name" @getValue="getComboxValue" class="form_combox"></Combox>
				</uni-forms-item>
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
	import FormRadio from '../../../components/form/FormRadio.vue';
	import FormInput from '../../../components/form/FormInput.vue';
	import Combox from '../../../components/cuihai-combox/cuihai-combox.vue';
	import {
		card15,
		card18,
		phoneRegex
	} from '../../../common/regex.js';
	export default {
		components: {
			IdCardOcr,
			FormRadio,
			FormInput,
			Combox,
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
				current: 0,
				candidates: []
			};
		},
		onLoad(option) {
			this.dictInit('additional_check').then(() => {
				this.checkList = uni.getStorageSync('additional_check');
			});
			let user = uni.getStorageSync('user');
			api.getUserByComplany(this._.map(user.complany, 'id').join(',')).then((res)=>{
				if((res.data || []).length > 0){
					let { data } = res;
					data.forEach(o => {
						this.candidates.push({
							name: o.name,
							phoneNumber: o.phoneNumber,
							idcard: o.idcard,
							nowAddress: o.nowAddress
						})
					})
				}
			});
			this.getCarInfo(option.id);
		},
		methods: {
			getComboxValue(e){
				this.formData.name = this.candidates[e].name || '';
				this.$refs.form.setValue('idCard', this.candidates[e].idcard || '');
				this.$refs.form.setValue('phone', this.candidates[e].phoneNumber || '');
				this.$refs.form.setValue('nowAddress', this.candidates[e].nowAddress || '');
			},
			readIdcard() {
				if (uni.getSystemInfoSync().platform == "android") {
					uni.openBluetoothAdapter({
						success: () => {
							uni.startBluetoothDevicesDiscovery({
								success: (res) => {
									uni.onBluetoothDeviceFound((e) => {
										let {devices} = e;
										if (devices[0].name.search('ST710') !== -1) {
											uni.showLoading({
												mask: true,
												title: '识别中...'
											});
											uni.stopBluetoothDevicesDiscovery({
												success: () => {
													let device = devices[0];
													if (this._.includes(this._.map(this.carInfo.complany.macInfo, 'macAddress'), device.deviceId)) {
														const idcard = uni.requireNativePlugin('plugin_idcardModule');
														idcard.readIdcard({mac: device.deviceId}, (e) => {
																if (e.data.length <20) {
																	uni.showToast({
																		title: '识别失败，请重新点击识别按钮',
																		icon: 'none',
																	});
																} else {
																	let data = JSON.parse(e.data);
																	this.formData.name = data.姓名;
																	this.$refs.form.setValue('idCard', data.身份证号);
																	this.$refs.form.setValue('nowAddress', data.地址);
																}

															});

													} else {
														uni.showToast({
															title: `未授权设备`,
															icon: 'error',
														})
													}
													uni.hideLoading();
													uni.closeBluetoothAdapter();
												}
											});
										}
									})
								}
							});
						},
						fail: () => {
							uni.showToast({
								title: '蓝牙启动失败',
								icon: 'none'
							})
						}
					});
				} else {
					uni.showToast({
						title: '该功能暂时仅限安卓系统手机使用',
						icon: 'none',
					})
				}
			},
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
						this.formData.name = (res.data.customer || {}).name;
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
					this.formData.name = words_result.姓名.words;
					this.$refs.form.setValue('idCard', words_result.公民身份号码.words);
					this.$refs.form.setValue('nowAddress', words_result.住址.words);
				}
			},
			submit() {
				this.$refs.form.validate().then(data => {
					api.insertUserInfo({
						name: this.formData.name,
						idcard: data.idCard,
						phoneNumber: data.phoneNumber,
						orderId: data.orderId,
						nowAddress: data.nowAddress,
						complanyId: this.carInfo.complanyId,
						orderId: this.carInfo.orderId,
					});
					let checks = [];
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
					api.checkService({
						complanyId: this.carInfo.complany.id,
						money: this._.sum(this._.map(checks, 'value')),
					}).then(res => {
						if(res){
							if(res.data){
								uni.showModal({
									title: `剩余代金券金额${res.msg}元`,
									confirmText:'代金券支付',
									cancelText: '微信全额支付',
									success: (e) => {
										if(e.confirm){
											api.deduct({
												complanyId: this.carInfo.complany.id,
												money: this._.sum(this._.map(checks, 'value')),
											}).then(result => {
												if(result){
													if(typeof this.carInfo.complany.subMchId === 'string'){
														uni.navigateTo({
															url: `/pages/model/InCar/Step?checks=${this._.map(checks, 'text').join(',')}&idCard=${data.idCard}&name=${data.name}&orderId=${this.carInfo.orderId}`
														});
													} else{
														this.payOrder(0, this._.map(checks, 'text').join(','), data);
													}
												}
											});
										} else {
											this.payOrder(this._.sum(this._.map(checks, 'value')),this._.map(checks, 'text').join(','), data);
										}
									}
								});
							} else {
								uni.showModal({
									title: `剩余代金券${res.msg}元不足以支付本次费用${this._.sum(this._.map(checks, 'value'))}元`,
									success: (e) => {
										if(e.confirm){
											this.payOrder(this._.sum(this._.map(checks, 'value')),this._.map(checks, 'text').join(','), data);
										}
									}
								})
							}
						}
					});
				});
			},
			reset() {
				this.formData.name = '';
				this.$refs.form.setValue('idCard', '');
				this.$refs.form.setValue('phone', '');
				this.$refs.form.setValue('nowAddress', '');
			},
			payOrder(serviceInfoMoney, serviceRemark, data){
				api.payOrder({
					serviceInfoMoney,
					openid: this.carInfo.wxOrder.openid,
					wantCarTime: this.carInfo.wxOrder.wantCarTime,
					estimateReturnTime: this.carInfo.wxOrder.estimateReturnTime,
					serviceRemark,
					carId: this.carInfo.id,
					infoOrderId: this.carInfo.orderId,
				}).then((res = {}) => {
					let info = res.data;
					if (info) {
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: info,
							success: () => {
								uni.navigateTo({
									url: `/pages/model/InCar/Step?checks=${serviceRemark}&idCard=${data.idCard}&name=${data.name}&orderId=${this.carInfo.orderId}`
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
				});
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
	
	.readIdcard {
		margin-top: 20rpx;
	}
	
	.form_combox {
		border: 1px solid #c8c7cc;
		padding-left: 5px;
		padding-right: 5px;
		border-radius: 5px;
	}
</style>
