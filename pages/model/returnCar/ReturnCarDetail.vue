<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box" @change="change">
			<swiper-item v-for="(item, index) in carInfo.carPhotos" :key="index">
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
			<text>【租车单价】{{ ((carInfo || {}).wxOrder || {}).unitPrice || '无' }} 元/天</text>
			<text>【租车保证金】{{ ((carInfo || {}).wxOrder || {}).bondMoney || '无' }} 元</text>
			<text>【违章保证金】{{ ((carInfo || {}).wxOrder || {}).violationBondMoney || '无' }} 元</text>
			<text>【租车时间】{{ dayjs(((carInfo || {}).wxOrder || {}).wantCarTime).format('YYYY-MM-DD')}}至{{ dayjs(((carInfo || {}).wxOrder || {}).estimateReturnTime).format('YYYY-MM-DD')}}</text>
			<text>【租车天数】{{ ((carInfo || {}).wxOrder || {}).rentCarDays }} 天</text>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>租车人信息</text>
			</view>
			<view class="line"></view>
			<text>【姓名】{{ (carInfo.driverUser || {}).name || '无' }}</text>
			<text>【身份证号】{{ (carInfo.driverUser || {}).idcard || '无' }}</text>
			<text>【手机号】{{ (carInfo.driverUser || {}).phoneNumber || '无' }}</text>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>操作</text>
			</view>
			<view class="line"></view>
			<view class="margin_box">
				<text>【是否续租】</text>
				<u-switch v-model="hasRelet" @change="changeRelet" active-color="#FFD101"></u-switch>
			</view>
			<uni-datetime-picker ref="pickerDate" class="reletDate" v-if="hasRelet" type="date" :value="reletDate" :start="dayjs(((carInfo || {}).wxOrder || {}).estimateReturnTime).format('YYYY-MM-DD')" @change="changeDate"></uni-datetime-picker>
			<view v-if="!hasRelet" class="margin_box">
				<text>【已扣除租车保证金】</text>
				<u-input v-model="deductBondMoney" placeholder="请输入已扣除租车保证金" type="number" border="bottom" shape="circle" inputAlign="right"></u-input>
				<text>元</text>
			</view>
		</view>
		<view class="btn_box" v-if="!hasRelet">
			<u-button class="btn" type="primary" @click="normalReturnCar">正常一键还车</u-button>
			<u-button class="btn" @click="abnormalReturnCar">异常还车</u-button>
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
				deductBondMoney: 0,
			};
		},
		onLoad(option) {
			this.getCarInfo(option.id);
		},
		methods: {
			changeRelet(e){
				this.hasRelet = e;
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
				if(this.deductBondMoney * 1 > this.carInfo?.wxOrder?.bondMoney * 1){
					uni.showModal({
						title: '提示',
						content: '扣除的租车保证金已超过已缴纳的租车保证金，请确认后重新输入',
						showCancel:false,
					});
					return;
				} else {
					uni.showModal({
						title: '提示',
						content: `请退${this.carInfo?.wxOrder?.bondMoney * 1 - this.deductBondMoney * 1}元的租车保证金`,
						success: (e) => {
							if(e.confirm) {
								api.updateCarStatus({
									id: this.carInfo.id,
									deductBondMoney: this.deductBondMoney,
									status: 0
								}).then((res = {}) => {
									uni.showToast({
										title: '还车成功',
										icon: 'success',
										success: () => {
											uni.switchTab({
												url: '/pages/model/car/Car',
												success: () => {
													uni.$emit('returnCar');
													uni.$emit('car');
												}
											});
										}
									});
								});
							}
						},
					});
				}
			},
			abnormalReturnCar() {
				uni.navigateTo({
					url: `/pages/model/returnCar/AbnormalReturnCar?id=${this.carInfo.id}&idcard=${this.carInfo.driverUser?.idcard}&phoneNumber=${this.carInfo.driverUser?.phoneNumber}&name=${this.carInfo.driverUser?.name}&bondMoney=${this.carInfo.wxOrder?.bondMoney}&money=${this.deductBondMoney}`
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.swiper_box {
		width: 100%;
		height: 300rpx;
		margin-bottom: 10px;
	}

	.swiper_img {
		width: 100%;
		height: 300rpx;
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
	.adorn {
		width: 3px;
		height: 60%;
		background-color: #FFD101;
		margin-right: 5px;
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
	.btn_box {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 50rpx;
	}

	.btn {
		width: 90%;
		margin-top: 20px;
	}
	.reletDate {
		margin-top: 20rpx;
	}
	.margin_box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
