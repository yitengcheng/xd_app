<template>
	<view class="content" style="align-items: center;">
		<view v-for="(item, index) in list" :key="index" class="item_box">
			<view class="item_row">
				<view class="item_title">{{item.name}}</view>
				<view class="item_day">{{dayjs(item.createTime).format('YYYY-MM-DD')}}</view>
			</view>
			<view class="item_row" style="justify-content: flex-start;">
				<view class="payment_box">
					<view class="big_round" :style="{borderColor:(item.payMethod ? '#CCCCCC':'#1B90D1')}">
						<view class="small_round" :style="{background:(item.payMethod ? '#CCCCCC':'#1B90D1')}"></view>
					</view>
					<view class="payment_text" :style="{color:(item.payMethod ? '#CCCCCC':'#333333')}">购买</view>
				</view>
				<view class="payment_box">
					<view class="big_round" :style="{borderColor:(!item.payMethod ? '#CCCCCC':'#1B90D1')}">
						<view class="small_round" :style="{background:(!item.payMethod ? '#CCCCCC':'#1B90D1')}"></view>
					</view>
					<view class="payment_text" :style="{color:(!item.payMethod ? '#CCCCCC':'#333333')}">租赁</view>
				</view>
			</view>
			<view class="item_row" v-if="item.payMethod">
				<view class="item_lease">
					租期：{{dayjs(item.leaseBeginTime).format('YYYY-MM-DD')}}至{{dayjs(item.leaseEndTime).format('YYYY-MM-DD')}}
				</view>
			</view>
			<view class="item_row" v-if="item.payMethod">
				<view class="item_surplus">倒计时：{{item.diffDate}}天</view>
			</view>
			<u-button  v-if="item.payMethod" type="primary" class="goon_btn" @click="renewal(item)">续费</u-button>
		</view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				pageNum: 1,
				list: [],
			};
		},
		mounted() {
			this.initProduct(1);
		},
		onPullDownRefresh() {
			this.initProduct(1);
		},
		onReachBottom() {
			this.initProduct(this.pageNum);
		},
		methods: {
			initProduct(pageNum) {
				api.products({
					pageNum,
					pageSize: 20,
					status: 3,
					complanyId: uni.getStorageSync('complanyId')
				}).then(res => {
					uni.stopPullDownRefresh();
					if (res.rows.length !== 0) {
						let tmp = [];
						let {
							rows
						} = res;
						rows.forEach(row => {
							tmp.push({
								name: row.title ?? '无',
								id: row.id ?? '未知',
								payMethod: row.payMethod,
								leaseBeginTime: row.leaseBeginTime ?? '1970-1-1',
								leaseEndTime: row.leaseEndTime ?? '1970-1-1',
								diffDate: this.dayjs().diff(row.leaseEndTime ?? '1970-1-1', 'day'),
							})
						});
						pageNum === 1 ? this.pageNum = 2 : this.pageNum = this.pageNum + 1;
						pageNum === 1 ? this.list = tmp : this.list = this._.concat(this.list, tmp);
					}
				})
			},
			renewal(item) {
				let actionstyle = {
					title: "请选择续租时间",
					cancel: "取消",
					buttons: [{
						title: '三个月'
					}, {
						title: '六个月'
					}, {
						title: '一年'
					}, {
						title: '两年'
					}]
				}
				// #ifdef APP-PLUS
				plus.nativeUI.actionSheet(actionstyle, (e) => {
					let leaseTerm = '';
					switch (e.index) {
						case 1:
							leaseTerm = 3;
							break
						case 2:
							leaseTerm = 6;
							break
						case 3:
							leaseTerm = 12;
							break
						case 4:
							leaseTerm = 24;
							break
						default:
							return;
							break;
					};
					api.renewalProduct({
						flag: 1,
						goodsId: item?.id,
						leaseEndTime: this.dayjs(item?.leaseEndTime).add(leaseTerm, 'month').format(
							'YYYY-MM-DD'),
						lease: leaseTerm,
					}).then(res => {
						if (res?.data) {
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: res?.data,
								success: () => {
									uni.showModal({
										title: '提示',
										content: '续期成功',
										showCancel: false,
										success: (e) => {
											if (e.confirm) {
												uni.navigateBack();
											}
										}
									})
								}
							})
						}
					})
				});
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item_box {
		width: 90%;
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		border-radius: 10px;
		margin-top: 10px;
	}

	.item_row {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		padding: 0px 20px;
	}
	
	.item_title {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #333333;
		margin-top: 20px;
	}
	
	.item_day {
		font-size: 12px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		margin-top: 20px;
		color: #999999;
	}
	
	.payment_box {
		display: flex;
		flex-direction: row;
		width: 100px;
		height: 20px;
		align-items: center;
		margin: 5px 0px;
	}
	
	.big_round {
		width: 15px;
		height: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #FFFFFF;
		border: 1px solid #CCCCCC;
		border-radius: 50%;
		margin-right: 10px;
	}
	
	.small_round {
		width: 7px;
		height: 7px;
		background: #CCCCCC;
		border-radius: 50%;
	}
	
	.payment_text {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #999999;
	}
	
	.item_lease {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #333333;
		margin: 5px 0px;
	}
	
	.item_surplus {
		font-size: 12px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #999999;
		margin: 5px 0px;
	}
	
	.goon_btn {
		width: 100%;
		height: 40px;
	}
</style>
