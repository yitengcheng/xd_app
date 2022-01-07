<template>
	<view class="content" style="align-items: center;">
		<u-image v-if="orders.length === 0" src="/static/img/empty_data.png"></u-image>
		<view v-for="(order, index) in orders" :key="index" class="row_item" @click="clickItem(order)">
			<view class="row_item_image"><u-image :src="order.thumb" width="30px" height="30px" shape="circle"></u-image></view>
			<view class="row_item_info">
				<view class="row_item_info_row">
					<view class="row_item_info_title">{{ order.title }}</view>
					<view class="row_item_info_status">{{ order.rightText }}</view>
				</view>
				<view class="row_item_info_row">
					<view class="row_item_info_time">
						<view class="row_item_circle"></view>
						{{ order.note }}
					</view>
					<view class="row_item_info_time" style="margin-right: 10px;">{{ order.time }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
export default {
	data() {
		return {
			pageNo: 1,
			orders: []
		};
	},
	onLoad() {
		uni.$on('orders', () => {
			this.initOrders(1);
		});
	},
	onReachBottom() {
		this.initOrders(this.pageNo);
	},
	onPullDownRefresh() {
		this.initOrders(1);
	},
	mounted() {
		this.initOrders(1);
	},
	methods: {
		initOrders(pageNum) {
			let status = this.current === 0 ? undefined : this.current === 1 ? 0 : 1;
			api.newOrders({
				pageNum,
				pageSize: 10
			}).then((res = {}) => {
				uni.stopPullDownRefresh();
				if (res?.total === 0) {
					this.orders = [];
					this.pageNo = 1;
					return;
				}
				if ((res.rows || []).length > 0) {
					let tmp = [];
					res.rows.forEach(o => {
						let carPhoto = `${config.IMG_URL}${o?.car?.carPhotos?.split(',')[0]}`;
						tmp.push({
							data: o,
							orderId: o?.orderId,
							thumb: carPhoto,
							title: o?.car?.carNum,
							time: this.dayjs(o?.wantCarTime).format('HH:mm:ss'),
							note: `交车：${this.dayjs(o?.wantCarTime).format('YYYY年MM月DD日')}`,
							rightText: `${
								o?.payStatus === 'SUCCESS'
									? '支付成功'
									: o?.payStatus === 'NOTPAY'
									? '等待付款'
									: o?.payStatus === 'REFUNDED'
									? '退款完成'
									: o?.payStatus === 'CLOSED'
									? '订单关闭'
									: o?.payStatus === 'REFUSE'
									? '已拒绝'
									: o?.payStatus
							}`
						});
					});
					pageNum === 1 ? (this.orders = tmp) : (this.orders = this._.concat(this.orders, tmp));
					pageNum === 1 ? (this.pageNo = 2) : (this.pageNo = this.pageNo + 1);
				}
			});
		},
		clickItem(e) {
			let type = e.payStatus === 'CLOSED' || e.payStatus === 'REFUSE' ? '3' : e.comfirStatus ? '2' : '1';
			uni.navigateTo({
				url: `/pages/model/my/OrderDetail?id=${e.orderId}&type=${type}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.row_item {
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	border-radius: 10px;
	padding: 15px;
	margin-top: 10px;
	width: 85%;
	align-items: center;
}
.row_item_image {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #ffd101;
}
.row_item_info {
	display: flex;
	flex-direction: column;
	margin-left: 10px;
	flex: 1;
}
.row_item_info_row {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.row_item_info_title {
	font-size: 16px;
	font-family: Microsoft YaHei;
	font-weight: bold;
	color: #333333;
}
.row_item_info_status {
	background: #ffd101;
	border-radius: 25px;
	padding: 3px 18px;
	font-size: 10px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
	display: flex;
	align-items: center;
	justify-content: center;
}
.row_item_info_time {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 14px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
}
.row_item_circle {
	width: 10px;
	height: 10px;
	background: #999999;
	border-radius: 50%;
	margin-right: 10px;
}
</style>
