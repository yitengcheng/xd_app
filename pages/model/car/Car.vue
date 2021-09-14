<template>
	<view>
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#4cd964"></uni-segmented-control>
		<view>
			<view v-show="current === 0"><WaterfallsFlow :wfList="list" @itemTap="itemTap" /></view>
			<view v-show="current === 1"><WaterfallsFlow :wfList="list" @itemTap="itemTap" /></view>
			<view v-show="current === 2"><WaterfallsFlow :wfList="list" @itemTap="itemTap" /></view>
		</view>
		<uni-fab :content="content" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger"></uni-fab>
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
			items: ['全部车辆', '可租车辆', '在租车辆'],
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
		};
	},
	onLoad() {
		this.getCarList(1);
	},
	onReachBottom() {
		this.getCarList(this.pageNo);
	},
	onPullDownRefresh() {
		this.getCarList(1);
	},
	methods: {
		itemTap(item) {
			uni.navigateTo({
				url: `/pages/model/car/CarDetail?type=detail&id=${item.carInfo.id}`,
			})
		},
		onClickItem(e) {
			this.current = e.currentIndex;
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
		getCarList(pageNo){
			let pageNum = pageNo || this.pageNo;
			let user = uni.getStorageSync('user');
			api.carList({
				pageNum,
				pageSize: 10,
				complanyIds: this._.map(user.complany, 'id'),
			}).then((res) => {
				let tmp = [];
				!!res && res.rows.forEach((item)=>{
					let img = item.carPhotos.split(',')[0];
					tmp.push({image: `${config.IMG_URL}${img}`, nickName: item.carNum, carInfo: item })
				});
				if(pageNum === 1){
					this.list = tmp;
					this.pageNo = pageNo;
				} else {
					this.list = this._.concat(this.list, tmp);
				}
				this.pageNo = this.pageNo+1;
				uni.stopPullDownRefresh();
			});
		}
	}
};
</script>

<style lang="scss"></style>
