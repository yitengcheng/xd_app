<template>
	<view class="content" style="align-items: center;">
		<view class="search_box">
			<uni-easyinput v-model="keyword" placeholder="请输入关键字搜索" prefixIcon="search" :inputBorder="false" style="background-color: #FFD101;border-radius: 20px;border: 1px solid #FFD101;margin-right: 20px;"/>
			<view @click="getData(1)" class="search_text">搜索</view>
		</view>
		<view v-for="(car, index) in data" :key="index" class="car_box">
			<u-image :showError="false" :src="car.carPhoto" width="80" height="55" shape="square"></u-image>
			<view class="car_box_info" style="flex: 1;">
				<view class="car_box_info_title">{{car.carBrand}}</view>
				<view class="car_box_info_plate">{{car.carNum}}</view>
			</view>
			<view class="car_box_info">
				<u-button type="primary" class="look_btn" @click="clickItem(car)">查看</u-button>
				<view class="car_box_date">{{dayjs(((car || {}).wxOrder || {}).estimateReturnTime).format('YYYY-MM-DD')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
export default {
	data() {
		return {
			keyword: '',
			data: [],
			pageNo: 1,
		};
	},
	onLoad() {
		this.getData(1);
		uni.$on('returnCar', ()=>{
			this.getData(1);
		});
	},
	onPullDownRefresh() {
		this.getData(1);
	},
	onReachBottom() {
		this.getData(this.pageNo);
	},
	methods: {
		getData(pageNum) {
			api.carList({
				pageNum,
				pageSize: 10,
				status: 1,
				keyword: this.keyword,
			}).then(res =>{
				uni.stopPullDownRefresh();
				let tmp = [];
				if(res?.rows?.length > 0){
					let { rows } = res;
					rows.forEach(row => {
						let photo = row?.carPhotos?.split(',');
						delete row?.carPhotos;
						tmp.push({
							carPhoto: `${config.IMG_URL}${photo?.[0]}`,
							...row,
						});
					});
					pageNum === 1 ? this.pageNo = 2 : this.pageNo = this.pageNo + 1;
					pageNum === 1 ? this.data = tmp : this.data = this._.concat(this.data, tmp);
				}
			});
		},
		clickItem(e){
			uni.navigateTo({
				url: `/pages/model/returnCar/ReturnCarDetail?id=${e.id}`
			})
			
		}
	}
};
</script>

<style lang="scss" scoped>
	.search_box {
		display: flex;
		flex-direction: row;
		width: 90%;
		align-items: center;
		justify-content: space-between;
		margin-top: 5px;
	}
	.search_text {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #333333;
	}
	.car_box {
		width: 90%;
		display: flex;
		flex-direction: row;
		border-radius: 10px;
		flex-direction: 5px;
		background-color: #FFFFFF;
		padding: 15px 10px;
		margin-top: 5px;
		justify-content: space-around;
	}
	.car_box_info {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.car_box_info_title {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #333333;
	}
	.car_box_info_plate {
		background-color: #FFD101;
		border-radius: 2px;
		font-size: 10px;
		font-family: Microsoft YaHei;
		padding: 3px;
		width: 51px;
	}
	.look_btn {
		width: 50px;
		height: 20px;
		border-radius: 25px;
		font-size: 12px;
	}
	.car_box_date {
		font-size: 10px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #999999;
	}
</style>
