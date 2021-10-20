<template>
	<uni-list>
		<uni-list-item v-for="item in toDos" :key="item.id" :title="typeTile(item.type)" :note="item.message"
			:rightText="dayjs(item.createTime).format('YYYY-MM-DD')" :show-badge="item.handle" badge-text="*"
			:clickable="true" @click="haveRead(item)">
		</uni-list-item>
	</uni-list>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		mounted() {
			this.initTodoList(1);
		},
		onReachBottom() {
			this.initTodoList();
		},
		onPullDownRefresh() {
			this.initTodoList(1);
		},
		data() {
			return {
				pageNo: 1,
				toDos: []
			};
		},
		methods: {
			initTodoList(pageNo) {
				let pageNum = pageNo || this.pageNo;
				let user = uni.getStorageSync('user');
				api.handles({
					pageNum,
					pageSize: 10,
					complanyIds: this._.map(user.complany, 'id').join(','),
				}).then((res = {}) => {
					if ((res.rows || []).length > 0) {
						let {
							rows
						} = res;
						if (pageNum === 1) {
							let tmp = [];
							rows.forEach(o => {
								tmp.push({
									...o
								})
							})
							this.toDos = tmp;
						} else {
							rows.forEach(o => {
								this.toDos.push({
									...o
								})
							})
						}
						this.pageNo = pageNum + 1;
					}
				});
			},
			typeTile(type) {
				switch (type) {
					case 'NEWORDER': // 新的订单-确认
						return '新的订单-确认'
						break;
					case 'VIEWORDER': // 新的订单-线下支付
						return '新的订单-线下支付'
						break;
					case 'REFUNDED': // 已退款通知
						return '已退款通知'
						break;
					case 'APPLYREFUNDED': // 申请退款通知
						return '申请退款通知'
						break;
					case 'RETURNCAR': // 用户还车通知
						return '用户还车通知'
						break;
					case 'EXRETURNCAR': // 用户异常还车通知
						return '用户异常还车通知'
						break;
				}
			},
			haveRead(item) {
				if (item.handle) {
					api.handleRead({
						type: item.type,
						handleId: item.id,
					}).then(res => {
						this._.find(this.toDos, o => {
							if (o.id === item.id) {
								o.handle = false
							}
						});
					});
				}
				switch (item.type) {
					case 'NEWORDER': // 新的订单-确认
						uni.redirectTo({
							url: `/pages/model/my/OrderDetail?id=${item.orderId}&type=1`
						});
						break;
					case 'APPLYREFUNDED': // 申请退款通知
						uni.redirectTo({
							url: `/pages/model/my/OrderDetail?id=${item.orderId}&type=2`
						});
						break;
				}
			},
		}
	}
</script>

<style lang="scss">

</style>
