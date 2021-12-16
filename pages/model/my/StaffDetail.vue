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
				<FormInput :formData="formData" name="realName" label="姓名" decoration :disabled="disabled"></FormInput>
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
					name="address"
					label="地址"
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
					name="phonenumber"
					label="用户电话"
					decoration
					type="number"
					:disabled="disabled"
				></FormInput>
				<FormInput
					v-if="!staffId"
					:formData="formData"
					name="password"
					label="登录密码"
					decoration
					type="password"
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
		FormPicker,
	},
	onLoad(option) {
		this.staffId = option?.id;
		option?.id && this.initStaff(option?.id);
		if(option?.edit === 'look') this.disabled = true
	},
	data() {
		return {
			formData: {
				idcardFront: [],
				realName: '',
				idcard: '',
				sex: 0,
				nation: '',
				address: '',
				birthday: '',
				phonenumber: '',
				password: '',
			},
			rules: {
				realName: {
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
				phonenumber: {
					rules: [
						{
							required: true,
							errorMessage: '请填写电话号码',
						},
					],
				},
			},
			idcardFront: '',
			sexList: [{ value: 0, text: '男' }, { value: 1, text: '女' }],
			staffId: undefined,
			disabled: false,
		};
	},
	methods: {
		getIdCard(e = {}) {
			let { url, ocr } = e;
			this.formData.idcardFront = [formattingPhoto(url)];
			this.idcardFront = url;
			this.formData.realName = ocr?.name;
			this.formData.idcard = ocr?.idnumber;
			this.formData.address = ocr?.address;
			this.formData.birthday = ocr?.birthday ? this.dayjs(ocr?.birthday) : '';
			this.formData.sex = ocr?.gender === '男' ? 0 : 1;
			this.nation = ocr?.nationality;
		},
		changeSex(e) {
			this.formData.sex = e.value;
		},
		sumbit() {
			let func = this.staffId ? api.updateStaff :  api.addStaff;
			delete this.formData.idcardFront;
			this.$refs.form.validate().then(async () => {
				const res = await func({
					...this.formData,
					complanyId: uni.getStorageSync('complanyId'),
					idcardFront: this.idcardFront,
				});
				if (res) {
					uni.$emit('staff');
					uni.navigateBack();
				}
			});
		},
		reset() {
			this.$refs.form.resetFields();
		},
		async initStaff(id) {
			const res = await api.staffDetail(id);
			if (res) {
				let idcardFront = [formattingPhoto(res.data.idcardFront)];
				this.idcardFront = res.data.idcardFront;
				delete res.data.idcardFront;
				this.formData = {
					idcardFront,
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
