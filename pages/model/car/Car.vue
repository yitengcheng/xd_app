<template>
	<view class="content">
		<u-sticky style="width: 100%;background-color: #FFFFFF;">
			<u-tabs
				:current="current"
				:list="items"
				@click="onClickItem"
				lineColor="#FFD101"
				:activeStyle="{ color: '#FFD101' }"
				:is-scroll="false"
			></u-tabs>
			<u-input placeholder="请输入车牌或车型进行搜索" border="surround" v-model="keywords" style="border-top: #F3F3F3 1px solid;">
				<template slot="suffix">
					<u-icon name="search" @click="search"></u-icon>
				</template>
			</u-input>
		</u-sticky>
		<WaterfallsFlow :wfList="list" @itemTap="itemTap" v-show="list.length !== 0" />
		<u-image
			v-show="list.length === 0"
			src="/static/img/empty_data.png"
			style="align-self: center;"
		></u-image>
		<uni-fab
			v-if="current !== 2"
			:content="content"
			horizontal="right"
			vertical="bottom"
			direction="vertical"
			@trigger="trigger"
		></uni-fab>
	</view>
</template>
<script>
import WaterfallsFlow from '../../../components/WaterfallsFlow/WaterfallsFlow.vue';
import api from '../../../api/index.js';
import config from '../../../common/config.js';
export default {
	components: {
		WaterfallsFlow
	},
	data() {
		return {
			current: 0,
			items: [
				{
					name: '待租车辆'
				},
				{
					name: '全部车辆'
				},
				{
					name: '可调用车辆'
				}
			],
			list: [],
			content: [
				{
					iconPath: '../../../static/img/goToTop.png',
					selectedIconPath: '',
					text: '回到顶部'
				},
				{
					iconPath: '../../../static/img/carDetail.png',
					selectedIconPath: '',
					text: '添加车辆'
				}
			],
			pageNo: 1,
			keywords: ''
		};
	},
	onLoad() {
		if (this.current === 2) {
			this.initShuntList(1);
		} else if(this.current === 1){
			this.getCarList(1);
		}else{
			this.getWaitCar(1);
		}
		uni.$on('car', () => {
			this.list = [];
			this.keywords = '';
			this.$nextTick(() => {
				if (this.current === 2) {
					this.initShuntList(1);
				} else if(this.current === 1){
					this.getCarList(1);
				}else{
					this.getWaitCar(1);
				}
			});
		});
	},
	onReachBottom() {
		if (this.current === 2) {
			this.initShuntList(this.pageNo);
		} else if(this.current === 1){
			this.getCarList(this.pageNo);
		}else{
			this.getWaitCar(this.pageNo);
		}
	},
	onPullDownRefresh() {
		this.list = [];
		this.keywords = '';
		if (this.current === 2) {
			this.initShuntList(1);
		} else if(this.current === 1){
			this.getCarList(1);
		}else{
			this.getWaitCar(1)
		}
	},
	onNavigationBarButtonTap(e){
		if(e.text === '申请') this.toApplyList();
	},
	methods: {
		toApplyList(){
			uni.navigateTo({
				url: `/pages/model/car/ApplyList`
			})
		},
		itemTap(item) {
			if(this.current === 2){
				uni.navigateTo({
					url: `/pages/model/car/ShuntingDetail?carId=${item.carInfo.id}`
				})
			}else{
				uni.navigateTo({
					url: `/pages/model/car/CarDetail?type=detail&id=${item.carInfo.id}&showQR=${this
						.current === 0}`
				});
			}
		},
		search() {
			this.list = [];
			if (this.current === 2) {
				this.initShuntList(1);
			} else if(this.current === 1){
				this.getCarList(1);
			}else {
				this.getWaitCar(1)
			}
		},
		onClickItem(e) {
			this.current = e.index;
			this.keywords = '';
			this.list = [];
			this.$nextTick(() => {
				if (this.current === 2) {
					this.initShuntList(1);
				} else if(this.current === 1){
					this.getCarList(1);
				}else{
					this.getWaitCar(1);
				}
			});
		},
		initShuntList(pageNum) {
			api.shuntCarList({
				pageNum,
				pageSize: 10,
				keywords: this.keywords
			}).then((res)=>{
				uni.stopPullDownRefresh();
				if (res?.total === 0) {
					this.list = [];
					this.pageNo = 1;
					return;
				}
				if (res?.rows.length !== 0) {
					let tmp = [];
					res.rows.forEach(item => {
						let img = item.carPhotos?.split(',')[0];
						tmp.push({
							image: img ? `${config.IMG_URL}${img}` : '/static/img/defalut.png',
							nickName: item.carBrand,
							plate: item.carNum,
							complanyName: item.complanyName,
							leave: item.leave,
							carInfo: item,
							id: item.id
						});
					});
					pageNum === 1 ? (this.list = tmp) : (this.list = this._.concat(this.list, tmp));
					pageNum === 1 ? (this.pageNo = 2) : (this.pageNo = this.pageNo + 1);
				}
			});
			
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
						url: '/pages/model/car/CarDetail?type=add'
					});
					break;
				default:
					break;
			}
		},
		getWaitCar(pageNum){
			api.waitCarList({
				pageNum,
				pageSize: 10,
				keywords: this.keywords
			}).then((res)=>{
				uni.stopPullDownRefresh();
				if (res?.total === 0) {
					this.list = [];
					this.pageNo = 1;
					return;
				}
				if (res?.rows.length !== 0) {
					let tmp = [];
					res.rows.forEach(item => {
						let img = item.carPhotos?.split(',')[0];
						tmp.push({
							image: img ? `${config.IMG_URL}${img}` : '/static/img/defalut.png',
							nickName: item.carBrand,
							plate: item.carNum,
							carInfo: item,
							id: item.id
						});
					});
					pageNum === 1 ? (this.list = tmp) : (this.list = this._.concat(this.list, tmp));
					pageNum === 1 ? (this.pageNo = 2) : (this.pageNo = this.pageNo + 1);
				}
			});
		},
		getCarList(pageNum) {
			api.carList({
				pageNum,
				pageSize: 10,
				keywords: this.keywords
			}).then(res => {
				uni.stopPullDownRefresh();
				if (res?.total === 0) {
					this.list = [];
					this.pageNo = 1;
					return;
				}
				if (res?.rows.length !== 0) {
					let tmp = [];
					res.rows.forEach(item => {
						let img = item.carPhotos?.split(',')[0];
						tmp.push({
							image: img ? `${config.IMG_URL}${img}` : '/static/img/defalut.png',
							nickName: item.carBrand,
							plate: item.carNum,
							carInfo: item,
							id: item.id
						});
					});
					pageNum === 1 ? (this.list = tmp) : (this.list = this._.concat(this.list, tmp));
					pageNum === 1 ? (this.pageNo = 2) : (this.pageNo = this.pageNo + 1);
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped></style>
