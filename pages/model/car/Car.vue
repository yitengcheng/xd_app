<template>
	<view class="content" style="align-items: center;">
		<u-sticky style="width: 100%;background-color: #FFFFFF;" >
			<u-tabs :current="current" :list="items" @click="onClickItem" lineColor="#FFD101"
				:activeStyle="{color: '#FFD101'}" :is-scroll="false"></u-tabs>
		</u-sticky>
		<WaterfallsFlow :wfList="list" @itemTap="itemTap" v-show="list.length !== 0" />
		<u-image v-show="list.length === 0" src="/static/img/empty_data.png"></u-image>
		<uni-fab :content="content" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger">
		</uni-fab>
	</view>
</template>
<script>
	import WaterfallsFlow from '../../../components/WaterfallsFlow/WaterfallsFlow.vue';
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	export default {
		components: {
			WaterfallsFlow,
		},
		data() {
			return {
				current: 0,
				items: [{
						name: '待租车辆'
					},
					{
						name: '全部车辆'
					},
					{
						name: '待还车辆'
					},
				],
				list: [],
				content: [{
					iconPath: '../../../static/img/goToTop.png',
					selectedIconPath: '',
					text: '回到顶部'
				}, {
					iconPath: '../../../static/img/carDetail.png',
					selectedIconPath: '',
					text: '添加车辆'
				}],
				pageNo: 1,
			};
		},
		onLoad() {
			this.getCarList(1);
			uni.$on('car', () => {
				this.list = [];
				this.current = 0,
				this.$nextTick(() => {
					this.getCarList(1);
				});
			});
		},
		onReachBottom() {
			this.getCarList(this.pageNo);
		},
		onPullDownRefresh() {
			this.list = [];
			this.$nextTick(() => {
				this.getCarList(1);
			});
		},
		methods: {
			itemTap(item) {
				uni.navigateTo({
					url: `/pages/model/car/CarDetail?type=detail&id=${item.carInfo.id}&showQR=${this.current === 0}`,
				})
			},
			onClickItem(e) {
				this.current = e.index;
				this.list = [];
				this.$nextTick(() => {
					this.getCarList(1);
				})
			},
			trigger(e) {
				switch (e.index) {
					case 0:
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 200
						});
						break;
					case 1:
						uni.navigateTo({
							url: '/pages/model/car/CarDetail?type=add',
						})
						break;
					default:
						break;
				}
			},
			getCarList(pageNum) {
				let status = this.current === 0 ? 0 : this.current === 1 ? undefined : 1;
				api.carList({
					pageNum,
					pageSize: 10,
					status,
				}).then((res) => {
					if(res?.total === 0){
						this.list = [];
						this.pageNo = 1;
						return;
					}
					if (res?.rows.length !== 0) {
						let tmp = [];
						res.rows.forEach((item) => {
							let img = item.carPhotos?.split(',')[0];
							tmp.push({
								image: img ? `${config.IMG_URL}${img}` : '/static/img/defalut.png',
								nickName: item.carBrand,
								plate: item.carNum,
								carInfo: item,
								id: item.id,
							})
						});
						pageNum === 1 ? this.list = tmp : this.list = this._.concat(this.list, tmp);
						pageNum === 1 ? this.pageNo = 2 : this.pageNo = this.pageNo + 1;
					}
					uni.stopPullDownRefresh();
				});
			}
		}
	};
</script>
<style lang="scss" scoped>

</style>
