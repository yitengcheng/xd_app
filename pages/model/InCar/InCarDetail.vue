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
			<uni-forms ref="form" v-model="formData" :rules="rules" :labelWidth="100">
				<uni-forms-item label="姓名" :name="formData.name" :required="true">
					<Combox :value="formData.name" :candidates="candidates" :isJSON="true" keyName="name"
						@getValue="getComboxValue" class="form_combox"></Combox>
				</uni-forms-item>
				<uni-forms-item label="移交车辆" :name="formData.carId" :required="true">
					<Combox :value="formData.carId" :candidates="carList" :isJSON="true" keyName="text"
						@getValue="getCarValue" class="form_combox"></Combox>
				</uni-forms-item>
				<FormInput :formData="formData" name="idCard" label="身份证号" />
				<FormInput :formData="formData" name="phone" label="手机号" />
				<FormInput :formData="formData" name="nowAddress" label="当前居住地" />
				<FormSwitch :formData="formData" name="preferredUse" label="代金券" @change="changePreferredUse">
				</FormSwitch>
				<FormRadio :required="false" :multiple="true" :formData="formData" name="check" :localdata="checkList"
					label="附加核验" @change="changeCheck" />
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
	import FormPicker from '../../../components/form/FormPicker.vue';
	import FormSwitch from '../../../components/form/FormSwitch.vue';
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
			FormPicker,
			FormSwitch,
		},
		data() {
			return {
				carInfo: {},
				idCardInfo: {},
				carList: [],
				customer: {},
				formData: {
					name: '',
					idCard: '',
					phone: '',
					nowAddress: '',
					check: [],
					carId: '',
					preferredUse: false,
				},
				checkList: [],
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请填写姓名'
						}]
					},
					carId: {
						rules: [{
							required: true,
							errorMessage: '请选择移交车辆'
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
				candidates: [],
				oldCarId: '',
			};
		},
		onLoad(option) {
			this.dictInit('additional_check').then(() => {
				this.checkList = uni.getStorageSync('additional_check');
			});
			let user = uni.getStorageSync('user');
			api.getChangeCarList({
				complanyIds: this._.map(user.complany, 'id').join(',')
			}).then((res) => {
				if (res.data) {
					let { data } = res;
					data.forEach(car => {
						this.carList.push({
							value: car.id,
							text: car.carNum
						});
					})
				}
			});
			api.getUserByComplany(this._.map(user.complany, 'id').join(',')).then((res) => {
				if ((res.data || []).length > 0) {
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
			changeCheck(e) {
				if (this._.includes(this._.map(e.detail.data, 'text'), '电子合同 (1元/次)')) {
					api.checkAuth(this.carInfo.complany.complanyName).then(res => {
						if (res.data === 0) {
							uni.showModal({
								title: '认证提示',
								content: `${res.msg}`,
								showCancel: false,
								success: () => {
									e.detail.value.pop();
									this.formData.check = e.detail.value;
								}
							})
						} else if (res.data === 2) {
							this.formData.check = e.detail.value;
						}
					});
				} else {
					this.formData.check = e.detail.value;
				}
			},
			changePreferredUse(e) {
				this.formData.preferredUse = e
			},
			getComboxValue(e) {
				this.formData.name = this.candidates[e]?.name ?? '';
				this.formData.idCard = this.candidates[e]?.idCard ?? '';
				this.formData.phone = this.candidates[e]?.phone ?? '';
				this.formData.nowAddress = this.candidates[e]?.nowAddress ?? '';
			},
			getCarValue(e) {
				this.formData.carId = this.carList[e]?.text ?? '';
			},
			readIdcard() {
				if (uni.getSystemInfoSync().platform == "android") {
					uni.openBluetoothAdapter({
						success: () => {
							uni.startBluetoothDevicesDiscovery({
								success: (res) => {
									uni.onBluetoothDeviceFound((e) => {
										let {
											devices
										} = e;
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
														idcard.readIdcard({ mac: device.deviceId }, (e) => {
															if (e.data.length < 20) {
																uni.showToast({
																	title: '识别失败，请重新点击识别按钮',
																	icon: 'none',
																});
															} else {
																let data = JSON.parse(e?.data);
																this.formData.name = data?.姓名;
																this.formData.idCard = data?.身份证号;
																this.formData.nowAddress = data?.地址;
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
						this.carList.push({ value: res.data.id, text: res.data.carNum });
						this.customer = res.data.customer ?? {};
						this.formData.name = res.data.customer?.name;
						this.formData.carId = res.data.carNum ?? '';
						this.formData.idCard = res.data.customer?.idcard;
						this.formData.phone = res.data.customer?.phoneNumber;
						this.formData.nowAddress = res.data.customer?.nowAddress;
						this.oldCarId = res.data.id;
						this.carList = this._.uniqBy(this.carList, 'text');
					}
				});
			},
			getIdCard(e = {}) {
				let { url, ocr } = e;
				if (url && !!ocr) {
					api.insertUserInfo({
						name: ocr.name,
						idcard: ocr.idnumber,
						address: ocr.address,
						sex: ocr.gender === '男' ? 0 : 1,
						birthday: ocr.birthday,
						complanyId: this.carInfo.complanyId,
						orderId: this.carInfo.orderId,
					})
					this.formData.name = ocr.name;
					this.formData.idCard = ocr.idnumber;
					this.formData.nowAddress = ocr.address;
				}
			},
			submit() {
				this.$refs.form.validate().then(data => {
					let params = {};
					let currentCar = this._.find(this.carList, o => {
						return o.text === this.formData.carId
					});
					if (currentCar.value !== this.oldCarId) {
						params = {
							newCarId: currentCar.value,
							oldCarId: this.oldCarId
						};
					} else {
						params = {
							newCarId: this.oldCarId,
						};
					}
					
					api.insertUserInfo({
						name: this.formData.name,
						idcard: this.formData.idCard,
						phoneNumber: this.formData.phoneNumber,
						orderId: this.formData.orderId,
						nowAddress: this.formData.nowAddress,
						complanyId: this.carInfo.complanyId,
						orderId: this.carInfo.orderId,
						...params,
					});
					let checks = [];
					this.checkList.forEach(o => {
						this.formData.check.forEach(item => {
							o.value === item && checks.push({
								value: o.value * 1,
								text: o.text
							});
						});
					});
					if (checks.length === 0 && typeof this.carInfo.complany.subMchId === 'string') {
						uni.navigateTo({
							url: `/pages/model/InCar/Step?orderId=${this.carInfo.orderId}&idCard=${this.formData.idCard}&name=${this.formData.name}`
						})
						return;
					}
					if (this.formData.preferredUse) {
						api.checkService({
							complanyId: this.carInfo.complany.id,
							money: this._.sum(this._.map(checks, 'value')),
						}).then(res => {
							if (res) {
								if (res.data) {
									uni.showModal({
										title: `剩余代金券金额${res.msg}元`,
										confirmText: '代金券支付',
										showCancel: false,
										success: (e) => {
											api.deduct({
												complanyId: this.carInfo.complany.id,
												money: this._.sum(this._.map(checks,'value')),
											}).then(result => {
												if (result) {
													if (typeof this.carInfo.complany
														.subMchId === 'string') {
														uni.navigateTo({
															url: `/pages/model/InCar/Step?checks=${this._.map(checks, 'text').join(',')}&idCard=${this.formData.idCard}&name=${this.formData.name}&orderId=${this.carInfo.orderId}`
														});
													} else {
														this.payOrder(0, this._.map(checks, 'text').join(','), this.formData);
													}
												}
											});
										}
									});
								} else {
									uni.showModal({
										title: `剩余代金券${res.msg}元不足以支付本次费用${this._.sum(this._.map(checks, 'value'))}元`,
										success: (e) => {
											if (e.confirm) {
												this.payOrder(this._.sum(this._.map(checks,'value')), this._.map(checks,'text').join(','), this.formData);
											}
										}
									})
								}
							}
						});
					} else {
						this.payOrder(this._.sum(this._.map(checks, 'value')), this._.map(checks, 'text').join(','), this.formData);
					}
				});
			},
			reset() {
				this.formData.name = '';
				this.formData.idCard = '';
				this.formData.phone = '';
				this.formData.nowAddress = '';
			},
			payOrder(serviceInfoMoney, serviceRemark, data) {
				let currentCar = this._.find(this.carList, o => {
					return o.text === this.formData.carId
				});
				api.payOrder({
					serviceInfoMoney,
					openid: this.carInfo.wxOrder.openid,
					wantCarTime: this.carInfo.wxOrder.wantCarTime,
					estimateReturnTime: this.carInfo.wxOrder.estimateReturnTime,
					serviceRemark,
					carId: currentCar.value,
					infoOrderId: this.carInfo.orderId,
				}).then((res = {}) => {
					let info = res.data;
					if (info) {
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: info,
							success: () => {
								uni.navigateTo({
									url: `/pages/model/InCar/Step?checks=${serviceRemark}&idCard=${data.idCard}&name=${this.formData.name}&orderId=${this.carInfo.orderId}`
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
		width: 98%;
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
