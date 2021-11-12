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
			<text>租车人信息</text>
			<text>姓名：{{ (carInfo.driverUser || {}).name || '无' }}</text>
			<text>身份证号：{{ (carInfo.driverUser || {}).idcard || '无' }}</text>
			<text>手机号：{{ (carInfo.driverUser || {}).phoneNumber || '无' }}</text>
			<view>
				<text>是否续租：</text>
				<switch v-model="hasRelet" @change="changeRelet"></switch>
			</view>
			<uni-datetime-picker ref="pickerDate" class="reletDate" v-if="hasRelet" type="date" :value="reletDate" :start="dayjs().format('YYYY-MM-DD')" @change="changeDate"></uni-datetime-picker>
		</view>
		<view class="btn_box" v-if="!hasRelet">
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
	import {
		card15,
		card18,
		phoneRegex
	} from '../../../common/regex.js';
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
				current: 0,
				hasRelet: false,
				reletDate: '',
			};
		},
		onLoad(option) {
			this.getCarInfo(option.id);
		},
		methods: {
			changeRelet(e){
				this.hasRelet = e.detail.value;
			},
			changeDate(e){
				let selectDate = this.dayjs(e);
				let returnDate = this.dayjs(this.carInfo.estimateReturnTime);
				if(selectDate.isBefore(returnDate)){
					uni.showModal({
						content: '请选择正确的续租时间',
						showCancel: false,
					});
					return;
				}
				if(selectDate.diff(returnDate, 'day') < 1){
					uni.showModal({
						content: '续租最少一天',
						showCancel: false,
					});
					return;
				}
				api.reletCar({
					orderId: this.carInfo.wxOrder.orderId,
					carId: this.carInfo.id,
					beginTime: returnDate.format('YYYY-MM-DD HH:mm:ss'),
					endTime: selectDate.format('YYYY-MM-DD HH:mm:ss'),
					status: false,
				}).then(res => {
					if(res.data){
						uni.showModal({
							content: '续租成功',
							showCancel: false,
							success: () => {
								uni.navigateBack();
							}
						});
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg,
							success: (e) => {
								if(e.confirm){
									api.reletCar({
										orderId: this.carInfo.wxOrder.orderId,
										carId: this.carInfo.id,
										beginTime: returnDate.format('YYYY-MM-DD HH:mm:ss'),
										endTime: selectDate.format('YYYY-MM-DD HH:mm:ss'),
										status: true,
									}).then(result => {
										uni.showModal({
											content: '续租成功',
											showCancel: false,
											success: () => {
												uni.navigateBack();
											}
										})
									})
								}
							}
						});
					}
				});
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
						this.driverUser = res.data.driverUser || {};
					}
				});
			},
			normalReturnCar() {
				api.updateCarStatus({
					id: this.carInfo.id,
					status: 0
				}).then((res = {}) => {
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
			abnormalReturnCar() {
				uni.navigateTo({
					url: `/pages/model/returnCar/AbnormalReturnCar?id=${this.carInfo.id}&idcard=${this.carInfo.driverUser?.idcard}&phoneNumber=${this.carInfo.driverUser?.phoneNumber}&name=${this.carInfo.driverUser?.name}`
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
	.reletDate {
		margin-top: 20rpx;
	}
</style>
