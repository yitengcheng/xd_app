<template>
	<view class="content" style="align-items: center;">
		<view class="page_top">
			<u-image width="106rpx" height="106rpx" src="/static/img/head.png"></u-image>
			<view class="page_top_info">
				<text class="name">
					{{ complanyName }}
					<span
						style="font-size: 8px;margin-left: 10px;"
						@click="() => (user.complany.length > 1 ? (show = true) : '')"
					>
						{{ user.complany.length > 1 ? '点击切换公司' : '' }}
					</span>
				</text>
				<text style="font-size: 14px;margin-bottom: 20px;">
					ID：{{ _.random(100000000, 999999999, false) || 'youxingxiaodi' }}
				</text>
				<view class="login_web" @click="loginWeb">登录网页版</view>
			</view>
		</view>
		<view class="menus_box">
			<view
				v-for="(item, index) in data"
				:key="index"
				@click="toPage(item)"
				class="item_row"
				:style="{ borderBottom: index === data.length - 1 ? '' : '1px solid #E0E0E0' }"
				v-if="item.permissions"
			>
				<view style="display: flex; flex-direction: row;flex: 1;align-items: center;">
					<u-image :src="item.icon" width="30px" height="30px"></u-image>
					<text class="item_text">{{ item.title }}</text>
				</view>
				<u-icon name="arrow-right" color="#999999"></u-icon>
			</view>
		</view>
		<view class="web_box">
			<text class="privacy_text" @click="goWeb('https://xd.qiantur.com/treaty')">用户协议</text>
			<text class="privacy_text">|</text>
			<text class="privacy_text" @click="goWeb('https://xd.qiantur.com/policy')">隐私政策</text>
		</view>
		<text class="complany">贵州小滴科技有限公司 版权所有</text>
		<u-popup :show="show" mode="bottom" :overlay="true" :closeOnClickOverlay="true" @close="() => (show = false)">
			<view class="popup_box">
				<view class="popup_box_title">公司切换</view>
				<view class="line"></view>
				<view v-for="(complany, index) in complanys" class="popup_box_info">
					<view class="popup_box_info_name">
						{{ complany.text }}
						<view @click="selectComplany(index)" class="change_btn">切换</view>
					</view>
					<view class="line"></view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			data: [],
			user: uni.getStorageSync('user'),
			complanys: [],
			complanyId: '',
			complanyName: '',
			show: false,
		};
	},
	mounted() {
		this.initComplany();
		this.initMenuList();
	},
	methods: {
		initMenuList() {
			this.data = [
				{
					title: '接单/通知',
					icon: '/static/img/my_notice.png',
					path: '/pages/model/my/Todo',
					permissions: true,
				},
				{
					title: '还车历史',
					icon: '/static/img/history_orders.png',
					path: '/pages/model/my/HistoryOrders',
					permissions: true,
				},
				{
					title: '合同管理',
					icon: '/static/img/pact.png',
					path: '/pages/model/my/ContractTemplate',
					permissions: this._.includes(this.user.roles, 'complany_main'),
				},
				{
					title: '员工管理',
					icon: '/static/img/yuangong.png',
					path: '/pages/model/my/StaffManagement',
					permissions: this._.includes(this.user.roles, 'complany_main'),
				},
				{
					title: '客户管理',
					icon: '/static/img/kehuguanli.png',
					path: '/pages/model/my/Customer',
					permissions: true,
				},
				{
					title: '黑名单管理',
					icon: '/static/img/kehuguanli.png',
					path: '/pages/model/my/Blacklist',
					permissions: true,
				},
				{
					title: '修改密码',
					icon: '/static/img/modify_password.png',
					path: '/pages/model/login/ResetPassword',
					permissions: true,
				},
				{
					title: '公司信息',
					icon: '/static/img/company_info.png',
					path: '/pages/model/my/UpdateComplanyInfo',
					permissions: true,
				},
				{
					title: '硬件设备',
					icon: '/static/img/devices.png',
					path: '/pages/model/my/Equipment',
					permissions: true,
				},
				{
					title: '硬件订单',
					icon: '/static/img/indent.png',
					path: '/pages/model/mall/EquipmentOrder',
					permissions: true,
				},
				{ title: '清理缓存', icon: '/static/img/clear.png', func: 'clear', permissions: true },
				{ title: '退出登录', icon: '/static/img/logout.png', func: 'logout', permissions: true },
			];
		},
		initComplany() {
			let { complany } = this.user;
			if (complany) {
				complany.forEach(o => {
					this.complanys.push({
						text: o.complanyName,
						value: o.id,
						data: o,
					});
				});
				this.complanys = this._.uniqBy(this.complanys, 'value');
				this.complanyId = uni.getStorageSync('complanyId');
				this.complanyName = this._.find(complany, o => {
					return o.id === uni.getStorageSync('complanyId');
				}).complanyName;
			}
		},
		selectComplany(e) {
			uni.setStorageSync('complanyId', this.complanys[e].value);
			this.$store.dispatch('CLOSE_SOCKET');
			this.$store.dispatch('WEBSOCKET_INIT', this.complanys[e].value);
			this.show = false;
			this.initComplany();
			uni.$emit('inCar');
			uni.$emit('returnCar');
			uni.$emit('car');
			uni.$emit('orders');
		},
		toPage(e) {
			if (e?.path) {
				uni.navigateTo({
					url: e.path,
				});
			} else {
				this[(e?.func)]();
			}
		},
		logout() {
			let userName = uni.getStorageSync('userName');
			let password = uni.getStorageSync('password');
			let privacyFlag = uni.getStorageSync('privacyFlag');
			uni.clearStorageSync();
			uni.setStorageSync('userName', userName);
			uni.setStorageSync('password', password);
			uni.setStorageSync('privacyFlag', privacyFlag);
			this.$store.dispatch('CLOSE_SOCKET');
			uni.reLaunch({ url: '/pages/model/login/Login' });
		},
		clear() {
			let userName = uni.getStorageSync('userName');
			let password = uni.getStorageSync('password');
			let privacyFlag = uni.getStorageSync('privacyFlag');
			uni.clearStorageSync();
			uni.setStorageSync('userName', userName);
			uni.setStorageSync('password', password);
			uni.setStorageSync('privacyFlag', privacyFlag);
			uni.showToast({
				title: '清理完毕',
			});
		},
		loginWeb() {
			plus.runtime.openURL('https://xd.qiantur.com/');
		},
		goWeb(url) {
			uni.navigateTo({
				url: `/pages/model/login/Web?url=${url}`,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.page_top {
	width: 100%;
	background-color: #ffd101;
	border-radius: 0px 0px 60px 60px;
	display: flex;
	flex-direction: row;
	padding: 15px 0px 40px 15px;
}
.page_top_info {
	display: flex;
	flex-direction: column;
	margin-left: 10px;
	justify-content: center;
}
.name {
	font-size: 17px;
	font-family: PingFangSC-Medium;
	color: #333333;
}
.line {
	height: 1px;
	width: 100%;
	background-color: #cdcdcd;
}
.popup_box {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.popup_box_title {
	font-size: 16px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
	margin-bottom: 10px;
	margin-top: 10px;
	padding-left: 10px;
}
.popup_box_info {
	width: 90%;
	height: 45px;
	align-self: center;
	display: flex;
	flex-direction: column;
}
.popup_box_info_name {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-left: 10px;
}
.menus_box {
	display: flex;
	flex-direction: column;
	width: 90%;
	margin-top: 26px;
}
.item_row {
	height: 58px;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.item_text {
	font-size: 14px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
	margin-left: 15px;
}
.change_btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 66px;
	background: #ffd101;
	border-radius: 4px;
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
}
.complany {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	font-size: 12px;
	color: #bebebe;
}
.privacy_text {
	margin-top: 10rpx;
	font-size: 12px;
	text-decoration: underline;
	color: #1785ff;
}
.login_web {
	font-size: 10px;
	padding: 10px;
	width: 50px;
	border-radius: 10px;
	border: #f3f3f3 1px solid;
}
.web_box {
	display: flex;
	flex-direction: row;
}
</style>
