<template>
	<view class="backgroud_box content">
		<u-image :src="(photo[0] || {}).url" class="title_img" width="100%" height="300rpx" :showError="false"></u-image>
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="280" :rules="rules" class="form_box">
			<FormUpload
				:readonly="disabled"
				:formData="formData"
				name="licenseFrontUrl"
				label="行驶证正面"
				:limit="1"
				@getOcrData="getLicenseFront"
				url="/tool/ocr/license"
				:otherData="{ type: 6 }"
				:decoration="true"
			/>
			<FormUpload
				:readonly="disabled"
				:formData="formData"
				name="licenseBackUrl"
				label="行驶证背面"
				:limit="1"
				@getOcrData="getLicenseBack"
				url="/tool/ocr/license"
				:otherData="{ type: 7 }"
				:decoration="true"
			/>
			<FormUpload ref="carPhotos" :readonly="disabled" :formData="formData" name="carPhotos" label="车辆图片" :decoration="true" />
			<FormPicker :disabled="disabled" :formData="formData" name="source" :localdata="sourceType" label="车辆来源" @change="sourceChange" />
			<FormPicker
				:disabled="disabled && gpsInstall === 1"
				:formData="formData"
				name="operatorId"
				:localdata="gpsVendorType"
				label="GPS厂商"
				@change="e => (formData.operatorId = e.value)"
				:required="false"
			/>
			<FormInput :disabled="disabled" :formData="formData" name="carNum" label="车牌号" />
			<FormInput :disabled="disabled" :formData="formData" name="carBrand" label="车辆品牌" />
			<FormPicker :disabled="disabled" :formData="formData" name="type" :localdata="carType" label="车辆类型" @change="e => (formData.type = e.value)" />
			<FormPicker :disabled="disabled" :formData="formData" name="cartype" :localdata="violateType" label="违章查询车辆类型" @change="e => (formData.cartype = e.value)" />
			<FormInput :disabled="disabled" :formData="formData" name="color" label="车身颜色" />
			<FormInput :disabled="disabled" :formData="formData" name="frameNum" label="车架号" />
			<FormInput :disabled="disabled" :formData="formData" name="engineNum" label="发动机号" />
			<FormInput :disabled="disabled" :formData="formData" name="maxManned" label="荷载人数" />
			<FormPicker :disabled="disabled" :formData="formData" name="fuelType" label="燃油编号" :localdata="gasolineType" @change="e => (formData.fuelType = e.value)" />
			<FormInput :disabled="disabled" :formData="formData" name="thirdLiabilityInsurance" :candidates="['30', '50', '100']" label="第三者责任险(万元)" />
			<FormSwitch :disabled="disabled" :formData="formData" name="thirdNoDeductible" type="checkbox" label="第三者责任险是否不计免赔" :required="false" />
			<FormPicker
				:disabled="disabled"
				:formData="formData"
				name="lossInsurance"
				:localdata="lossInsuranceType"
				label="机动车损失险"
				@change="e => (formData.lossInsurance = e.value)"
			/>
			<FormSwitch :disabled="disabled" :formData="formData" name="lossNoDeductible" type="checkbox" label="机动车损失险是否不计免赔" :required="false" />
			<FormInput :disabled="disabled" :formData="formData" name="price" label="车辆价值(元)" />
			<FormInput :disabled="disabled" :formData="formData" name="unitPrice" label="租车单价(元/天)" />
			<FormInput v-show="source !== '1'" :disabled="disabled" :formData="formData" name="name" label="车主姓名" />
			<FormInput v-show="source !== '1'" :disabled="disabled" :formData="formData" name="idcard" label="车主身份证号" />
			<FormInput :disabled="disabled" :formData="formData" name="phoneNum" label="车主手机号码" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="bondMoney" label="租车保证金(元)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="violationBondMoney" label="违章保证金(元)" :required="false" />
			<FormDatePicker
				:disabled="disabled"
				v-show="moreItemsFlag"
				:formData="formData"
				name="strongEndTime"
				label="交强险到期时间(格式:yyyy-mm-dd)"
				:required="false"
				@change="changeStrongEndTime"
			/>
			<FormDatePicker
				:disabled="disabled"
				v-show="moreItemsFlag"
				:formData="formData"
				name="businessEndTime"
				label="商业险到期时间 (格式:yyyy-mm-dd)"
				:required="false"
				@change="changeBusinessEndTime"
			/>
			<FormDatePicker
				:disabled="disabled"
				v-show="moreItemsFlag"
				:formData="formData"
				name="annualReview"
				label="年审到期时间 (格式:yyyy-mm-dd)"
				:required="false"
				@change="changeAnnualReview"
			/>
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="maxMileage" label="每日平均最高行驶里程(公里)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="maxMileagePrice" label="超过里程每公里收取金额(公里)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="remark" label="车辆备注说明" :required="false" autoHeight type="textarea" />
			<view class="more" @click="showMoreItems">
				{{ moreTitle }}
				<uni-icons :type="iconType"></uni-icons>
			</view>
			<view class="btnGrup" v-show="!disabled">
				<u-button @click="submit" type="primary" class="bottomBtn">保存</u-button>
				<u-button @click="reset" type="error" class="bottomBtn">重置</u-button>
			</view>
		</uni-forms>
		<uni-fab v-show="carId" :content="content" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger"></uni-fab>
		<view v-if="showQR" class="qrcode_box">
			<text>请出示二维码或分享车辆给承租人下单</text>
			<Qrcode ref="qrcode" :size="400" :val="val" :onval="true" background="#FFFFFF" foreground="#000000"></Qrcode>
			<uni-data-checkbox style="margin-top: 50rpx;" v-model="payment" :localdata="paymentList" @change="changePayment"></uni-data-checkbox>
			<u-button type="primary" style="margin-top: 50rpx;" @click="share(payment)">分享车辆下单</u-button>
			<u-button style="margin-top: 50rpx;" @click="() => (showQR = false)" type="error">关闭二维码</u-button>
		</view>
	</view>
</template>
<script>
import FormInput from '../../../components/form/FormInput.vue';
import FormPicker from '../../../components/form/FormPicker.vue';
import FormRadio from '../../../components/form/FormRadio.vue';
import FormSwitch from '../../../components/form/FormSwitch.vue';
import FormUpload from '../../../components/form/FormUpload.vue';
import FormDatePicker from '../../../components/form/FormDatePicker.vue';
import Qrcode from '../../../components/tki-qrcode/tki-qrcode.vue';
import { formattingPhoto } from '../../../common/utils.js';
import { plateRegex, integerRegex, positiveRegex, socialCodeRegex, card18, card15, phoneRegex, dateFormatRegex } from '../../../common/regex.js';
import api from '../../../api/index.js';
import config from '../../../common/config.js';
export default {
	components: {
		FormInput,
		FormPicker,
		FormRadio,
		FormSwitch,
		FormUpload,
		FormDatePicker,
		Qrcode
	},
	data() {
		return {
			rules: {
				carPhotos: {
					rules: [
						{
							required: true,
							errorMessage: '请上传至少一张车辆照片'
						}
					]
				},
				licenseFrontUrl: {
					rules: [
						{
							required: true,
							errorMessage: '请上传行驶证正面照片'
						}
					]
				},
				licenseBackUrl: {
					rules: [
						{
							required: true,
							errorMessage: '请上传行驶证背面照片'
						}
					]
				},
				source: {
					rules: [
						{
							required: true,
							errorMessage: '请选择车辆来源'
						}
					]
				},
				carNum: {
					rules: [
						{
							required: true,
							errorMessage: '请输入车牌号'
						},
						{
							pattern: plateRegex,
							errorMessage: '请输入正确的车牌号'
						}
					]
				},
				carBrand: {
					rules: [
						{
							required: true,
							errorMessage: '请输入车辆品牌'
						}
					]
				},
				type: {
					rules: [
						{
							required: true,
							errorMessage: '请选择车辆类型'
						}
					]
				},
				cartype: {
					rules: [
						{
							required: true,
							errorMessage: '请选择违章查询车辆类型'
						}
					]
				},
				color: {
					rules: [
						{
							required: true,
							errorMessage: '请输入车辆颜色'
						}
					]
				},
				frameNum: {
					rules: [
						{
							required: true,
							errorMessage: '请输入车架号号'
						}
					]
				},
				engineNum: {
					rules: [
						{
							required: true,
							errorMessage: '请输入发动机号'
						}
					]
				},
				maxManned: {
					rules: [
						{
							required: true,
							errorMessage: '请输入荷载人数'
						}
					]
				},
				fuelType: {
					rules: [
						{
							required: true,
							errorMessage: '请选择燃油编号'
						}
					]
				},
				thirdLiabilityInsurance: {
					rules: [
						{
							required: true,
							errorMessage: '请输入第三者责任险'
						},
						{
							pattern: integerRegex,
							errorMessage: '请输入正确的三责险金额'
						}
					]
				},
				lossInsurance: {
					rules: [
						{
							required: true,
							errorMessage: '请选择机动车损失险'
						}
					]
				},
				price: {
					rules: [
						{
							required: true,
							errorMessage: '请输入车辆价值'
						},
						{
							pattern: positiveRegex,
							errorMessage: '请输入正确的车辆价值'
						}
					]
				},
				unitPrice: {
					rules: [
						{
							required: true,
							errorMessage: '请输入租车单价'
						},
						{
							pattern: positiveRegex,
							errorMessage: '请输入租车单价'
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
				cardId: {
					rules: [
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
				phoneNum: {
					rules: [
						{
							required: true,
							errorMessage: '请输入车主电话号码'
						},
						{
							pattern: phoneRegex,
							errorMessage: '请输入正确的车辆价值'
						}
					]
				},
				bondMoney: {
					rules: [
						{
							pattern: positiveRegex,
							errorMessage: '请输入正确的租车保证金'
						}
					]
				},
				violationBondMoney: {
					rules: [
						{
							pattern: positiveRegex,
							errorMessage: '请输入正确的违章保证金'
						}
					]
				},
				strongEndTime: {
					rules: [
						{
							pattern: dateFormatRegex,
							errorMessage: '请输入正确的交强险到期时间'
						}
					]
				},
				businessEndTime: {
					rules: [
						{
							pattern: dateFormatRegex,
							errorMessage: '请输入正确的商业险到期时间'
						}
					]
				},
				annualReview: {
					rules: [
						{
							pattern: dateFormatRegex,
							errorMessage: '请输入正确的年审到期时间'
						}
					]
				},
				maxMileage: {
					rules: [
						{
							pattern: integerRegex,
							errorMessage: '请输入正确的每日平均里程'
						}
					]
				},
				maxMileagePrice: {
					rules: [
						{
							pattern: positiveRegex,
							errorMessage: '请输入正确的超过里程每公里收取金额'
						}
					]
				}
			},
			formData: {
				licenseFrontUrl: [],
				licenseBackUrl: [],
				carPhotos: [],
				source: '',
				operatorId: '',
				carNum: '',
				carBrand: '',
				type: '',
				color: '',
				frameNum: '',
				engineNum: '',
				maxManned: '',
				fuelType: '',
				thirdLiabilityInsurance: '',
				thirdNoDeductible: false,
				lossInsurance: '',
				lossNoDeductible: false,
				price: '',
				unitPrice: '',
				name: '',
				cardId: '',
				phoneNum: '',
				bondMoney: '',
				violationBondMoney: '',
				strongEndTime: '',
				businessEndTime: '',
				annualReview: '',
				maxMileage: '',
				maxMileagePrice: '',
				remark: '',
				idcard: '',
				cartype: ''
			},
			carPhotos: [],
			sourceType: [],
			carType: [],
			violateType: [],
			gpsVendorType: [],
			carBrand: [],
			gasolineType: [],
			lossInsuranceType: [],
			source: '',
			iconType: 'arrowdown',
			moreItemsFlag: false,
			disabled: true,
			carId: '',
			licenseFrontUrl: '',
			licenseBackUrl: '',
			moreTitle: '展开更多',
			gpsInstall: 0,
			content: [
				{
					iconPath: '../../../static/img/goToTop.png',
					selectedIconPath: '',
					text: '回到顶部'
				},
				{
					iconPath: '../../../static/img/edit.png',
					selectedIconPath: '',
					text: '编辑'
				},
				{
					iconPath: '../../../static/img/weizhang.png',
					selectedIconPath: '',
					text: '违章查询'
				},
				{
					iconPath: '../../../static/img/wechat.png',
					selectedIconPath: '',
					text: '分享车辆'
				},
				{
					iconPath: '../../../static/img/qrcode.png',
					selectedIconPath: '',
					text: '二维码'
				}
			],
			complany: [],
			user: uni.getStorageSync('user'),
			payment: uni.getStorageSync('payment') || '2',
			complanyId: uni.getStorageSync('complanyId'),
			carId: '',
			scrollY: true,
			complanyName: '',
			showQR: true,
			paymentList: [{ value: '1', text: '线上支付', disable: true }, { value: '2', text: '线下支付' }],
			val: '',
			photo: []
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.type === 'add' ? '添加车辆' : '车辆详情'
		});
		this.disabled = option.type === 'add' ? false : true;
		this.showQR = option.showQR === 'true';
		this.getGpsList();
		this.dictInit('car_type', 'sources_vehicle', 'fuel_number', 'insurance_status', 'violate_type').then(() => {
			this.carType = uni.getStorageSync('car_type');
			this.sourceType = uni.getStorageSync('sources_vehicle');
			this.gasolineType = uni.getStorageSync('fuel_number');
			this.lossInsuranceType = uni.getStorageSync('insurance_status');
			this.violateType = uni.getStorageSync('violate_type');
		});
		this.carId = option.id;
		this.complany = this._.find(this.user.complany, o => {
			return o.id === uni.getStorageSync('complanyId');
		});
		this.paymentList[0].disable = this?.complany?.subMchId === null;
	},
	onBackPress(e) {
		if (e.from) {
			uni.$emit('car');
		}
	},
	mounted() {
		this.carId && this.getCarInfo(this.carId);
	},
	methods: {
		share(paymethod) {
			if (paymethod) {
				uni.share({
					provider: 'weixin',
					type: 5,
					scene: 'WXSceneSession',
					imageUrl: '/static/logo.png',
					title: `${this.formData.carBrand}`,
					miniProgram: {
						id: 'gh_4be764c63360',
						path: `/pages/index/Index?complanyId=${this.complanyId}&carId=${this.carId}&payment=${paymethod}`,
						type: 0,
						webUrl: 'http://uniapp.dcloud.io'
					}
				});
			} else {
				uni.showActionSheet({
					itemList: ['线上支付', '线下支付'],
					success: e => {
						let payment = undefined;
						if (e.tapIndex === 0) {
							payment = '1';
						} else if (e.tapIndex === 1) {
							payment = '2';
						}
						if (payment) {
							uni.share({
								provider: 'weixin',
								type: 5,
								scene: 'WXSceneSession',
								imageUrl: '/static/logo.png',
								title: `${this.formData.carBrand}`,
								miniProgram: {
									id: 'gh_4be764c63360',
									path: `/pages/index/Index?complanyId=${this.complanyId}&carId=${this.carId}&payment=${payment}`,
									type: 0,
									webUrl: 'http://uniapp.dcloud.io'
								}
							});
						}
					}
				});
			}
		},
		checkIllegal() {
			api.checkIllegal({
				carId: this.carId
			}).then(res => {
				let { data } = res;
				if (data?.car_no && data?.vio_total) {
					uni.showModal({
						title: '违章提示',
						content: `${data?.car_no}有${data?.vio_total}条违章尚未处理！`,
						showCancel: false
					});
				} else {
					uni.showModal({
						title: '违章提示',
						content: `无违章信息`,
						showCancel: false
					});
				}
			});
		},
		showQrCode() {
			this.showQR = true;
			this.val = '';
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 200
			});
			this.$nextTick(() => {
				this.val = `${config.API_URL}/applet?complanyId=${this.complanyId}=${this.carId}=${this.payment}`;
			});
		},
		changePayment(e) {
			this.payment = e.detail.value;
			uni.setStorageSync('payment', e.detail.value);
			this.$nextTick(() => {
				this.val = `${config.API_URL}/applet?complanyId=${this.complanyId}=${this.carId}=${this.payment}`;
			});
		},
		changeStrongEndTime(e) {
			this.formData.strongEndTime = e;
		},
		changeBusinessEndTime(e) {
			this.formData.businessEndTime = e;
		},
		changeAnnualReview(e) {
			this.formData.annualReview = e;
		},
		trigger(e) {
			switch (e.index) {
				case 0:
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 200
					});
					break;
				case 1:
					this.disabled = false;
					break;
				case 2:
					this.checkIllegal();
					break;
				case 3:
					this.share();
					break;
				case 4:
					this.showQrCode();
					break;
				default:
					break;
			}
		},
		getGpsList() {
			api.gpsList().then((res = {}) => {
				let { data } = res;
				let tmp = [];
				if (data) {
					data.forEach(item => {
						tmp.push({
							value: item.id,
							text: item.complanyName
						});
					});
					this.gpsVendorType = tmp;
				}
			});
		},
		getCarInfo(id) {
			api.carInfo(id).then((res = {}) => {
				let { data } = res;
				if (data) {
					let files = data.carPhotos?.split(',');
					let carsPhotos = [];
					files?.forEach((item, index) => {
						carsPhotos.push(formattingPhoto(item));
						this.carPhotos.push(item);
					});
					this.gpsInstall = data.gpsInstall;
					this.photo = carsPhotos;
					this.source = data.source;
					this.complanyName = data.complany.complanyName;
					this.carId = data.id;
					this.formData.carPhotos = carsPhotos;
					this.formData.licenseFrontUrl = [formattingPhoto(data.licenseFrontUrl)];
					this.licenseFrontUrl = data.licenseFrontUrl;
					this.formData.licenseBackUrl = [formattingPhoto(data.licenseBackUrl)];
					this.licenseBackUrl = data.licenseBackUrl;
					this.formData.source = data.source;
					this.formData.operatorId = data.operatorId;
					this.formData.carNum = data.carNum;
					this.formData.carBrand = data.carBrand;
					this.formData.type = data.type;
					this.formData.cartype = data.cartype;
					this.formData.color = data.color;
					this.formData.frameNum = data.frameNum;
					this.formData.engineNum = data.engineNum;
					this.formData.maxManned = data.maxManned;
					this.formData.fuelType = data.fuelType;
					this.formData.thirdLiabilityInsurance = data.thirdLiabilityInsurance;
					this.formData.thirdNoDeductible = data.thirdNoDeductible;
					this.formData.lossInsurance = data.lossInsurance;
					this.formData.lossNoDeductible = data.lossNoDeductible;
					this.formData.price = data.price;
					this.formData.unitPrice = data.unitPrice;
					this.formData.name = data.name;
					this.formData.phoneNum = data.phoneNum;
					this.formData.idcard = data.idcard;
					this.formData.bondMoney = data.bondMoney;
					this.formData.violationBondMoney = data.violationBondMoney;
					this.formData.strongEndTime = data.strongEndTime;
					this.formData.businessEndTime = data.businessEndTime;
					this.formData.annualReview = data.annualReview;
					this.formData.maxMileage = data.maxMileage;
					this.formData.maxMileagePrice = data.maxMileagePrice;
					this.formData.remark = data.remark;
					this.val = `${config.API_URL}/applet?complanyId=${data.complany.id}=${data.id}=${this.payment}`;
				}
			});
		},
		submit() {
			this.$refs.form
				.validate()
				.then(data => {
					let func = this?.carId ? api.updateCar : api.addCar;
					let carPhotos = this.$refs.carPhotos.getFileList();
					if (carPhotos.length === 0) {
						carPhotos = this.carPhotos;
					}
					delete this?.formData?.carPhotos;
					delete this?.formData?.licenseFrontUrl;
					delete this?.formData?.licenseBackUrl;
					func({
						id: this.carId,
						licenseFrontUrl: this.licenseFrontUrl,
						licenseBackUrl: this.licenseBackUrl,
						carPhotos: carPhotos.join(','),
						complanyId: this.complanyId,
						...this.formData
					}).then(res => {
						if (res) {
							uni.showModal({
								title: '提示',
								content: '修改成功',
								showCancel: false,
								success: e => {
									uni.navigateBack();
									uni.$emit('car');
								}
							});
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
				})
				.catch(err => {
					uni.showModal({
						title: '提示',
						content: '必填项请填写完整',
						showCancel: false
					});
				});
		},
		reset() {
			this.$refs.form.resetFields();
		},
		sourceChange(e) {
			this.source = e.value;
			this.formData.source = e.value;
		},
		getLicenseFront(e = {}) {
			let { url, ocr } = e;
			this.licenseFrontUrl = url;
			this.formData.engineNum = ocr?.engineNumber;
			this.formData.carNum = ocr?.plateNumber;
			this.formData.carBrand = ocr?.model;
			this.formData.type = ocr?.vehicleType;
			this.formData.frameNum = ocr?.vin;
			this.formData.name = ocr?.owner;
		},
		getLicenseBack(e = {}) {
			let { url, ocr } = e;
			this.licenseBackUrl = url;
			this.formData.maxManned = ocr?.approvedPassengerCapacity;
			this.formData.fuelType = ocr?.energyType;
		},
		showMoreItems() {
			this.moreItemsFlag = !this.moreItemsFlag;
			this.iconType = this.iconType === 'arrowdown' ? 'arrowup' : 'arrowdown';
			this.moreTitle = this.moreTitle === '展开更多' ? '收起更多' : '展开更多';
		}
	}
};
</script>
<style lang="scss" scoped>
.backgroud_box {
	position: relative;
	display: flex;
	overflow-y: auto;
	align-items: center;
}

.title_img {
	width: 100%;
	height: 300rpx;
}

.qrcode_box {
	background-color: rgba($color: #000000, $alpha: 0.9);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100rpx;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0%;
	left: 0%;
	z-index: 999;
}

.more {
	text-align: center;
	margin-bottom: 20rpx;
}

.btnGrup {
	display: flex;
	flex-direction: row;
}

.rent_car {
	width: 60%;
	margin-bottom: 20rpx;
	margin-top: 20rpx;
}

.bottomBtn {
	flex: 1;
	margin: 0 10px 0 10px;
}

.form_box {
	width: 95%;
	background-color: #ffffff;
	border-radius: 10px;
	padding: 5px;
}
</style>
