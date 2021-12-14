<template>
	<view class="content" style="align-items: center;">
		<view class="info_box">
			<uni-forms ref="form" v-model="formData" :rules="rules" :labelWidth="120">
				<FormUpload
					:formData="formData"
					name="idcardFront"
					label="身份证"
					:limit="1"
					@getOcrData="getIdCard"
					url="/tool/ocr/idcard?type=2"
					:required="false"
					:disabled="disabled"
				></FormUpload>
				<FormUpload
					:formData="formData"
					name="licenseMainUrl"
					label="驾照主页"
					:limit="1"
					@getOcrData="getLicenseMain"
					url="/tool/ocr/driving?type=8"
					:disabled="disabled"
					:required="false"
				></FormUpload>
				<FormUpload
					:formData="formData"
					name="licenseViceUrl"
					label="驾照副页"
					:limit="1"
					@getOcrData="getLicenseVice"
					:disabled="disabled"
					url="/tool/ocr/driving?type=9"
					:required="false"
				></FormUpload>
				<FormInput :formData="formData" name="name" label="姓名" decoration :disabled="disabled"></FormInput>
				<FormInput
					:formData="formData"
					name="idcard"
					label="身份证号"
					decoration
					type="idcard"
					:disabled="disabled"
				></FormInput>
				<FormPicker
					:formData="formData"
					name="sex"
					label="性别"
					:localdata="sexList"
					decoration
					@change="changeSex"
					:disabled="disabled"
				/>
				<FormInput :formData="formData" name="nation" label="民族" decoration :disabled="disabled"></FormInput>
				<FormInput
					:formData="formData"
					name="driveType"
					label="准驾车型"
					decoration
					:disabled="disabled"
				></FormInput>
				<FormInput
					:formData="formData"
					name="archivesNum"
					label="档案编号"
					decoration
					:disabled="disabled"
				></FormInput>
				<FormDatePicker
					:formData="formData"
					name="receiveCarTime"
					label="初次领证日期"
					@change="changeReceiveCarTime"
					decoration
					:disabled="disabled"
				></FormDatePicker>
				<FormDatePicker
					:formData="formData"
					name="invalidCarTime"
					label="驾照有效期"
					@change="changeInvalidCarTime"
					decoration
					:disabled="disabled"
				></FormDatePicker>
				<FormInput
					:formData="formData"
					name="address"
					label="身份证地址"
					decoration
					:disabled="disabled"
				></FormInput>
				<FormInput
					:formData="formData"
					name="birthday"
					label="出生日期"
					decoration
					:disabled="disabled"
				></FormInput>
				<FormInput
					:formData="formData"
					name="phoneNumber"
					label="用户电话"
					decoration
					type="number"
					:disabled="disabled"
				></FormInput>
				<FormInput
					:formData="formData"
					name="nowAddress"
					label="现居住地"
					decoration
					:required="false"
					:disabled="disabled"
				></FormInput>
				<FormInput
					:formData="formData"
					name="urgentConcat"
					label="紧急联系人"
					decoration
					:disabled="disabled"
				></FormInput>
				<FormInput
					:formData="formData"
					name="urgentPhone"
					label="紧急联系电话"
					decoration
					type="number"
					:disabled="disabled"
				></FormInput>
			</uni-forms>
		</view>
		<u-button v-if="!this.disabled" type="primary" @click="sumbit" class="bottom_btn">保存</u-button>
		<u-button v-if="!this.disabled" type="error" @click="reset" class="bottom_btn">重置</u-button>
	</view>
</template>

<script>
import FormUpload from '../../../components/form/FormUpload.vue';
import FormInput from '../../../components/form/FormInput.vue';
import FormPicker from '../../../components/form/FormPicker.vue';
import FormDatePicker from '../../../components/form/FormDatePicker.vue';
import api from '../../../api/index.js';
import { formattingPhoto } from '../../../common/utils.js';
export default {
	components: {
		FormUpload,
		FormInput,
		FormDatePicker,
		FormPicker,
	},
	onLoad(option) {
		this.customerId = option?.id;
		option?.id && this.initCustomer(option?.id);
		if(option?.edit === 'look') this.disabled = true
	},
	data() {
		return {
			formData: {
				idcardFront: [],
				licenseMainUrl: [],
				licenseViceUrl: [],
				name: '',
				idcard: '',
				sex: 0,
				nation: '',
				driveType: '',
				archivesNum: '',
				receiveCarTime: '',
				invalidCarTime: '',
				address: '',
				birthday: '',
				phoneNumber: '',
				nowAddress: '',
				urgentConcat: '',
				urgentPhone: '',
			},
			rules: {
				name: {
					rules: [
						{
							required: true,
							errorMessage: '请填写姓名',
						},
					],
				},
				idcard: {
					rules: [
						{
							required: true,
							errorMessage: '请填写身份证',
						},
					],
				},
				sex: {
					rules: [
						{
							required: true,
							errorMessage: '请选择性别',
						},
					],
				},
				nation: {
					rules: [
						{
							required: true,
							errorMessage: '请填写民族',
						},
					],
				},
				driveType: {
					rules: [
						{
							required: true,
							errorMessage: '请填写准驾车型',
						},
					],
				},
				archivesNum: {
					rules: [
						{
							required: true,
							errorMessage: '请填写驾驶证档案编号',
						},
					],
				},
				receiveCarTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择初次领证日期',
						},
					],
				},
				invalidCarTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择驾照有效期',
						},
					],
				},
				address: {
					rules: [
						{
							required: true,
							errorMessage: '请填写身份证地址',
						},
					],
				},
				birthday: {
					rules: [
						{
							required: true,
							errorMessage: '请填写出生日期',
						},
					],
				},
				phoneNumber: {
					rules: [
						{
							required: true,
							errorMessage: '请填写电话号码',
						},
					],
				},
				urgentConcat: {
					rules: [
						{
							required: true,
							errorMessage: '请填写紧急联系人',
						},
					],
				},
				urgentPhone: {
					rules: [
						{
							required: true,
							errorMessage: '请填写紧急联系电话',
						},
					],
				},
			},
			licenseMainUrl: '',
			licenseViceUrl: '',
			idcardFront: '',
			sexList: [{ value: 0, text: '男' }, { value: 1, text: '女' }],
			customerId: undefined,
			disabled: false,
		};
	},
	methods: {
		getIdCard(e = {}) {
			let { url, ocr } = e;
			this.formData.idcardFront = [formattingPhoto(url)];
			this.idcardFront = url;
			this.formData.name = ocr?.name;
			this.formData.idcard = ocr?.idnumber;
			this.formData.address = ocr?.address;
			this.formData.birthday = ocr?.birthday ? this.dayjs(ocr?.birthday) : '';
			this.formData.sex = ocr?.gender === '男' ? 0 : 1;
			this.nation = ocr?.nationality;
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
			this.formData.archivesNum = ocr?.archiveNumber;
		},
		changeReceiveCarTime(e) {
			this.formData.receiveCarTime = e;
		},
		changeInvalidCarTime(e) {
			this.formData.invalidCarTime = e;
		},
		changeSex(e) {
			this.formData.sex = e.value;
		},
		sumbit() {
			let func = this.customerId ? api.updateCustomer :  api.addCustomer;
			delete this.formData.idcardFront;
			delete this.formData.licenseMainUrl;
			delete this.formData.licenseViceUrl;
			this.$refs.form.validate().then(async () => {
				const res = await func({
					...this.formData,
					complanyId: uni.getStorageSync('complanyId'),
					idcardFront: this.idcardFront,
					licenseMainUrl: this.licenseMainUrl,
					licenseViceUrl: this.licenseViceUrl,
				});
				if (res) {
					uni.navigateBack();
				}
			});
		},
		reset() {
			this.$refs.form.resetFields();
		},
		async initCustomer(id) {
			const res = await api.customerDetail(id);
			if (res) {
				let idcardFront = [formattingPhoto(res.data.idcardFront)];
				this.idcardFront = res.data.idcardFront;
				let licenseMainUrl = [formattingPhoto(res.data.licenseMainUrl)];
				this.licenseMainUrl = res.data.licenseMainUrl;
				let licenseViceUrl = [formattingPhoto(res.data.licenseViceUrl)];
				this.licenseViceUrl = res.data.licenseViceUrl;
				delete res.data.idcardFront;
				delete res.data.licenseMainUrl;
				delete res.data.licenseViceUrl;
				this.formData = {
					idcardFront,
					licenseMainUrl,
					licenseViceUrl,
					...res.data,
				};
			}
		},
	},
};
</script>

<style lang="scss">
.info_box {
	width: 90%;
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: #ffffff;
	border-radius: 10px;
	margin-bottom: 10px;
}
.bottom_btn {
	width: 80vw;
	margin-top: 10px;
}
</style>
