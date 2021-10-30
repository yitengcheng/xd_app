<template>
	<view>
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
				let user = uni.getStorageSync('user');
				api.orders({
					pageNum,
					pageSize: 10,
					complanyIds: this._.map(user.complany, 'id').join(','),
				}).then((res = {}) => {
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
									rightText: `${o.payStatus === 'NOTPAY' ? '未付款' : o.payStatus === 'SUCCESS' ? '付款成功' : o.payStatus === 'REFUNDED' ? '退款成功' : '未知状态'}`,
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
									rightText: `${o.payStatus === 'NOTPAY' ? '未付款' : o.payStatus === 'SUCCESS' ? '付款成功' : o.payStatus === 'REFUNDED' ? '退款成功' : '未知状态'}`,
								});
							})
						}
						this.pageNo = pageNum + 1;
					}
				});
			},
			clickItem(e){
				uni.navigateTo({
					url: `/pages/model/my/OrderDetail?id=${e.orderId}&type=0&`
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
