<template>
	<view class="content">
		<swiper class="swiper_box">
			<swiper-item v-for="(item, index) in orderInfo.carPhotos" :key="index"><image :src="item" class="swiper_img" mode="aspectFill"></image></swiper-item>
		</swiper>
		<view class="info_box">
			<text>订单信息</text>
			<text>总金额：{{orderInfo.totalMoney/100 || 0}}</text>
			<text>支付状态：{{orderInfo.payStatus === 'NOTPAY' ? '未付款' : orderInfo.payStatus === 'SUCCESS' ? '付款成功' : orderInfo.payStatus === 'REFUNDED' ? '退款成功' : '未知状态'}}</text>
			<text>租赁费用：{{orderInfo.shouldMoney/100 || 0}}</text>
			<text>保险费用：{{orderInfo.insureMoney/100 || 0}}</text>
			<text>平台费用：{{orderInfo.serviceMoney/100 || 0}}</text>
			<text>预计交车时间：{{dayjs(orderInfo.wantCarTime).format('YYYY-MM-DD HH:mm:ss')}}</text>
			<text>预计还车时间：{{dayjs(orderInfo.estimateReturnTime).format('YYYY-MM-DD HH:mm:ss')}}</text>
			<text>交车地点：{{orderInfo.address}}</text>
			<text>还车地点：{{orderInfo.returnAddress}}</text>
			<button v-show="type === '1'" @click="orderHandle(1)" class="btn">确认接单</button>
			<button v-show="type === '1'" @click="orderHandle(2)" class="btn">放弃接单</button>
			<button v-show="type === '2'" @click="orderHandle(3)" class="btn">确认退款</button>
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
				orderInfo: {}
			};
		},
		onLoad(option) {
			this.type = option.type; // 0 列表进入 1 新订单确认或取消 2 退款确认
			this.initOrderDetail(option.id);
		},
		methods:{
			initOrderDetail(id){
				api.orderDetail(id).then((res = {})=>{
					let { data } = res;
					if (data) {
						let tmp = [];
						data.car.carPhotos.split(',').forEach(o => {
							tmp.push(`${config.IMG_URL}${o}`);
						});
						delete res.data.car.carPhotos;
						this.orderInfo = { carPhotos: tmp, ...res.data };
					}
				});
			},
			orderHandle(type){
				console.log(type === 3);
				// 1 确认接单 2 取消接单 3 确认退款
				let func = type === 1 ? api.orderConfirm : type === 2 ? api.orderCannel : type === 3 ? api.orderCannel : undefined;
				console.log(func)
				func(this.orderInfo.orderId).then((res)=>{
					if(res){
						uni.showToast({
							title: '操作成功',
							icon: 'success'
						});
						uni.reLaunch({
							url: '/pages/model/InCar/index'
						});
					}
				})
			}
		}
	}
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
	margin-top: 30rpx;
}
</style>
