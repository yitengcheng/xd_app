<template>
	<view class="content" style="align-items: center;">
		<view class="order_box" v-for="(order,index) in orders" :key="index">
			<view class="order_row">
				<view class="order_company">{{order.companyName}}</view>
				<view class="order_time">{{order.createTime}}</view>
			</view>
			<view class="order_row">
				<u-image :src="order.img" width="80px" height="73px"></u-image>
				<view class="order_info">
					<view class="order_title">{{order.productName}}</view>
					<view class="order_courier">{{order.courier}}</view>
					<view class="order_payment">{{order.payment}}</view>
				</view>
			</view>
			<view class="order_row order_address">{{order.address}}</view>
			<view class="order_row">
				<view class="order_price">
					<span style="font-size: 14px;">￥</span>
					{{order.totalPrice}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config';
	export default {
		data() {
			return {
				pageNum: 1,
				orders: []
			};
		},
		mounted() {
			this.initProductOrders();
		},
		methods: {
			initProductOrders(pageNo){
				let pageNum = pageNo ?? 1;
				api.productOrders({
					pageNum,
					pageSize: 10,
					complanyId: uni.getStorageSync('complanyId'),
				}).then( res => {
					if(res?.rows?.length > 0){
						let tmp = [];
						res.rows.forEach(row => {
							let image = row?.product?.images?.split(',')?.[0];
							tmp.push({
								companyName: row?.complany?.complanyName ?? '公司名',
								createTime: this.dayjs(row?.createTime).format('YYYY-MM-DD'),
								img: image ? `${config.IMG_URL}${image}` : '/static/img/defalut.png',
								productName: row?.product?.title ?? '产品名称',
								courier: row?.logisticsNumber ?? '快递单号',
								payment: row?.payMethod === 0 ? '购买' : row?.payMethod === 1 ? '租赁' : row?.payMethod === 2 ? '续租' : '购买方式',
								address: row?.consigneAddress ?? '收货地址',
								totalPrice: row?.price ?? '付款金额',
							});
							pageNum === 1 ? this.orders = tmp : this.orders = this._.concat(this.orders, tmp);
							pageNum === 1 ? this.pageNo = 2 : this.pageNo = this.pageNo + 1;
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.order_box {
	display: flex;
	flex-direction: column;
	border-radius: 10px;
	background-color: #FFFFFF;
	margin-top: 10px;
	padding: 10px;
	width: 90%;
}
.order_row {
	display: flex;
	flex-direction: row;
	margin: 5px 0px;
	justify-content: space-between;
}
.order_company {
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
}
.order_time {
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #999999;
}
.order_info {
	display: flex;
	margin-left: 10px;
	flex-direction: column;
	justify-content: space-around;
	flex: 1;
}
.order_title {
	font-size: 14px;
	font-family: Microsoft YaHei;
	font-weight: bold;
	color: #333333;
}
.order_courier {
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
}
.order_payment {
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #999999;
}
.order_address {
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #999999;
}
.order_price {
	font-size: 24px;
	font-family: Microsoft YaHei;
	font-weight: bold;
	color: #FF4343;
}
</style>
