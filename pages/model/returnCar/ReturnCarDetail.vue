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
			<text>租车人信息</text>
			<text>姓名：{{ driverUser.name || '无' }}</text>
			<text>身份证号：{{ driverUser.idCard || '无' }}</text>
			<text>手机号：{{ driverUser.phone || '无' }}</text>
		</view>
		<view class="btn_box">
			<button type="primary" @click="normalReturnCar">正常一键还车</button>
			<button class="exception_btn" @click="abnormalReturnCar">异常还车</button>
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
			driverUser: {},
			current: 0
		};
	},
	onLoad(option) {
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
					this.driverUser = res.data.driverUser || {};
				}
			});
		},
		normalReturnCar(){
			api.updateCarStatus({
				id: this.carInfo.id,
				status: 0
			}).then((res={}) => {
				if(res.msg){
					uni.showToast({
						title: res.msg,
						icon:'error'
					});
					return;
				}
				uni.showToast({
					title: '还车成功',
					icon: 'success',
					success: () => {
						uni.switchTab({
							url: '/pages/model/car/Car',
							success: () => {
								uni.$emit('returnCar')
							}
						});
					}
				});
			});
		},
		abnormalReturnCar(){
			uni.navigateTo({
				url: `/pages/model/returnCar/AbnormalReturnCar?id=${this.carInfo.id}`
			})
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
.btn_box {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-top: 50rpx;
}
.exception_btn {
	background-color: #E6A23C;
}
</style>
