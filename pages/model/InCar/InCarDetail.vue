<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box" @change="e => (current = e.detail.current)">
			<swiper-item v-for="(item, index) in (carInfo || {}).carPhotos" :key="index"><image :src="item" class="swiper_img" mode="aspectFill"></image></swiper-item>
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
			<text>
				【预约租车时间】{{ dayjs((carInfo.wxOrder || {}).wantCarTime).format('YYYY-MM-DD HH:mm:ss') }}至{{
					dayjs((carInfo.wxOrder || {}).estimateReturnTime).format('YYYY-MM-DD HH:mm:ss')
				}}
			</text>
			<text>【租车天数】{{ ((carInfo || {}).wxOrder || {}).rentCarDays }} 天</text>
			<uni-forms ref="formOrder" v-model="formOrderData" :rules="orderRules" :labelWidth="100" class="form_box">
				<FormInput v-if="(carInfo.wxOrder || {}).payStatus !== 'SUCCESS'" :formData="formOrderData" name="unitPrice" label="租车单价" decoration type="number" />
				<FormInput v-if="(carInfo.wxOrder || {}).payStatus !== 'SUCCESS'" :formData="formOrderData" name="rentCarDays" label="租车天数" decoration type="number" />
				<FormInput :formData="formOrderData" name="bondMoney" label="租车保证金" decoration type="number" />
				<FormInput :formData="formOrderData" name="violationBondMoney" label="违章保证金" decoration type="number" />
			</uni-forms>
			<view v-if="formOrderData.unitPrice * 1 - carInfo.unitPrice * 1 !== 0">
				【优惠】{{
					formOrderData.unitPrice * 1 - carInfo.unitPrice * 1 > 0
						? `增加${formOrderData.unitPrice * 1 - carInfo.unitPrice * 1}元`
						: `减少${carInfo.unitPrice * 1 - formOrderData.unitPrice * 1}元`
				}}
			</view>
			<text>【租车总价】{{ formOrderData.unitPrice * formOrderData.rentCarDays}} 元</text>
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
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>承租人信息</text>
			</view>
			<view class="line"></view>
			<uni-forms ref="form" v-model="formData" :rules="rules" :labelWidth="100">
				<FormUpload :formData="formData" name="idcardFront" label="身份证" :limit="1" @getOcrData="getIdCard" url="/tool/ocr/idcard?type=2" :required="false"></FormUpload>
				<FormUpload
					:formData="formData"
					name="licenseMainUrl"
					label="驾照主页"
					:limit="1"
					@getOcrData="getLicenseMain"
					url="/tool/ocr/driving?type=8"
					:required="false"
				></FormUpload>
				<FormUpload
					:formData="formData"
					name="licenseViceUrl"
					label="驾照副页"
					:limit="1"
					@getOcrData="getLicenseVice"
					url="/tool/ocr/driving?type=9"
					:required="false"
				></FormUpload>
				<FormUpload ref="photoScan" :formData="formData" name="photoScan" label="现场照片" :limit="3" :required="false"></FormUpload>
				<u-button @click="readIdcard" class="readIdcard" type="primary">身份证阅读器</u-button>
				<uni-forms-item label="姓名" :name="formData.name" :required="true" decoration>
					<Combox :value="formData.name" :candidates="candidates" :isJSON="true" keyName="name" @getValue="getComboxValue" class="form_combox"></Combox>
				</uni-forms-item>
				<uni-forms-item label="移交车辆" :name="formData.carId" :required="true" decoration>
					<Combox :value="formData.carId" :candidates="carList" :isJSON="true" keyName="text" @getValue="getCarValue" class="form_combox"></Combox>
				</uni-forms-item>
				<FormInput :formData="formData" name="idcard" label="身份证号" decoration />
				<FormInput :formData="formData" name="archivesNum" label="档案编号" decoration />
				<FormPicker :formData="formData" name="sex" label="性别" :localdata="sexList" decoration @change="changeSex" />
				<FormInput :formData="formData" name="phone" label="手机号" decoration />
				<FormInput :formData="formData" name="urgentPhone" label="紧急联系人" decoration />
				<FormInput :formData="formData" name="nowAddress" label="当前居住地" decoration :required="false" />
				<FormInput :formData="formData" name="goDirection" label="去向" decoration :required="false" />
				<FormSwitch :formData="formData" name="preferredUse" label="代金券" @change="changePreferredUse" :required="false" decoration />
				<FormSwitch :formData="formData" name="qrCode" label="对方支付" @change="changeQrCode" :required="false" decoration />
				<FormRadio :required="false" :multiple="true" :formData="formData" name="check" :localdata="checkList" label="附加核验" @change="changeCheck" decoration />
			</uni-forms>
		</view>
		<u-button type="primary" class="btn" @click="submit">提交</u-button>
		<u-button class="btn" @click="reset">重置</u-button>
		<u-popup :show="showQr" mode="center">
			<image :src="src"></image>
			<u-button style="margin-bottom: 20px;" @click="qrCode(serviceInfoMoney, serviceRemark, serviceStatus)" type="primary">刷新二维码</u-button>
		</u-popup>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
import FormRadio from '../../../components/form/FormRadio.vue';
import FormInput from '../../../components/form/FormInput.vue';
import Combox from '../../../components/cuihai-combox/cuihai-combox.vue';
import FormPicker from '../../../components/form/FormPicker.vue';
import FormSwitch from '../../../components/form/FormSwitch.vue';
import FormUpload from '../../../components/form/FormUpload.vue';
import { formattingPhoto } from '../../../common/utils.js';
import { card15, card18, phoneRegex } from '../../../common/regex.js';
import { base64ToPath } from 'image-tools'
export default {
	components: {
		FormRadio,
		FormInput,
		Combox,
		FormPicker,
		FormSwitch,
		FormUpload
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
				urgentPhone: '',
				sex: '',
				photoScan: [],
				birthday: '',
				archivesNum: '',
				qrCode: false,
				goDirection: ''
			},
			customerId: '',
			checkList: [],
			rules: {
				name: {
					rules: [
						{
							required: true,
							errorMessage: '请填写姓名'
						}
					]
				},
				archivesNum: {
					rules: [
						{
							required: true,
							errorMessage: '请填写档案编号'
						}
					]
				},
				sex: {
					rules: [
						{
							required: true,
							errorMessage: '请选择性别'
						}
					]
				},
				carId: {
					rules: [
						{
							required: true,
							errorMessage: '请选择移交车辆'
						}
					]
				},
				urgentPhone: {
					rules: [
						{
							required: true,
							errorMessage: '请填写紧急联系人'
						}
					]
				},
				idcard: {
					rules: [
						{
							required: true,
							errorMessage: '请填写身份证号'
						},
						{
							validateFunction: (rule, val, data, callback) => {
								let card18 = new RegExp(card18);
								let card15 = new RegExp(card15);
								let value = val.trim();
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
					rules: [
						{
							required: true,
							errorMessage: '请填写手机号'
						},
						{
							pattern: phoneRegex,
							errorMessage: '请输入正确的电话号码'
						}
					]
				}
			},
			current: 0,
			candidates: [],
			oldCarId: '',
			idcardFront: '',
			licenseMainUrl: '',
			licenseViceUrl: '',
			sexList: [{ value: 0, text: '男' }, { value: 1, text: '女' }],
			formOrderData: {
				unitPrice: '',
				rentCarDays: '',
				bondMoney: '',
				violationBondMoney: ''
			},
			orderRules: {
				unitPrice: {
					rules: [
						{
							required: true,
							errorMessage: '请填写租车单价'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (value * 1 < 20) {
									callback('租车单价最低不能低于20元');
								}
								return true;
							}
						}
					]
				},
				rentCarDays: {
					rules: [
						{
							required: true,
							errorMessage: '请填写租车天数'
						}
					]
				},
				bondMoney: {
					rules: [
						{
							required: true,
							errorMessage: '请填写租车保证金'
						}
					]
				},
				violationBondMoney: {
					rules: [
						{
							required: true,
							errorMessage: '请填写违章保证金'
						}
					]
				}
			},
			driveType: '',
			nation: '',
			src: '',
			showQr: false,
			serviceInfoMoney: '',
			serviceRemark: '',
			serviceStatus: '',
			timer: undefined
		};
	},
	onLoad(option) {
		this.dictInit('additional_check').then(() => {
			this.checkList = uni.getStorageSync('additional_check');
		});
		let user = uni.getStorageSync('user');
		api.getChangeCarList({
			complanyIds: this._.map(user.complany, 'id').join(',')
		}).then(res => {
			if (res.data) {
				let { data } = res;
				data.forEach(car => {
					this.carList.push({
						value: car.id,
						text: car.carNum
					});
				});
			}
		});
		api.getUserByComplany(this._.map(user.complany, 'id').join(',')).then(res => {
			this.candidates = res?.data ?? [];
		});
		this.getCarInfo(option.id);
	},
	onBackPress() {
		this.timer && clearInterval(this.timer);
	},
	methods: {
		changeCheck(e) {
			if (this._.includes(this._.map(e.detail.data, 'text'), '电子合同 (1元/次)')) {
				api.checkAuth(this.carInfo.complany.complanyName).then(res => {
					if (res.data === 0) {
						uni.showModal({
							title: '认证提示',
							content: `${res.msg}`,
							confirmText: '前往电子合同认证',
							cancelText: '取消',
							success: e => {
								if (e.confirm) {
									uni.navigateTo({
										url: '/pages/model/my/ContractTemplate'
									});
								} else {
									e.detail.value.pop();
									this.formData.check = e.detail.value;
								}
							}
						});
					} else if (res.data === 2) {
						this.formData.check = e.detail.value;
					}
				});
			} else {
				this.formData.check = e.detail.value;
			}
		},
		changeSex(e) {
			this.formData.sex = e.value;
		},
		changePreferredUse(e) {
			this.formData.preferredUse = e;
		},
		changeQrCode(e) {
			this.formData.qrCode = e;
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
			this.formData.licenseMainUrl = formattingPhoto(this.candidates[e]?.licenseMainUrl) ? [formattingPhoto(this.candidates[e]?.licenseMainUrl)] : [];
			this.licenseMainUrl = this.candidates[e]?.licenseMainUrl ?? '';
			this.formData.licenseViceUrl = formattingPhoto(this.candidates[e]?.licenseViceUrl) ? [formattingPhoto(this.candidates[e]?.licenseViceUrl)] : [];
			this.licenseViceUrl = this.candidates[e]?.licenseViceUrl ?? '';
			this.formData.urgentPhone = this.candidates[e]?.urgentPhone;
			this.formData.sex = this.candidates[e]?.sex;
			this.driveType = this.candidates[e]?.driveType;
			this.nation = this.candidates[e]?.nation;
		},
		getCarValue(e) {
			this.formData.carId = this.carList[e]?.text ?? '';
		},
		readIdcard() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.openBluetoothAdapter({
					success: () => {
						uni.startBluetoothDevicesDiscovery({
							success: res => {
								uni.onBluetoothDeviceFound(e => {
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
													idcard.readIdcard(device.deviceId, e => {
														let data = JSON.parse(e);
														if (!data?.cardNo) {
															uni.showToast({
																title: '识别失败，请重新点击识别按钮',
																icon: 'none'
															});
															return;
														}
														base64ToPath(`data:image/jpeg;base64,${data?.pictureBase64}`).then(path => {
															this.formData.name = '';
															uni.uploadFile({
																url: `${config.API_URL}/idcard/pic?name=${data?.name}&sex=${data?.gender}&nation=${data?.ethnicity}&year=${this.dayjs(data?.birth).format('YYYY')}&month=${this.dayjs(data?.birth).format('MM')}&day=${this.dayjs(data?.birth).format('DD')}&address=${data?.address}&idcard=${data?.cardNo}&lssueOffice=${data?.authority}&lssueTime=${this.dayjs(data?.startDate).format('YYYY.MM.DD')}&invalidTime=${this.dayjs(data?.endDate).format('YYYY.MM.DD')}`,
																filePath: path,
																name: 'file',
																header: {
																	Authorization: 'Bearer ' + uni.getStorageSync('tonken')
																},
																success: (res) => {
																	this.formData.idcardFront = [];
																	let result = JSON.parse(res?.data);
																	this.$nextTick(() => {
																		this.formData.name = data?.name;
																		this.formData.idcard = data?.cardNo;
																		this.formData.nowAddress = data?.address;
																		this.formData.sex = data?.gender === '男' ? 0 : 1;
																		this.nation = data?.ethnicity;
																		this.idcardFront = result?.data?.face;
																		this.formData.idcardFront = [formattingPhoto(result?.data?.face)]
																	});
																}
															});
														});
													});
												} else {
													uni.showToast({
														title: `未授权设备`,
														icon: 'error'
													});
												}
												uni.hideLoading();
												uni.closeBluetoothAdapter();
											}
										});
									}
								});
							}
						});
					},
					fail: () => {
						uni.showToast({
							title: '蓝牙启动失败',
							icon: 'none'
						});
					}
				});
			} else {
				uni.showToast({
					title: '该功能暂时仅限安卓系统手机使用',
					icon: 'none'
				});
			}
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
					this.formData.licenseMainUrl = [formattingPhoto(res.data?.customer?.licenseMainUrl)];
					this.formData.licenseViceUrl = [formattingPhoto(res.data?.customer?.licenseViceUrl)];
					this.formData.idcardFront = [formattingPhoto(res.data?.customer?.idcardFront)];
					this.formData.name = res?.data?.customer?.name;
					this.formData.archivesNum = res?.data?.customer?.archivesNum;
					this.formData.carId = res?.data?.carNum ?? '';
					this.formData.idcard = res?.data?.customer?.idcard;
					this.formData.phone = res?.data?.customer?.phoneNumber;
					this.formData.nowAddress = res?.data?.customer?.nowAddress;
					this.formData.urgentPhone = res?.data?.customer?.urgentPhone;
					this.driveType = res?.data?.customer?.driveType;
					this.nation = res?.data?.customer?.nation;
					this.formData.sex = res?.data?.customer?.sex * 1;
					this.formOrderData.unitPrice = res?.data?.unitPrice;
					this.formOrderData.bondMoney = res?.data?.bondMoney;
					this.formOrderData.violationBondMoney = res?.data?.violationBondMoney;
					this.formOrderData.rentCarDays = res?.data?.wxOrder?.rentCarDays;
					this.formOrderData.goDirection = res?.data?.wxOrder?.goDirection;
					this.oldCarId = res?.data?.id;
					this.carList = this._.uniqBy(this.carList, 'text');
					if (res?.data?.wxOrder?.contract) {
						uni.redirectTo({
							url: `/pages/model/InCar/Pact?orderId=${res?.data?.wxOrder?.orderId}&pactId=${res?.data?.wxOrder?.contract}`
						});
						return;
					}
					if (res?.data?.wxOrder?.infoFlag || res?.data?.wxOrder?.conctratInfoFlag) {
						uni.redirectTo({
							url: `/pages/model/InCar/Step?orderId=${res?.data?.wxOrder?.orderId}&pactFlag=${res?.data?.wxOrder?.conctratInfoFlag}`
						});
						return;
					}
				}
			});
		},
		getIdCard(e = {}) {
			let { url, ocr } = e;
			this.formData.idcardFront = [formattingPhoto(url)];
			this.idcardFront = url;
			if (!!ocr) {
				this.formData.name = ocr.name;
				this.formData.idcard = ocr.idnumber;
				this.formData.nowAddress = ocr.address;
				this.formData.birthday = ocr.birthday;
				this.formData.sex = ocr.gender === '男' ? 0 : 1;
				this.nation = ocr.nationality;
			}
		},
		getLicenseMain(e = {}) {
			let { url, ocr } = e;
			this.formData.licenseMainUrl = [formattingPhoto(url)];
			this.licenseMainUrl = url;
			this.driveType = ocr?.vehicleType;
		},
		getLicenseVice(e = {}) {
			let { url, ocr } = e;
			this.formData.licenseViceUrl = [formattingPhoto(url)];
			this.licenseViceUrl = url;
			if (!!ocr) {
				this.formData.archivesNum = ocr.archiveNumber;
			}
		},
		submit() {
			this.$refs.formOrder.validate().then(() => {
				this.$refs.form
					.validate()
					.then(data => {
						let params = {};
						let currentCar = this._.find(this.carList, o => {
							return o.text === this.formData.carId;
						});
						if (currentCar.value !== this.oldCarId) {
							params = {
								newCarId: currentCar.value,
								oldCarId: this.oldCarId
							};
						} else {
							params = {
								newCarId: this.oldCarId
							};
						}
						const customer = this._.find(this.candidates, item => item.idcard === this.formData.idcard);
						api.insertUserInfo({
							customerId: customer?.id ?? '',
							name: this.formData.name,
							idcard: this.formData.idcard,
							phoneNumber: this.formData.phone,
							orderId: this.formData.orderId,
							nowAddress: this.formData.nowAddress,
							birthday: this.formData.birthday,
							complanyId: this.carInfo.complanyId,
							orderId: this.carInfo.orderId,
							sex: this.formData.sex,
							goDirection: this.formData.goDirection,
							archivesNum: this.formData.archivesNum,
							licenseMainUrl: this.licenseMainUrl,
							licenseViceUrl: this.licenseViceUrl,
							idcardFront: this.idcardFront,
							driveType: this.driveType,
							nation: this.nation,
							urgentPhone: this.formData.urgentPhone,
							photoScan: this.$refs.photoScan.getFileList().join(','),
							...this.formOrderData,
							...params
						});
						let checks = [];
						this.checkList.forEach(o => {
							this.formData.check.forEach(item => {
								o.value === item &&
									checks.push({
										value: o.value * 1,
										text: o.text
									});
							});
						});
						if (checks.length === 0 && this.carInfo.wxOrder.payStatus === 'SUCCESS') {
							uni.redirectTo({
								url: `/pages/model/InCar/Step?orderId=${this.carInfo.orderId}&idcard=${this.formData.idcard}&name=${this.formData.name}&pactFlag=false`
							});
							return;
						}
						if (this.formData.preferredUse) {
							api.checkService({
								complanyId: this.carInfo.complany.id,
								money: this._.sum(this._.map(checks, 'value'))
							})
								.then(res => {
									if (res) {
										if (res.data) {
											uni.showModal({
												title: `剩余代金券金额${res.msg}元`,
												confirmText: '代金券支付',
												showCancel: false,
												success: e => {
													api.deduct({
														complanyId: this.carInfo.complany.id,
														money: this._.sum(this._.map(checks, 'value'))
													}).then(result => {
														if (result) {
															if (this.carInfo.wxOrder.payStatus === 'SUCCESS') {
																uni.redirectTo({
																	url: `/pages/model/InCar/Step?checks=${this._.map(checks, 'text').join(',')}&idcard=${
																		this.formData.idcard
																	}&name=${this.formData.name}&orderId=${this.carInfo.orderId}`
																});
															} else {
																if (this.formData.qrCode) {
																	this.qrCode(0, this._.map(checks, 'text').join(','), true);
																} else {
																	this.payOrder(0, this._.map(checks, 'text').join(','));
																}
															}
														}
													});
												}
											});
										} else {
											uni.showModal({
												title: `剩余代金券${res.msg}元不足以支付本次费用${this._.sum(this._.map(checks, 'value'))}元`,
												success: e => {
													if (e.confirm) {
														if (this.formData.qrCode) {
															this.qrCode(this._.sum(this._.map(checks, 'value')), this._.map(checks, 'text').join(','), false);
														} else {
															this.payOrder(this._.sum(this._.map(checks, 'value')), this._.map(checks, 'text').join(','));
														}
													}
												}
											});
										}
									}
								})
								.catch(err => {
									uni.showModal({
										title: '提示',
										content: '必填项请填写完整',
										showCancel: false
									});
								});
						} else {
							if (this.formData.qrCode) {
								this.qrCode(this._.sum(this._.map(checks, 'value')), this._.map(checks, 'text').join(','), false);
							} else {
								this.payOrder(this._.sum(this._.map(checks, 'value')), this._.map(checks, 'text').join(','));
							}
						}
					})
					.catch(err => {
						uni.showModal({
							title: '提示',
							content: '必填项请填写完整',
							showCancel: false
						});
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
		payOrder(serviceInfoMoney, serviceRemark) {
			let currentCar = this._.find(this.carList, o => {
				return o.text === this.formData.carId;
			});
			api.payOrder({
				serviceInfoMoney,
				openid: this.carInfo.wxOrder.openid,
				wantCarTime: this.carInfo.wxOrder.wantCarTime,
				estimateReturnTime: this.carInfo.wxOrder.estimateReturnTime,
				serviceRemark,
				carId: currentCar.value,
				infoOrderId: this.carInfo.orderId
			}).then((res = {}) => {
				let info = res.data;
				if (info) {
					uni.requestPayment({
						provider: 'wxpay',
						orderInfo: info,
						success: () => {
							uni.redirectTo({
								url: `/pages/model/InCar/Step?checks=${serviceRemark}&idcard=${this.formData.idcard}&name=${this.formData.name}&orderId=${this.carInfo.orderId}`
							});
						}
					});
				}
			});
		},
		qrCode(serviceInfoMoney, serviceRemark, serviceStatus) {
			let flag = this.carInfo.wxOrder.payStatus === 'SUCCESS';
			this.serviceRemark = serviceRemark;
			this.serviceInfoMoney = serviceInfoMoney;
			this.serviceStatus = serviceStatus;
			this.$nextTick(() => {
				api.qrCode({
					serviceMoney: this.serviceInfoMoney,
					serviceInfo: this.serviceRemark,
					infoOrderId: this.carInfo.wxOrder.orderId,
					flag,
					serviceStatus: this.serviceStatus,
					complanyId: this.carInfo.complany.id
				}).then(res => {
					this.showQr = true;
					this.$nextTick(() => {
						this.src = 'data:image/gif;base64,' + res.img;
					});
					this.timer = setInterval(() => {
						api.orderDetail(res.orderId, false).then(data => {
							if (data.data.payStatus === 'SUCCESS') {
								clearInterval(this.timer);
								uni.redirectTo({
									url: `/pages/model/InCar/Step?checks=${this.serviceRemark}&idcard=${this.formData.idcard}&name=${this.formData.name}&orderId=${
										this.carInfo.orderId
									}`
								});
							}
						});
					}, 3000);
				});
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
	background-color: #1B90D1;
	margin-right: 5px;
}

.info_box {
	width: 90%;
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: #ffffff;
	border-radius: 10px;
	margin-bottom: 10px;
}

.info_title {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-weight: bold;
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
