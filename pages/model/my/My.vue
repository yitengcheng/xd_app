<template>
	<view class="content">
		<image src="../../../static/img/default_head.png" class="head" mode="aspectFill"></image>
		<text class="name">admin</text>
		<view v-for="(item,index) in Data" :key="index" @click="toPage(item)">
			<view class="item">
				<image class="item_icon" :src="item.icon"></image>
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Data: [
					{title: '使用说明', icon: '../../../static/img/explain.png', path: ''},
					{title: '关于我们', icon: '../../../static/img/aboutus.png', path: ''},
					{title: '修改密码', icon: '../../../static/img/resetPassword.png', path: '/pages/model/login/ResetPassword'},
				]
			}
		},
		methods: {
			toPage(e){
				uni.navigateTo({
					url: e.path,
				})
			}
		}
	}
</script>

<style lang="scss">
.head {
	height: 200rpx;
	width: 200rpx;
	margin-top: 100rpx;
}
.name {
	margin-top: 80rpx;
	margin-bottom: 80rpx;
}
.item {
	height: 45px;
	width: 730rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	border-bottom: #808080 1rpx solid;
}
.item_icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
}
</style>
