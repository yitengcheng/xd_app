<template>
	<view class="content">
		<view v-for="(item, index) in list" :key="index" class="item_box" @click="renewal(item)">
			<view class="item_row">
				<view class="item_text">编号：{{item.id}}</view>
				<view class="item_text">名称：{{item.name}}</view>
				<view class="item_text">方式：{{item.payMethod === 0 ? '购买' : '租赁'}}</view>
			</view>
			<view class="item_row">
				<view class="item_text">
					租期：{{dayjs(item.leaseBeginTime).format('YYYY-MM-DD')}}至{{dayjs(item.leaseEndTime).format('YYYY-MM-DD')}}
				</view>
				<view class="item_text">剩余：{{item.diffDate}}天</view>
			</view>
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
					if (res.rows.length >= 0) {
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

<style lang="scss">
	.item_box {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 5px;
		border-bottom: 1px solid #808080;
	}

	.item_row {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
	}

	.item_text {
		font-size: 16px;
		font-weight: 300;
	}
</style>
