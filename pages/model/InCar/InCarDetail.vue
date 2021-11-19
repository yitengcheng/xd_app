<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box" @change="change">
			<swiper-item v-for="(item, index) in (carInfo || {}).carPhotos" :key="index">
				<image :src="item" class="swiper_img" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>车辆信息</text>
			</view>
			<view class="line"></view>
			<text>【车辆品牌】{{ carInfo.carBrand || '无' }}</text>
			<text>【车牌号】{{ carInfo.carNum || '无' }}</text>
			<text>【车牌颜色】{{ carInfo.color || '无' }}</text>
			<text>【租车单价】{{ carInfo.unitPrice || '无' }} 元/天</text>
			<text>【租车保证金】{{ carInfo.bondMoney || '无' }} 元</text>
			<text>【违章保证金】{{ carInfo.violationBondMoney || '无' }} 元</text>
			<text>【预约租车时间】{{dayjs((carInfo.wxOrder || {}).wantCarTime).format('YYYY-MM-DD')}}至{{dayjs((carInfo.wxOrder || {}).estimateReturnTime).format('YYYY-MM-DD')}}</text>
			<text>【租车天数】{{ ((carInfo || {}).wxOrder || {}).rentCarDays }} 天</text>
			<uni-forms ref="formOrder" v-model="formOrderData" :rules="orderRules" :labelWidth="100" class="form_box">
				<FormInput :formData="formOrderData" name="unitPrice" label="租车单价" decoration/>
				<FormInput :formData="formOrderData" name="rentCarDays" label="租车天数" decoration/>
				<FormInput :formData="formOrderData" name="bondMoney" label="租车保证金" decoration/>
				<FormInput :formData="formOrderData" name="violationBondMoney" label="违章保证金" decoration/>
			</uni-forms>
			<view v-if="formOrderData.unitPrice * 1 - carInfo.unitPrice * 1 !== 0" >【优惠】{{ formOrderData.unitPrice * 1 - carInfo.unitPrice * 1 > 0 ? `增加${formOrderData.unitPrice * 1 - carInfo.unitPrice * 1}元` : `减少${carInfo.unitPrice * 1 - formOrderData.unitPrice * 1}元`}}</view>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>下单人信息</text>
			</view>
			<view class="line"></view>
			<text>【姓名】{{ customer.name || '无' }}</text>
			<text>【身份证号】{{ customer.idcard || '无' }}</text>
			<text>【手机号】{{ customer.phoneNumber || '无' }}</text>
		</view>
		<button ></button>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>承租人信息</text>
			</view>
			<view class="line"></view>
			<uni-forms ref="form" v-model="formData" :rules="rules" :labelWidth="100">
				<u-button @click="readIdcard" class="readIdcard" type="primary">身份证阅读器</u-button>
				<FormUpload :formData="formData" name="idcardFront" label="身份证" :limit="1" @getOcrData="getIdCard" url="/tool/ocr/idcard?type=2"></FormUpload>
				<FormUpload :formData="formData" name="licenseMainUrl" label="驾照主页" :limit="1" @getOcrData="getLicenseMain" url="/tool/ocr/driving?type=8"></FormUpload>
				<FormUpload :formData="formData" name="licenseViceUrl" label="驾照副页" :limit="1" @getOcrData="getLicenseVice" url="/tool/ocr/driving?type=9"></FormUpload>
				<FormUpload ref="photoScan" :formData="formData" name="photoScan" label="现场照片" :limit="3" :required="false"></FormUpload>
				<uni-forms-item label="姓名" :name="formData.name" :required="true" decoration>
					<Combox :value="formData.name" :candidates="candidates" :isJSON="true" keyName="name"
						@getValue="getComboxValue" class="form_combox"></Combox>
				</uni-forms-item>
				<uni-forms-item label="移交车辆" :name="formData.carId" :required="true" decoration>
					<Combox :value="formData.carId" :candidates="carList" :isJSON="true" keyName="text"
						@getValue="getCarValue" class="form_combox"></Combox>
				</uni-forms-item>
				<FormInput :formData="formData" name="idcard" label="身份证号" decoration/>
				<FormInput :formData="formData" name="archivesNum" label="档案编号" decoration/>
				<FormPicker :formData="formData" name="sex" label="性别" :localdata="sexList" decoration/>
				<FormInput :formData="formData" name="phone" label="手机号" decoration/>
				<FormInput :formData="formData" name="nowAddress" label="当前居住地" decoration/>
				<FormInput :formData="formData" name="urgentConcat" label="紧急联系人" :required="false" decoration/>
				<FormSwitch :formData="formData" name="preferredUse" label="代金券" @change="changePreferredUse" :required="false" decoration/>
				<FormRadio :required="false" :multiple="true" :formData="formData" name="check" :localdata="checkList"
					label="附加核验" @change="changeCheck" decoration/>
			</uni-forms>
		</view>
		<u-button type="primary" class="btn" @click="submit">提交</u-button>
		<u-button class="btn" @click="reset">重置</u-button>
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
	import FormUpload from '../../../components/form/FormUpload.vue';
	import { formattingPhoto } from '../../../common/utils.js';
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
			FormUpload,
		},
		data() {
			return {
				carInfo: {},
				idCardInfo: {},
				carList: [],
				customer: {},
				formData: {
					name: '',
					idcard: '',
					phone: '',
					nowAddress: '',
					check: [],
					carId: '',
					preferredUse: false,
					idcardFront: [],
					licenseMainUrl: [],
					licenseViceUrl: [],
					urgentConcat: '',
					sex: '',
					photoScan: [],
					birthday: '',
					archivesNum: '',
					
				},
				customerId: '',
				checkList: [],
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请填写姓名'
						}]
					},
					idcardFront: {
						rules: [{
							validateFunction: (rule, value, data, callback) => {
								if (!value?.[0]) {
									callback('请上传身份证');
								}
								return true;
							}
						}]
					},
					licenseMainUrl: {
						rules: [{
							validateFunction: (rule, value, data, callback) => {
								if (!value?.[0]) {
									callback('请上传驾照主页');
								}
								return true;
							}
						}]
					},
					licenseViceUrl: {
						rules: [{
							validateFunction: (rule, value, data, callback) => {
								if (!value?.[0]) {
									callback('请上传驾照副页');
								}
								return true;
							}
						}]
					},
					archivesNum: {
						rules: [{
							required: true,
							errorMessage: '请填写档案编号'
						}]
					},
					sex: {
						rules: [{
							required: true,
							errorMessage: '请选择性别'
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
					idcard: {
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
					},
				},
				current: 0,
				candidates: [],
				oldCarId: '',
				idcardFront: '',
				licenseMainUrl: '',
				licenseViceUrl: '',
				sexList: [
					{value: 0, text: '男'},
					{value: 1, text: '女'},
				],
				formOrderData: {
					unitPrice: '',
					rentCarDays: '',
					bondMoney: '',
					violationBondMoney: '',
				},
				orderRules: {
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
				this.candidates = res?.data ?? [];
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
				this.customerId = this.candidates[e]?.id;
				this.formData.name = this.candidates[e]?.name ?? '';
				this.formData.idcard = this.candidates[e]?.idcard ?? '';
				this.formData.archivesNum = this.candidates[e]?.archivesNum ?? '';
				this.formData.phone = this.candidates[e]?.phoneNumber ?? '';
				this.formData.nowAddress = this.candidates[e]?.nowAddress ?? '';
				this.formData.idcardFront = formattingPhoto(this.candidates[e]?.idcardFront) ? [formattingPhoto(this.candidates[e]?.idcardFront)] : [];
				this.idcardFront = this.candidates[e]?.idcardFront ?? '';
				this.formData.licenseMainUrl = formattingPhoto(this.candidates[e]?.licenseMainUrl) ?  [formattingPhoto(this.candidates[e]?.licenseMainUrl)] : [];
				this.licenseMainUrl = this.candidates[e]?.licenseMainUrl ?? '';
				this.formData.licenseViceUrl = formattingPhoto(this.candidates[e]?.licenseViceUrl) ? [formattingPhoto(this.candidates[e]?.licenseViceUrl)] : [];
				this.licenseViceUrl = this.candidates[e]?.licenseViceUrl ?? '';
				this.formData.urgentConcat = this.candidates[e]?.urgentConcat;
				this.formData.sex = this.candidates[e]?.sex;
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
										let { devices } = e;
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
																this.formData.idcard = data?.身份证号;
																this.formData.nowAddress = data?.地址;
																this.formData.sex = data?.性别 === '男' ? 0 : 1;
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
						res?.data?.carPhotos?.split(',').forEach(o => {
							tmp.push(`${config.IMG_URL}${o}`);
						});
						delete res?.data?.carPhotos;
						this.carInfo = {
							carPhotos: tmp,
							...res.data
						};
						this.carList.push({ value: res?.data?.id, text: res?.data?.carNum });
						this.customerId = res?.data?.customer?.id;
						this.customer = res?.data?.customer ?? {};
						this.idcardFront = res.data?.customer?.idcardFront;
						this.licenseMainUrl = res.data?.customer?.licenseMainUrl;
						this.licenseViceUrl = res.data?.customer?.licenseViceUrl;
						this.formData.licenseMainUrl = [(formattingPhoto(res.data?.customer?.licenseMainUrl))];
						this.formData.licenseViceUrl = [(formattingPhoto(res.data?.customer?.licenseViceUrl))];
						this.formData.idcardFront = [(formattingPhoto(res.data?.customer?.idcardFront))];
						this.formData.name = res?.data?.customer?.name;
						this.formData.archivesNum = res?.data?.customer?.archivesNum;
						this.formData.carId = res?.data?.carNum ?? '';
						this.formData.idcard = res?.data?.customer?.idcard;
						this.formData.phone = res?.data?.customer?.phoneNumber;
						this.formData.nowAddress = res?.data?.customer?.nowAddress;
						this.formData.urgentConcat = res?.data?.customer?.urgentConcat;
						this.formData.sex = res?.data?.customer?.sex * 1;
						this.formOrderData.unitPrice = res?.data?.unitPrice;
						this.formOrderData.bondMoney = res?.data?.bondMoney;
						this.formOrderData.violationBondMoney = res?.data?.violationBondMoney;
						this.formOrderData.rentCarDays = res?.data?.wxOrder?.rentCarDays;
						this.oldCarId = res?.data?.id;
						this.carList = this._.uniqBy(this.carList, 'text');
					}
				});
			},
			getIdCard(e = {}) {
				let { url, ocr } = e;
				if (url && !!ocr) {
					this.formData.idcardFront = [formattingPhoto(url)];
					this.idcardFront = url;
					this.formData.name = ocr.name;
					this.formData.idcard = ocr.idnumber;
					this.formData.nowAddress = ocr.address;
					this.formData.birthday = ocr.birthday;
					this.formData.sex = ocr.gender === '男' ? 0 : 1;
				}
			},
			getLicenseMain(e = {}) {
				let { url, ocr } = e;
				if (url && !!ocr) {
					this.formData.licenseMainUrl = [formattingPhoto(url)];
					this.licenseMainUrl = url;
				}
			},
			getLicenseVice(e = {}) {
				let { url, ocr } = e;
				if (url && !!ocr) {
					this.formData.licenseViceUrl = [formattingPhoto(url)];
					this.licenseViceUrl = url;
					this.formData.archivesNum = ocr.archiveNumber;
				}
			},
			submit() {
				this.$refs.formOrder.validate().then(()=>{
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
								customerId: this.customerId,
								name: this.formData.name,
								idcard: this.formData.idcard,
								phoneNumber: this.formData.phoneNumber,
								orderId: this.formData.orderId,
								nowAddress: this.formData.nowAddress,
								birthday: this.formData.birthday,
								complanyId: this.carInfo.complanyId,
								orderId: this.carInfo.orderId,
								licenseMainUrl: this.licenseMainUrl,
								licenseViceUrl: this.licenseViceUrl,
								idcardFront: this.idcardFront,
								photoScan: this.$refs.photoScan.getFileList().join(','),
								...this.formOrderData,
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
									url: `/pages/model/InCar/Step?orderId=${this.carInfo.orderId}&idcard=${this.formData.idcard}&name=${this.formData.name}`
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
															if (typeof this.carInfo.complany.subMchId === 'string') {
																uni.navigateTo({
																	url: `/pages/model/InCar/Step?checks=${this._.map(checks, 'text').join(',')}&idcard=${this.formData.idcard}&name=${this.formData.name}&orderId=${this.carInfo.orderId}`
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
								}).catch(err => {
						uni.showModal({
							title: '提示',
							content: '请认真核对填写的信息',
							showCancel: false,
						})
					});
							} else {
								this.payOrder(this._.sum(this._.map(checks, 'value')), this._.map(checks, 'text').join(','), this.formData);
							}
						}).catch(err => {
						uni.showModal({
							title: '提示',
							content: '请认真核对填写的信息',
							showCancel: false,
						})
					});
					
				});
			},
			reset() {
				this.formData.name = '';
				this.formData.idcard = '';
				this.formData.phone = '';
				this.formData.nowAddress = '';
				this.formData.idcardFront = [];
				this.formData.licenseMainUrl = [];
				this.formData.licenseViceUrl = [];
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
									url: `/pages/model/InCar/Step?checks=${serviceRemark}&idcard=${data.idcard}&name=${this.formData.name}&orderId=${this.carInfo.orderId}`
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

<style lang="scss" scoped>
	.swiper_box {
		width: 100%;
		height: 300rpx;
	}

	.swiper_img {
		width: 100%;
		height: 300rpx;
	}
	
	.adorn {
		width: 3px;
		height: 60%;
		background-color: #FFD101;
		margin-right: 5px;
	}

	.info_box {
		width: 90%;
		display: flex;
		flex-direction: column;
		padding: 10px;
		background-color: #FFFFFF;
		border-radius: 10px;
		margin-bottom: 10px;
	}
	
	.info_title {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 42rpx;
	}
	.line {
		width: 100%;
		height: 1px;
		background-color: #eee;
		margin: 5px 0px;
	}

	.btn {
		margin-bottom: 10px;
		width: 90%;
	}

	.form_combox {
		border: 1px solid #c8c7cc;
		padding-left: 5px;
		padding-right: 5px;
		border-radius: 5px;
	}
	
	.readIdcard {
		width: 60%;
		margin: 10px 0px;
	}
</style>
