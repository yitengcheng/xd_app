<template>
	<view class="content">
		<uni-list>
			<uni-list-item v-for="item in orders" :key="item.orderId" :thumb="item.thumb" :title="item.title"
				:note="item.note" :rightText="item.rightText" :clickable="true" @click="clickItem(item.data)"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	export default {
		data() {
			return {
				pageNo: 1,
				orders: [],
			};
		},
		onLoad() {
			uni.$on('orders', ()=>{
				this.initOrders(1);
			});
		},
		onReachBottom() {
			this.initOrders();
		},
		onPullDownRefresh() {
			this.initOrders(1);
		},
		mounted() {
			this.initOrders(1);
		},
		methods: {
			initOrders(pageNo) {
				let pageNum = pageNo || this.pageNo;
				let status = this.current === 0 ? undefined : this.current === 1 ? 0 : 1;
				api.orders({
					pageNum,
					pageSize: 10,
				}).then((res = {}) => {
					uni.stopPullDownRefresh();
					if ((res.rows || []).length > 0) {
						if (pageNum === 1) {
							let tmp = []
							res.rows.forEach(o => {
								let carPhoto = `${config.IMG_URL}${o.car.carPhotos.split(',')[0]}`
								tmp.push({
									data: o,
									orderId: o.orderId,
									thumb: carPhoto,
									title: o.car.carNum,
									note: `交车时间：${this.dayjs(o.wantCarTime).format('YYYY年MM月DD日')}`,
									rightText: `${o.payStatus === 'SUCCESS' ? '支付成功' : o.payStatus ===
										'NOTPAY' ? "等待付款" : o.payStatus === 'REFUNDED' ? '退款完成' : o
										.payStatus === 'CLOSED' ? '订单关闭' : o.payStatus ===
										'REFUSE' ? '已拒绝' : o.payStatus}`,
								});
							});
							this.orders = tmp;
						} else {
							res.rows.forEach(o => {
								let carPhoto = `${config.IMG_URL}${o.car.carPhotos.split(',')[0]}`
								this.orders.push({
									data: o,
									orderId: o.orderId,
									thumb: carPhoto,
									title: o.car.carNum,
									note: `交车时间：${this.dayjs(o.wantCarTime).format('YYYY年MM月DD日')}`,
									rightText: `${o.payStatus === 'SUCCESS' ? '支付成功' : o.payStatus ===
										'NOTPAY' ? "等待付款" : o.payStatus === 'REFUNDED' ? '退款完成' : o
										.payStatus === 'CLOSED' ? '订单关闭' : o.payStatus ===
										'REFUSE' ? '已拒绝' : o.payStatus}`,
								});
							})
						}
						this.pageNo = pageNum + 1;
					}
				});
			},
			clickItem(e){
				let type = (e.payStatus === 'CLOSED' || e.payStatus === 'REFUSE') ? '3' : e.comfirStatus ? '2' : '1';
				uni.navigateTo({
					url: `/pages/model/my/OrderDetail?id=${e.orderId}&type=${type}`
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
