<template>
	<view class="content">
		<swiper class="swiper_box" @change="change">
			<swiper-item v-for="(item, index) in carInfo.carPhotos" :key="index"><image :src="item" class="swiper_img" mode="aspectFill"></image></swiper-item>
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
			<text>预约租车时间：{{ (carInfo.appointmentTime || '').split(',')[0] || '无' }}至{{ (carInfo.appointmentTime || '').split(',')[1] || '无' }}</text>
		</view>
		<view class="info_box">
			<text>下单人信息</text>
			<text>姓名：{{ appointmentUser.name || '无' }}</text>
			<text>身份证号：{{ appointmentUser.idCard || '无' }}</text>
			<text>手机号：{{ appointmentUser.phone || '无' }}</text>
		</view>
		<IdCardOcr @click="getIdCard" type="primary" />
		<view class="info_box">
			<uni-forms ref="form" v-model="formData" :rules="rules">
				<FormInput :formData="formData" name="name" label="姓名" />
				<FormInput :formData="formData" name="idCard" label="身份证号" />
				<FormInput :formData="formData" name="phone" label="手机号" />
				<FormRadio
					:required="false"
					:multiple="true"
					:formData="formData"
					name="check"
					:localdata="checkList"
					label="附加核验"
					@change="e => $refs.form.setValue('check', e.value)"
				/>
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
import { card15, card18, phoneRegex } from '../../../common/regex.js';
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
			appointmentUser: {},
			formData: {
				name: '',
				idCard: '',
				phone: '',
				check: []
			},
			checkList: [],
			rules: {
				name: { rules: [{ required: true, errorMessage: '请填写姓名' }] },
				idCard: {
					rules: [
						{ required: true, errorMessage: '请填写身份证号' },
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
				phone: { rules: [{ required: true, errorMessage: '请填写手机号' }, { pattern: phoneRegex, errorMessage: '请输入正确的法人电话号码' }] }
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
			api.carInfo(id).then((res = {}) => {
				if (res.data) {
					let tmp = [];
					res.data.carPhotos.split(',').forEach(o => {
						tmp.push(`${config.IMG_URL}${o}`);
					});
					delete res.data.carPhotos;
					this.carInfo = { carPhotos: tmp, ...res.data };
					this.appointmentUser = res.data.appointmentUser || {};
					this.$refs.form.setValue('name', (res.data.appointmentUser || {}).name);
					this.$refs.form.setValue('idCard', (res.data.appointmentUser || {}).idCard);
					this.$refs.form.setValue('phone', (res.data.appointmentUser || {}).phone);
				}
			});
		},
		getIdCard(e = {}) {
			let { url } = e;
			let { words_result } = e.ocr;
			if (url && !!words_result) {
				this.$refs.form.setValue('name', words_result.姓名.words);
				this.$refs.form.setValue('idCard', words_result.公民身份号码.words);
			}
		},
		submit() {
			this.$refs.form.validate().then(data => {
				let checks = [];
				this.checkList.forEach(o => {
					data.check.forEach(item => {
						o.value === item && checks.push(o.text);
					});
				});
				uni.navigateTo({
					url: `/pages/model/InCar/Step?checks=${checks}`
				});
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
