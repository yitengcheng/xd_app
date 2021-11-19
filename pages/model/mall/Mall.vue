<template>
	<view class="content">
		<u-swiper :list="list" :circular="true" height="150px"></u-swiper>
		<WaterfallsFlow :wfList="productList" @itemTap="itemTap"></WaterfallsFlow>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	import WaterfallsFlow from '../../../components/WaterfallsFlow/WaterfallsFlow.vue';
	export default {
		components:{
			WaterfallsFlow,
		},
		data() {
			return {
				pageNum: 1,
				productList: [],
				list:['/static/img/mall_back.png']
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
		methods:{
			initProduct(pageNum){
				api.productList({
					pageNum,
					pageSize: 10,
				}).then(res => {
					uni.stopPullDownRefresh();
					let tmp = [];
					if(res?.total === 0){
						this.productList = [];
						this.pageNum = 0;
					}
					if(res?.rows?.length > 0){
						let { rows } = res;
						rows.forEach(row => {
							let url = row?.images?.split(',');
							tmp.push({
								image: `${config.IMG_URL}${url?.[0]}`,
								nickName: row.title,
								price: row.rent,
								productInfo: row,
								unit: '元/月',
								id: row.id,
							})
						});
						pageNum === 1 ? this.productList = tmp : this.productList = this._.concat(this.productList, tmp);
						pageNum === 1 ? this.pageNum = 2 : this.pageNum = this.pageNum + 1;
					}
				})
			},
			itemTap(item){
				uni.navigateTo({
					url: `/pages/model/mall/Apply?id=${item.id}`
				});
			}
		},
	}
</script>

<style lang="scss">

</style>
