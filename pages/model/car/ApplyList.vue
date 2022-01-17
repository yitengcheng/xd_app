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
			<view style="border-top: #F3F3F3 1px solid;">
				<u-input placeholder="请输入车牌或车型进行搜索" v-model="keywords">
					<template slot="suffix">
						<u-icon name="search" @click="search"></u-icon>
					</template>
				</u-input>
			</view>
		</u-sticky>
		<view
			class="apply_info_box"
			v-if="list.length > 0"
			v-for="(item, index) in list"
			:key="index"
			@click="toApplyDetail(item.id, current)"
		>
			<u-image :src="item.carPhoto" width="120" height="100"></u-image>
			<view class="info_box">
				<view class="info_row">
					<view style="font-size: 16px; font-weight: bold;">{{ item.car.carNum }}</view>
					<view style="font-size: 14px;">￥{{ item.car.upperPrice || 0 }} 元/日</view>
					<view style="font-size: 14px;color:#FFD101;">{{status[item.status]}}</view>
				</view>
				<view class="info_row">
					<view style="font-size: 14px;">{{ item.complanyName }}</view>
					<view style="display: flex;flex-direction: row;align-items: center;">
						<text style="font-size: 14px;">{{ item.leave }}</text>
						<u-icon name="star-fill" color="#FFD101"></u-icon>
					</view>
				</view>
				<view class="info_row">
					<view style="font-size: 12px;">
						{{
							`${dayjs(item.beginTime).format('YYYY年MM月DD日')}至${dayjs(
								item.endTime
							).format('YYYY年MM月DD日')}`
						}}
					</view>
				</view>
			</view>
		</view>
		<u-image
			v-if="list.length === 0"
			src="/static/img/emptyEvaluate.png"
			style="align-self: center;"
		></u-image>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
import { toFixed } from '../../../common/utils.js';
export default {
	data() {
		return {
			current: 0,
			keywords: '',
			pageNo: 1,
			list: [],
			items: [
				{
					name: '申请我的调车'
				},
				{
					name: '我的调车申请'
				}
			],
			status: {
				0: '申请中',
				1: '已同意',
				2: '已拒绝',
				3: '已归还',
			}
		};
	},
	mounted() {
		this.initApplyList(1);
	},
	onPullDownRefresh() {
		this.initApplyList(1);
	},
	onReachBottom() {
		this.initApplyList(this.pageNo);
	},
	methods: {
		toApplyDetail(applyId) {
			uni.navigateTo({
				url: `/pages/model/car/ApplyDetail?applyId=${applyId}&flag=${this.current}`
			});
		},
		search() {
			this.list = [];
			this.initApplyList(1);
		},
		onClickItem(e){
			this.current = e.index;
			this.keywords = '';
			this.list = [];
			this.$nextTick(() => {
				this.initApplyList(1);
			});
		},
		async initApplyList(pageNum) {
			let res;
			if (this.current === 0) {
				res = await api.applyList({
					pageNum,
					pageSize: 10,
					keywords: this.keywords
				});
			} else {
				res = await api.meApplyList({
					pageNum,
					pageSize: 10,
					keywords: this.keywords
				});
			}
			uni.stopPullDownRefresh();
			if (res?.total === 0) {
				this.list = [];
				this.pageNo = 1;
				return;
			}
			if (res?.rows?.length > 0) {
				const { rows } = res;
				let tmp = [];
				rows.forEach(item => {
					let carPhoto = item?.car?.carPhotos
						? `${config.IMG_URL}${item?.car?.carPhotos?.split(',')[0]}`
						: '/static/img/defalut.png';
					let { leave, ...other } = item;
					tmp.push({
						carPhoto,
						leave: toFixed(leave, 1),
						...other
					});
				});
				this.pageNo = pageNum === 1 ? 2 : this.pageNo + 1;
				this.list = pageNum === 1 ? tmp : this._.concat(this.list, tmp);
			}
		}
	}
};
</script>

<style lang="scss">
.apply_info_box {
	display: flex;
	flex-direction: row;
	width: 90%;
	align-self: center;
	background-color: #ffffff;
	border-radius: 8px;
	margin-top: 10px;
	padding: 10px;
}
.info_box {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin-left: 10px;
	justify-content: space-around;
}
.info_row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>
