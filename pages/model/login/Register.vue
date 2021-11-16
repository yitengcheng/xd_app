<template>
	<view class="content" style="align-items: center;background-color: #FFFFFF;">
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="280" :rules="rules" class="form_box">
			<FormUpload :formData="formData" name="photoComplanyCode" label="营业执照" :limit="1" @getOcrData="getComplantInfo" url="/tool/ocr/complany" />
			<FormUpload :formData="formData" name="idcardFront" label="法人身份证正面" :limit="1" @getOcrData="getIdcardFront" url="/tool/ocr/idcard?type=2" />
			<FormUpload :formData="formData" name="idcardBack" label="法人身份证背面" :limit="1" @getOcrData="getIdcardBack" url="/tool/ocr/idcard?type=3" />
			<FormInput v-show="flag === 3" :formData="formData" name="complanyName" label="公司名称" />
			<FormInput v-show="flag === 3" :formData="formData" name="creditCode" label="社会信用代码" />
			<FormInput v-show="flag === 3" :formData="formData" name="complanyCode" label="营业执照编号" />
			<FormInput v-show="flag === 3" :formData="formData" name="complanyYxq" label="营业执照有效期" />
			<FormInput v-show="flag === 3" :formData="formData" name="complanyAddress" label="注册地址" />
			<FormInput v-show="flag === 3" :formData="formData" name="juridiclName" label="法人姓名" />
			<FormInput v-show="flag === 3" :formData="formData" name="juridicalZjhm" label="法人身份证号" />
			<FormInput v-show="flag === 3" :formData="formData" name="capital" label="注册资本" />
			<FormInput v-show="flag === 3" :formData="formData" name="reallyCapital" label="实收资本" :required="false" />
			<FormInput v-show="flag === 3" :formData="formData" name="complanyType" label="公司类型" />
			<FormInput v-show="flag === 3" :formData="formData" name="establishTime" label="成立日期(yyyy年mm月dd日)" />
			<FormInput v-show="flag === 3" :formData="formData" name="componentType" label="组成类型" :required="false" />
			<FormInput v-show="flag === 3" :formData="formData" name="taxRegistration" label="税务登记号" :required="false" />
			<FormPickAddress v-show="flag === 3" :formData="formData" name="complanyAddressId" label="所属地区" @change="onChange" />
			<FormInput v-show="flag === 3" :formData="formData" name="phoneNumber" label="法人电话" />
			<FormInput v-show="flag === 3" :formData="formData" name="nature" label="经营范围" type="textarea" autoHeight />
			<view class="form_item" @click="setLogLat" v-show="flag === 3">
				<text>公司坐标：</text>
				<text>{{complanyAdName}}</text>
			</view>
			<u-button v-show="flag === 3" @click="submit" type="primary" class="submitBtn">注册</u-button>
			<u-button v-show="flag === 3" @click="reset" type="warn">重置</u-button>
		</uni-forms>
	</view>
</template>

<script>
import FormInput from '../../../components/form/FormInput.vue';
import FormUpload from '../../../components/form/FormUpload.vue';
import FormPickAddress from '../../../components/form/FormPickAddress.vue';
import { dateFormatCHRegex, phoneRegex, card15, card18 } from '../../../common/regex.js';
import api from '../../../api/index.js';
export default {
	components: {
		FormInput,
		FormUpload,
		FormPickAddress
	},
	data() {
		return {
			complanyAdName: '点击设置公司坐标',
			formData: {
				photoComplanyCode: [],
				idcardFront: [],
				idcardBack: [],
				complanyName: '',
				creditCode: '',
				complanyCode: '',
				complanyYxq: '',
				complanyAddress: '',
				complanyAddressId: '',
				juridiclName: '',
				juridicalZjhm: '',
				capital: '',
				reallyCapital: '',
				complanyType: '',
				establishTime: '',
				componentType: '',
				taxRegistration: '',
				phoneNumber: '',
				nature: '',
				wxminiLogin: '',
			},
			rules: {
				complanyName: { rules: [{ required: true, errorMessage: '请填写公司名称' }] },
				creditCode: { rules: [{ required: true, errorMessage: '请填写社会信用代码' }] },
				complanyCode: { rules: [{ required: true, errorMessage: '请填写营业执照编号' }] },
				complanyYxq: { rules: [{ required: true, errorMessage: '请填写营业执照有效期' }] },
				complanyAddress: { rules: [{ required: true, errorMessage: '请填写注册地址' }] },
				complanyAddressId: { rules: [{ required: true, errorMessage: '请选择所属地区' }] },
				juridiclName: { rules: [{ required: true, errorMessage: '请填写法人姓名' }] },
				juridicalZjhm: {
					rules: [
						{ required: true, errorMessage: '请填写法人身份证号' },
						{
							validateFunction: (rule, value, data, callback) => {
								if (value.length !== 15 || value.length !== 18) {
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
				capital: { rules: [{ required: true, errorMessage: '请填写注册资本' }] },
				complanyType: { rules: [{ required: true, errorMessage: '请填写公司类型' }] },
				establishTime: { rules: [{ required: true, errorMessage: '请填写成立日期' }, { pattern: dateFormatCHRegex, errorMessage: '请输入正确的成立日期' }] },
				phoneNumber: { rules: [{ required: true, errorMessage: '请填写法人电话' }, { pattern: phoneRegex, errorMessage: '请输入正确的法人电话号码' }] },
				nature: { rules: [{ required: true, errorMessage: '请填写经营范围' }] }
			},
			idCard: {},
			photoComplanyCode: '',
			idcardFront: '',
			idcardBack: '',
			flag: 1
		};
	},

	methods: {
		changeFlag() {
			if (this.photoComplanyCode && this.idcardFront && this.idcardBack) {
				this.flag = 3;
				uni.showToast({
					title: '请认真核对信息',
					icon: 'none'
				});
			}
		},
		setLogLat(){
			uni.chooseLocation({
				success: (res) => {
					this.complanyAdName = res.name;
					let latlon = this._.ceil(res.longitude, 5)  + ',' + this._.ceil(res.latitude, 5);
					this.formData.latitude = latlon;
				}
			})
		},
		getComplantInfo(e = {}) {
			let { url, ocr } = e;
			if (url && !!ocr) {
				this.photoComplanyCode = url;
				this.formData.complanyName = ocr.name;
				this.formData.creditCode = ocr.registerNumber;
				this.formData.nature = ocr.business;
				this.formData.complanyYxq = ocr.validPeriod;
				this.formData.complanyAddress = ocr.address;
				this.formData.juridiclName = ocr.legalPerson;
				this.formData.complanyType = ocr.type;
				this.formData.capital = ocr.capital;
				this.formData.establishTime = ocr.establishDate;
			}
			this.$nextTick(() => {
				this.changeFlag();
			});
		},
		getIdcardFront(e = {}) {
			let { url, ocr } = e;
			if (url && !!ocr) {
				this.idcardFront = url;
				this.formData.juridicalZjhm = ocr.idnumber;
				this.idCard = {
					address: ocr.address,
					idcard: ocr.idnumber,
					name: ocr.name,
					sex: ocr.gender === '男' ? 0 : 1,
					nation: ocr.nationality,
					...this.idCard
				};
			}
			this.$nextTick(() => {
				this.changeFlag();
			});
		},
		getIdcardBack(e = {}) {
			let { url, ocr } = e;
			if (url && !!ocr) {
				this.idcardBack = url;
				this.idCard = {
					lssueOffice: ocr.issue,
					lssueTime: ocr.startDate,
					invalidTime: ocr.endDate,
					...this.idCard
				};
			}
			this.$nextTick(() => {
				this.changeFlag();
			});
		},
		onChange(e) {
			this.formData.complanyAddressId = e[e.length - 1].value;
		},
		submit() {
			this.$refs.form.validate().then(res => {
				if (res.juridiclName === this.idCard.name) {
					delete res.photoComplanyCode;
					delete res.idcardFront;
					delete res.idcardBack;
					api.register({
						photoComplanyCode: this.photoComplanyCode,
						idcardFront: this.idcardFront,
						idcardBack: this.idcardBack,
						...this.idCard,
						...res
					}).then(() => {
						uni.showToast({
							title: '账号密码均为身份证后6位',
							icon: 'success'
						});
						uni.redirectTo({
							url: '/pages/model/login/Login'
						});
					});
				} else {
					uni.showToast({
						title: '上传身份证与法人不符',
						icon: 'error'
					});
				}
			});
		},
		reset() {
			this.$refs.form.resetFields();
		}
	}
};
</script>

<style lang="scss" scoped>
.submitBtn {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
}
.form_box {
	width: 90%;
	margin-bottom: 40rpx;
}
.form_item {
	display: flex;
	flex-direction: row;
}
</style>
