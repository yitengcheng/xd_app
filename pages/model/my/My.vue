<template>
	<view class="content">
		<text class="iconfont icon-morentouxiang head"></text>
		<text class="name">{{(user.user || {}).nickName}}</text>
		<view v-for="(item,index) in data" :key="index" @click="toPage(item)">
			<view class="item">
				<text class="iconfont" :class="item.iconName"></text>
				<text>{{item.title}}</text>
			</view>
		</view>
		<button @click="logout" type="warn" class="logout">退出登录</button>
		<button @click="clear" type="warn" class="logout">清理本地缓存</button>
		<text class="complany">贵州小滴科技有限公司 版权所有</text>
	</view>
</template>

<script>
	import uQRCode from '../../../components/uqrcode/common/uqrcode.js'
	export default {
		data() {
			return {
				data: [
					{title: '代办事项', iconName: 'icon-shangjiaguanli_daibanshixiang', path: '/pages/model/my/Todo'},
					{title: '订单管理', iconName: 'icon-dingdanguanlix', path: '/pages/model/my/Orders'},
					{title: '合同模板', iconName: 'icon-shuoming', path: '/pages/model/my/ContractTemplate'},
					{title: '修改密码', iconName: 'icon-zhongzhimima', path: '/pages/model/login/ResetPassword'},
					{title: '读卡器申领', iconName: 'icon-jifangmenjinkashenlingbiangeng', path: '/pages/model/my/ReaderApply'},
				],
				user: uni.getStorageSync('user')
			}
		},
		methods: {
			toPage(e){
				uni.navigateTo({
					url: e.path,
				})
			},
			logout(){
				uni.reLaunch({url: '/pages/model/login/Login'});
			},
			clear(){
				uni.clearStorageSync();
				uni.showToast({
					title: '清理完毕',
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
.complany {
	margin-top: 40rpx;
	font-size: 12px;
	color: #bebebe;
}
.logout {
	margin-top: 100rpx;
	width: 60%;
}
</style>
