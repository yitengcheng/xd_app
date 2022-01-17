<template>
	<view class="content" style="align-items: center;">
		<view v-if="(list || []).length === 0" style="display:flex;flex-direction: column;align-items: center;justify-content: center;">
			<u-image  src="/static/img/emptyEvaluate.png"></u-image>
			<text>暂无评论</text>
		</view>
		<view class="comment_box" v-if="(list || []).length > 0" v-for="(item,index) in list" :key="index">
			<view class="comment_top_box">
				<u-image src="/static/img/head.png" width="50" height="50" shape="circle"></u-image>
				<view style="width: 100%;margin-left: 10px;">
					<view class="comment_user_info">
						<view class="comment_user_name">{{item.complany_name}}</view>
						<view style="display: flex;flex-direction: row;align-items: center;">
							<text class="comment_user_star">{{item.evaluate_level}}</text>
							<u-icon name="star-fill" size="16" color="#FFD101"></u-icon>
						</view>
					</view>
					<view style="color: #666666;font-size: 12px;">{{dayjs(item.handle_time).format('YYYY年MM月DD日') }}</view>
				</view>
			</view>
			<view>{{item.evaluate}}</view>
		</view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		onLoad(option) {
			this.carId = option.carId;
		},
		mounted() {
			this.initComments(1);
		},
		onPullDownRefresh() {
			this.list = [];
			this.initComments(1);
		},
		onReachBottom() {
			this.initComments(this.pageNo);
		},
		data() {
			return {
				carId: '',
				pageNo: 1,
				list: [],
			};
		},
		methods:{
			async initComments(pageNum){
				const res = await api.comments({
					pageNum,
					pageSize: 10,
					carId: this.carId
				});
				uni.stopPullDownRefresh();
				if(res?.total === 0){
					this.list = [];
					this.pageNo = 1;
					return;
				}
				this.list = pageNum === 1 ? res?.rows : this._.concat(this.list, res?.rows);
				this.pageNo = pageNum === 1 ? 2 : this.pageNo + 1;
			}
		}
	}
</script>

<style lang="scss">
.comment_box {
	width: 90%;
	display: flex;
	flex-direction: column;
	background-color: #FFFFFF;
	border-radius: 8px;
	padding: 10px;
	margin-top: 10px;
}
.comment_top_box {
	display: flex;
	flex-direction: row;
	width: 100%;
}
.comment_user_info {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.comment_user_name {
	font-size: 16px;
	font-weight: bold;
}
.comment_user_star {
	font-size: 12px;
}
</style>
