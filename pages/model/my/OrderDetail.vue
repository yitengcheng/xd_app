<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box">
			<swiper-item v-for="(item, index) in orderInfo.carPhotos" :key="index">
				<image :src="item" class="swiper_img" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="info_box">
			<text>订单信息</text>
			<text>总金额：{{orderInfo.totalMoney/100 || 0}}</text>
			<text>支付状态：{{orderInfo.payStatus === 'NOTPAY' ? '未付款' : orderInfo.payStatus === 'SUCCESS' ? '付款成功' : orderInfo.payStatus === 'REFUNDED' ? '退款成功' : orderInfo.payStatus === '到店付款' ? '到店付款' : '未知状态'}}</text>
			<text>租赁费用：{{orderInfo.shouldMoney/100 || 0}}</text>
			<text>保险费用：{{orderInfo.insureMoney/100 || 0}}</text>
			<text>平台费用：{{orderInfo.serviceMoney/100 || 0}}</text>
			<text>预计交车时间：{{dayjs(orderInfo.wantCarTime).format('YYYY-MM-DD HH:mm:ss')}}</text>
			<text>预计还车时间：{{dayjs(orderInfo.estimateReturnTime).format('YYYY-MM-DD HH:mm:ss')}}</text>
			<text>交车地点：{{orderInfo.address}}</text>
			<text>还车地点：{{orderInfo.returnAddress}}</text>
			<button v-show="type === '1'" @click="orderHandle(1)" class="btn" type="primary">确认接单</button>
			<button v-show="type === '1'" @click="orderHandle(2)" class="btn">放弃接单</button>
			<button v-show="type === '2'" @click="orderHandle(4)" class="btn" type="primary">交车</button>
			<button v-show="type === '2'" @click="orderHandle(3)" class="btn" type="warn">确认退款</button>
		</view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	export default {
		data() {
			return {
				type: '0',
				orderInfo: {},
				handleId: '',
			};
		},
		onLoad(option) {
			this.type = option.type; // 0 列表进入 1 新订单确认或取消 2 退款确认 3交车
			this.handleId = option.handleId;
			this.initOrderDetail(option.id);
		},
		methods: {
			initOrderDetail(id) {
				api.orderDetail(id).then((res = {}) => {
					let {
						data
					} = res;
					if (data) {
						let tmp = [];
						data.car.carPhotos.split(',').forEach(o => {
							o ? tmp.push(`${config.IMG_URL}${o}`) : tmp.push('/static/img/defalut.png');
						});
						delete res.data.car.carPhotos;
						if(res?.data?.comfirStatus && this.type !== '3'){
							this.type = '2';
						}
						this.orderInfo = {
							carPhotos: tmp,
							...res.data
						};
					}
				});
			},
			orderHandle(type) {
				// 1 确认接单 2 取消接单 3 确认退款 
				let func = type === 1 ? api.orderConfirm : (type === 2 && typeof this.orderInfo.complany.subMchId ===
					'string') ? api.orderCannel : (type === 2 && typeof this.orderInfo.complany.subMchId !==
					'string') ? api.handleRead : type === 3 ? api.orderCannel : undefined;
				if(type === 4){
					uni.navigateTo({
						url: `/pages/model/InCar/InCarDetail?id=${this.orderInfo.car.id}`
					});
					return;
				}
				func({
					orderId: this.orderInfo.orderId,
					handleId: this.handleId,
				}).then((res) => {
					if (res) {
						uni.$emit('orders');
						this.initOrderDetail(this.orderInfo.orderId);
						uni.showToast({
							title: '操作成功',
							icon: 'success'
						});
						if(type === 1){
							uni.showModal({
								title: '提示',
								content: '现在是否交车',
								success: (e) => {
									if(e.confirm){
										uni.navigateTo({
											url: `/pages/model/InCar/InCarDetail?id=${this.orderInfo.car.id}`
										})
									}
								}
							})
						}
					}
				})
			}
		}
	}
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

	.info_box {
		width: 90%;
		display: flex;
		flex-direction: column;
		padding-top: 10px;
	}

	.btn {
		margin-top: 30rpx;
		width: 80%;
	}
</style>
