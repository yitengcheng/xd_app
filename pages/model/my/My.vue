<template>
	<view class="content">
		<text class="iconfont icon-morentouxiang head"></text>
		<text class="name">admin</text>
		<view v-for="(item,index) in Data" :key="index" @click="toPage(item)">
			<view class="item">
				<text class="iconfont" :class="item.iconName"></text>
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
					{title: '代办事项', iconName: 'icon-shangjiaguanli_daibanshixiang', path: '/pages/model/my/Todo'},
					{title: '订单管理', iconName: 'icon-dingdanguanlix', path: '/pages/model/my/Orders'},
					{title: '合同模板', iconName: 'icon-shuoming', path: '/pages/model/my/ContractTemplate'},
					// {title: '关于我们', iconName: 'icon-guanyuwomen-copy', path: ''},
					{title: '修改密码', iconName: 'icon-zhongzhimima', path: '/pages/model/login/ResetPassword'},
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
	font-size: 80px;
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
</style>
