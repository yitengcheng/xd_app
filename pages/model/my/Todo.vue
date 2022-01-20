<template>
	<view class="content" style="align-items: center;">
		<view class="toDo_box" v-for="(toDo,index) in toDos" :key="index">
			<view class="toDo_img">
				<u-image src="/static/img/notice.png" width="19" height="19"></u-image>
			</view>
			<view class="toDo_info">
				<view class="toDo_info_text">{{typeTile(toDo.type)}}</view>
				<view class="toDo_info_msg">{{toDo.message}}</view>
			</view>
			<view>
				<u-button type="primary" class="toDo_btn" @click="haveRead(toDo)">查看</u-button>
				<view class="toDo_info_msg">{{dayjs(toDo.createTime).format('YYYY-MM-DD')}}</view>
			</view>
		</view>
	</view>
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
				api.handles({
					pageNum,
					pageSize: 10,
				}).then((res = {}) => {
					if ((res.rows || []).length > 0) {
						let { rows } = res;
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
					uni.stopPullDownRefresh();
				});
			},
			typeTile(type) {
				switch (type) {
					case 'NEWORDER': // 新的订单-确认
						return '新的订单（确认）'
						break;
					case 'VIEWORDER': // 新的订单-线下支付
						return '新的订单（线下支付）'
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
				if (item.handle && item.flag === 2) {
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
						uni.navigateTo({
							url: `/pages/model/my/OrderDetail?id=${item.orderId}&type=1&handleId=${item.id}`
						});
						break;
					case 'VIEWORDER': // 新线下订单-确认
						uni.navigateTo({
							url: `/pages/model/my/OrderDetail?id=${item.orderId}&type=1&handleId=${item.id}`
						});
						break;
					case 'APPLYREFUNDED': // 申请退款通知
						uni.navigateTo({
							url: `/pages/model/my/OrderDetail?id=${item.orderId}&type=2&handleId=${item.id}`
						});
						break;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.toDo_box {
	display: flex;
	flex-direction: row;
	width: 85%;
	border-radius: 10px;
	background-color: #FFFFFF;
	align-items: center;
	justify-content: space-around;
	padding: 30px 15px;
	margin-top: 10px;
}
.toDo_img {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #1B90D1;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 15px;
}
.toDo_info {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	flex: 1;
}
.toDo_info_text {
	font-size: 14px;
	font-family: Microsoft YaHei;
	font-weight: bold;
	color: #333333;
	margin-bottom: 15px;
}
.toDo_info_msg {
	font-size: 10px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
}
.toDo_btn {
	width: 50px;
	height: 20px;
	background: #1B90D1;
	border-radius: 25px;
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
	margin-bottom: 15px;
}
</style>
