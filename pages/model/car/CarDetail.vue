<template>
	<view>
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="280" :rules="rules">
			<FormUpload
				:required="false"
				:readonly="disabled"
				:formData="formData"
				name="registrationUrl"
				label="机动车登记本"
				:limit="1"
				@getOcrData="getRegistration"
				url="/tool/ocr/registration"
			/>
			<FormUpload
				:readonly="disabled"
				:formData="formData"
				name="licenseFrontUrl"
				label="行驶证正面"
				:limit="1"
				@getOcrData="getLicenseFront"
				url="/tool/ocr/license"
				:otherData="{ type: 6 }"
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
			/>
			<FormUpload ref="carPhotos" :readonly="disabled" :formData="formData" name="carPhotos" label="车辆图片" />
			<FormPicker
				v-show="(complany || []).length > 1"
				:disabled="disabled"
				:formData="formData"
				name="complanyId"
				:localdata="complany"
				label="所属公司"
				@change="e => $refs.form.setValue('complanyId', [e.value])"
			/>
			<FormPicker :disabled="disabled" :formData="formData" name="source" :localdata="sourceType" label="车辆来源" @change="sourceChange" />
			<FormPicker
				:disabled="disabled"
				:formData="formData"
				name="operatorId"
				:localdata="gpsVendorType"
				label="GPS厂商"
				@change="e => $refs.form.setValue('operatorId', e.value)"
			/>
			<FormInput :disabled="disabled" :formData="formData" name="carNum" label="车牌号" />
			<FormInput :disabled="disabled" :formData="formData" name="carBrand" label="车辆品牌" />
			<FormInput :disabled="disabled" :formData="formData" name="model" label="车辆型号" />
			<FormPicker :disabled="disabled" :formData="formData" name="type" :localdata="carType" label="车辆类型" @change="e => $refs.form.setValue('type', e.value)" />
			<FormInput :disabled="disabled" :formData="formData" name="color" label="车身颜色" />
			<FormInput :disabled="disabled" :formData="formData" name="frameNum" label="车架号" />
			<FormInput :disabled="disabled" :formData="formData" name="engineNum" label="发动机号" />
			<FormInput :disabled="disabled" :formData="formData" name="maxManned" label="荷载人数" />
			<FormPicker
				:disabled="disabled"
				:formData="formData"
				name="fuelType"
				label="燃油编号"
				:localdata="gasolineType"
				@change="e => $refs.form.setValue('fuelType', e.value)"
			/>
			<FormInput :disabled="disabled" :formData="formData" name="thirdLiabilityInsurance" :candidates="['30', '50', '100']" label="第三者责任险(万元)" />
			<FormSwitch :disabled="disabled" :formData="formData" name="thirdNoDeductible" type="checkbox" label="第三者责任险是否不计免赔" />
			<FormPicker
				:disabled="disabled"
				:formData="formData"
				name="lossInsurance"
				:localdata="lossInsuranceType"
				label="机动车损失险"
				@change="e => $refs.form.setValue('lossInsurance', e.value)"
			/>
			<FormSwitch :disabled="disabled" :formData="formData" name="lossNoDeductible" type="checkbox" label="机动车损失险是否不计免赔" />
			<FormInput :disabled="disabled" :formData="formData" name="price" label="车辆价值(元)" />
			<FormInput :disabled="disabled" :formData="formData" name="unitPrice" label="租车单价(元/天)" />
			<FormInput v-show="source !== '1'" :disabled="disabled" :formData="formData" name="name" label="车主姓名" />
			<FormInput v-show="source !== '1'" :disabled="disabled" :formData="formData" name="idcard" label="车主身份证号" />
			<FormInput :disabled="disabled" :formData="formData" name="phoneNum" label="车主手机号码" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="bondMoney" label="租车保证金(元)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="violationBondMoney" label="违章保证金(元)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="strongEndTime" label="交强险到期时间(格式:yyyy-mm-dd)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="businessEndTime" label="商业险到期时间 (格式:yyyy-mm-dd)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="annualReview" label="年审到期时间 (格式:yyyy-mm-dd)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="maxMileage" label="每日平均最高行驶里程(公里)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="maxMileagePrice" label="超过里程每公里收取金额(公里)" :required="false" />
			<FormInput :disabled="disabled" v-show="moreItemsFlag" :formData="formData" name="remark" label="车辆备注说明" :required="false" autoHeight type="textarea" />
			<view class="more" @click="showMoreItems">
				{{ moreTitle }}
				<uni-icons :type="iconType"></uni-icons>
			</view>
			<view class="btnGrup" v-show="!disabled">
				<button @click="submit" type="primary">{{ submitText }}</button>
				<button @click="reset" type="warn">重置</button>
			</view>
		</uni-forms>
		<uni-fab v-show="carId" :content="content" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger"></uni-fab>
	</view>
</template>

<script>
import FormInput from '../../../components/form/FormInput.vue';
import FormPicker from '../../../components/form/FormPicker.vue';
import FormRadio from '../../../components/form/FormRadio.vue';
import FormSwitch from '../../../components/form/FormSwitch.vue';
import FormUpload from '../../../components/form/FormUpload.vue';
import { plateRegex, integerRegex, positiveRegex, socialCodeRegex, card18, card15, phoneRegex, dateFormatRegex } from '../../../common/regex.js';
import api from '../../../api/index.js';
import config from '../../../common/config.js';
export default {
	components: {
		FormInput,
		FormPicker,
		FormRadio,
		FormSwitch,
		FormUpload
	},
	data() {
		return {
			rules: {
				carPhotos: { rules: [{ required: true, errorMessage: '请上传至少一张车辆照片' }] },
				licenseFrontUrl: { rules: [{ required: true, errorMessage: '请上传行驶证正面照片' }] },
				licenseBackUrl: { rules: [{ required: true, errorMessage: '请上传行驶证背面照片' }] },
				source: { rules: [{ required: true, errorMessage: '请选择车辆来源' }] },
				operatorId: { rules: [{ required: true, errorMessage: '请选择gps厂商' }] },
				carNum: {
					rules: [{ required: true, errorMessage: '请输入车牌号' }, { pattern: plateRegex, errorMessage: '请输入正确的车牌号' }]
				},
				carBrand: { rules: [{ required: true, errorMessage: '请输入车辆品牌' }] },
				model: { rules: [{ required: true, errorMessage: '请输入车辆型号' }] },
				type: { rules: [{ required: true, errorMessage: '请选择车辆类型' }] },
				color: { rules: [{ required: true, errorMessage: '请输入车辆颜色' }] },
				frameNum: { rules: [{ required: true, errorMessage: '请输入车架号号' }] },
				engineNum: { rules: [{ required: true, errorMessage: '请输入发动机号' }] },
				maxManned: { rules: [{ required: true, errorMessage: '请输入荷载人数' }] },
				fuelType: { rules: [{ required: true, errorMessage: '请选择燃油编号' }] },
				thirdLiabilityInsurance: { rules: [{ required: true, errorMessage: '请输入第三者责任险' }, { pattern: integerRegex, errorMessage: '请输入正确的三责险金额' }] },
				thirdNoDeductible: { rules: [{ required: true, errorMessage: '请选择第三者责任险是否不计免赔' }] },
				lossInsurance: { rules: [{ required: true, errorMessage: '请选择机动车损失险' }] },
				lossNoDeductible: { rules: [{ required: true, errorMessage: '请选择机动车损失险是否不计免赔' }] },
				price: { rules: [{ required: true, errorMessage: '请输入车辆价值' }, { pattern: positiveRegex, errorMessage: '请输入正确的车辆价值' }] },
				unitPrice: { rules: [{ required: true, errorMessage: '请输入租车单价' }, { pattern: positiveRegex, errorMessage: '请输入租车单价' }] },
				name: { rules: [{ required: true, errorMessage: '请输入姓名' }, { maxLength: 60, errorMessage: '车主姓名长度不能超过60个字符' }] },
				cardId: {
					rules: [
						{ required: true, errorMessage: '请输入车主身份证' },
						{
							validateFunction: (rule, value, data, callback) => {
								if(value.length !==15 || value.length !== 18){
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
				phoneNum: { rules: [{ required: true, errorMessage: '请输入车主电话号码' }, { pattern: phoneRegex, errorMessage: '请输入正确的车辆价值' }] },
				bondMoney: { rules: [{ pattern: positiveRegex, errorMessage: '请输入正确的租车保证金' }] },
				violationBondMoney: { rules: [{ pattern: positiveRegex, errorMessage: '请输入正确的违章保证金' }] },
				strongEndTime: { rules: [{ pattern: dateFormatRegex, errorMessage: '请输入正确的交强险到期时间' }] },
				businessEndTime: { rules: [{ pattern: dateFormatRegex, errorMessage: '请输入正确的商业险到期时间' }] },
				annualReview: { rules: [{ pattern: dateFormatRegex, errorMessage: '请输入正确的年审到期时间' }] },
				maxMileage: { rules: [{ pattern: integerRegex, errorMessage: '请输入正确的每日平均里程' }] },
				maxMileagePrice: { rules: [{ pattern: positiveRegex, errorMessage: '请输入正确的超过里程每公里收取金额' }] }
			},
			formData: {
				registrationUrl: [],
				licenseFrontUrl: [],
				licenseBackUrl: [],
				carPhotos: [],
				source: '',
				operatorId: '',
				carNum: '',
				carBrand: '',
				model: '',
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
				remark: ''
			},
			sourceType: [],
			carType: [],
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
			registrationUrl: '',
			moreTitle: '展开更多',
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
				}
			],
			submitText: '添加',
			complany: [],
			user: uni.getStorageSync('user'),
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.type === 'add' ? '添加车辆' : '车辆详情'
		});
		this.disabled = option.type === 'add' ? false : true;
		this.submitText = option.type === 'add' ? '添加' : '编辑';
		this.getGpsList();
		this.dictInit('car_type', 'sources_vehicle', 'fuel_number', 'insurance_status').then(() => {
			this.carType = uni.getStorageSync('car_type');
			this.sourceType = uni.getStorageSync('sources_vehicle');
			this.gasolineType = uni.getStorageSync('fuel_number');
			this.lossInsuranceType = uni.getStorageSync('insurance_status');
		});
		this.carId = option.id;
	},
	mounted() {
		this.carId && this.getCarInfo(this.carId);
		(this.user.complany || []).length > 1 && this.user.complany.forEach(o => {
			this.complany.push({value: o.id, text: o.complanyName});
		})
	},
	methods: {
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
						tmp.push({ value: item.id, text: item.complanyName });
					});
					this.gpsVendorType = tmp;
				}
			});
		},
		getCarInfo(id) {
			api.carInfo(id).then((res = {}) => {
				let { data } = res;
				if (data) {
					let files = data.carPhotos.split(',');
					let carsPhotos = [];
					let licenseBack = [];
					let licenseFront = [];
					let registrationUrl = [];
					files.forEach((item, index) => {
						let extname = item.substring(item.lastIndexOf('.') + 1);
						let name = item.substring(item.lastIndexOf('/') + 1);
						carsPhotos.push({
							name,
							extname,
							url: `${config.IMG_URL}${item}`
						});
					});
					licenseBack.push({
						name: data.licenseBackUrl.substring(data.licenseBackUrl.lastIndexOf('/') + 1),
						extname: data.licenseBackUrl.substring(data.licenseBackUrl.lastIndexOf('.') + 1),
						url: `${config.IMG_URL}${data.licenseBackUrl}`
					});
					licenseFront.push({
						name: data.licenseFrontUrl.substring(data.licenseFrontUrl.lastIndexOf('/') + 1),
						extname: data.licenseFrontUrl.substring(data.licenseFrontUrl.lastIndexOf('.') + 1),
						url: `${config.IMG_URL}${data.licenseFrontUrl}`
					});
					data.registrationUrl &&
						registrationUrl.push({
							name: data.registrationUrl.substring(data.registrationUrl.lastIndexOf('/') + 1),
							extname: data.registrationUrl.substring(data.registrationUrl.lastIndexOf('.') + 1),
							url: `${config.IMG_URL}${data.registrationUrl}`
						});
					this.source = data.source;
					this.$refs.form.setValue('carPhotos', carsPhotos);
					this.$refs.form.setValue('licenseFrontUrl', licenseFront);
					this.$refs.form.setValue('licenseBackUrl', licenseBack);
					this.$refs.form.setValue('registrationUrl', registrationUrl);
					this.$refs.form.setValue('source', data.source);
					this.$refs.form.setValue('operatorId', data.operatorId);
					this.$refs.form.setValue('carNum', data.carNum);
					this.$refs.form.setValue('carBrand', data.carBrand);
					this.$refs.form.setValue('model', data.model);
					this.$refs.form.setValue('type', data.type);
					this.$refs.form.setValue('color', data.color);
					this.$refs.form.setValue('frameNum', data.frameNum);
					this.$refs.form.setValue('engineNum', data.engineNum);
					this.$refs.form.setValue('maxManned', data.maxManned);
					this.$refs.form.setValue('fuelType', data.fuelType);
					this.$refs.form.setValue('thirdLiabilityInsurance', data.thirdLiabilityInsurance);
					this.$refs.form.setValue('thirdNoDeductible', data.thirdNoDeductible);
					this.$refs.form.setValue('lossInsurance', data.lossInsurance);
					this.$refs.form.setValue('lossNoDeductible', data.lossNoDeductible);
					this.$refs.form.setValue('price', data.price);
					this.$refs.form.setValue('unitPrice', data.unitPrice);
					this.$refs.form.setValue('name', data.name);
					this.$refs.form.setValue('phoneNum', data.phoneNum);
					this.$refs.form.setValue('bondMoney', data.bondMoney);
					this.$refs.form.setValue('violationBondMoney', data.violationBondMoney);
					this.$refs.form.setValue('strongEndTime', data.strongEndTime);
					this.$refs.form.setValue('businessEndTime', data.businessEndTime);
					this.$refs.form.setValue('annualReview', data.annualReview);
					this.$refs.form.setValue('maxMileage', data.maxMileage);
					this.$refs.form.setValue('maxMileagePrice', data.maxMileagePrice);
					this.$refs.form.setValue('remark', data.remark);
				}
			});
		},
		submit() {
			this.$refs.form
				.validate()
				.then(data => {
					let func = this.carId ? api.updateCar : api.addCar;
					data.complanyId = data.complanyId ? data.complanyId : this._.map(this.user.complany, 'id').join(','); 
					delete data.carPhotos;
					delete data.licenseFrontUrl;
					delete data.licenseBackUrl;
					delete data.registrationUrl;
					let carPhotos = this.$refs.carPhotos.getFileList();
					func({
						id: this.carId,
						licenseFrontUrl: this.licenseFrontUrl,
						licenseBackUrl: this.licenseBackUrl,
						registrationUrl: this.registrationUrl,
						carPhotos: carPhotos.join(','),
						...data
					}).then((res = {}) => {
						if (res.data) {
							uni.navigateBack();
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
				});
		},
		reset() {
			this.$refs.form.resetFields();
		},
		sourceChange(e) {
			this.source = e.value;
			this.$refs.form.setValue('source', e.value);
		},
		getRegistration(e = {}) {
			let { url } = e;
			let { words_result } = e.ocr;
			if (url && !!words_result) {
				let n_i_n = words_result.name_idcard_no.words;
				let name = n_i_n.substring(0, n_i_n.indexOf('/'));
				let idcard = n_i_n.substring(n_i_n.lastIndexOf('/') + 1);
				this.registrationUrl = url;
				this.$refs.form.setValue('color', words_result.body_color.words);
				this.$refs.form.setValue('engineNum', words_result.engine_num.words);
				this.$refs.form.setValue('name', name);
				this.$refs.form.setValue('idcard', idcard);
				this.$refs.form.setValue('nature', words_result.nature_of_use.words);
				this.$refs.form.setValue('nature', words_result.nature_of_use.words);
				this.$refs.form.setValue('carNum', words_result.registration_num.words);
				this.$refs.form.setValue('maxManned', words_result.seating_capacity.words);
				this.$refs.form.setValue('model', words_result.vehicle_model.words);
				this.$refs.form.setValue('type', words_result.vehicle_type.words);
			}
		},
		getLicenseFront(e = {}) {
			let { url } = e;
			let { words_result } = e.ocr;
			if (url && !!words_result) {
				this.licenseFrontUrl = url;
				this.$refs.form.setValue('engineNum', words_result.发动机号码.words);
				this.$refs.form.setValue('carNum', words_result.号牌号码.words);
				this.$refs.form.setValue('carBrand', words_result.品牌型号.words);
				this.$refs.form.setValue('type', words_result.车辆类型.words);
				this.$refs.form.setValue('frameNum', words_result.车辆识别代号.words);
			}
		},
		getLicenseBack(e = {}) {
			let { url } = e;
			let { words_result } = e.ocr;
			if (url && !!words_result) {
				this.licenseBackUrl = url;
				this.$refs.form.setValue('maxManned', words_result.核定载人数.words);
				this.$refs.form.setValue('fuelType', words_result.燃油类型.words);
			}
		},
		showMoreItems() {
			this.moreItemsFlag = !this.moreItemsFlag;
			this.iconType = this.iconType === 'arrowdown' ? 'arrowup' : 'arrowdown';
			this.moreTitle = this.moreTitle === '展开更多' ? '收起更多' : '展开更多';
		},
	}
};
</script>

<style lang="scss">
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
</style>
