<template>
	<view class="content">
		<view class="t-icon t-icon-morentouxiang head"></view>
		<text class="name">{{(user.user || {}).nickName}}</text>
		<uni-data-picker v-show="((user || {}).complany || []).length >= 2" :value="complanyId" :localdata="complanys" @change="selectComplany" class="complanyPicker"></uni-data-picker>
		<view v-for="(item,index) in data" :key="index" @click="toPage(item)">
			<view class="item">
				<view class="t-icon" :class="item.iconName"></view>
				<text class="item_text">{{item.title}}</text>
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
					{title: '接单/通知', iconName: 't-icon-shangjiaguanli_daibanshixiang', path: '/pages/model/my/Todo'},
					{title: '历史订单', iconName: 't-icon-dingdanguanlix', path: '/pages/model/my/Orders'},
					{title: '合同模板', iconName: 't-icon-shuoming', path: '/pages/model/my/ContractTemplate'},
					{title: '修改密码', iconName: 't-icon-zhongzhimima', path: '/pages/model/login/ResetPassword'},
					{title: '修改公司信息', iconName: 't-icon-qiyexinxiguanli', path: '/pages/model/my/UpdateComplanyInfo'},
					{title: '身份证读卡器申领', iconName: 't-icon-jifangmenjinkashenlingbiangeng', path: '/pages/model/my/ReaderApply'},
				],
				user: uni.getStorageSync('user'),
				complanys: [],
				complanyId: '',
			}
		},
		mounted() {
			this.initComplany();
		},
		methods: {
			initComplany() {
				let {
					complany
				} = this.user;
				if(complany){
					complany.forEach(o => {
						this.complanys.push({
							text: o.complanyName,
							value: o.id,
							data: o,
						});
					});
					this.complanyId = uni.getStorageSync('complanyId');
				}
			},
			selectComplany(e) {
				uni.setStorageSync('complanyId', e.detail.value[0].value);
				this.$store.dispatch('CLOSE_SOCKET');
				this.$store.dispatch('WEBSOCKET_INIT', e.detail.value[0].value);
				uni.$emit('inCar');
				uni.$emit('returnCar');
				uni.$emit('car');
			},
			toPage(e){
				uni.navigateTo({
					url: e.path,
				})
			},
			logout(){
				let userName = uni.getStorageSync('userName');
				let password = uni.getStorageSync('password');
				uni.clearStorageSync();
				uni.setStorageSync('userName',userName);
				uni.setStorageSync('password',password);
				uni.reLaunch({url: '/pages/model/login/Login'});
			},
			clear(){
				let userName = uni.getStorageSync('userName');
				let password = uni.getStorageSync('password');
				uni.clearStorageSync();
				uni.setStorageSync('userName',userName);
				uni.setStorageSync('password',password);
				uni.showToast({
					title: '清理完毕',
				})
			}
		}
	}
</script>

<style lang="scss">
.head {
	width: 120rpx;
	height: 120rpx;
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
.item_text {
	margin-left: 30rpx;
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
