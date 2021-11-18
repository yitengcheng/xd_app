<template>
	<view class="content" style="align-items: center;">
		<view class="page_top" @click="() => show = true">
			<u-image width="106rpx" height="106rpx" src="/static/img/head.png"></u-image>
			<view class="page_top_info">
				<text class="name">{{complanyName}}</text>
				<text style="font-size: 14px;">ID：{{ _.random(100000000, 999999999, false) || 'youxingxiaodi'}}</text>
			</view>
		</view>
		<view class="menus_box">
			<view v-for="(item,index) in data" :key="index" @click="toPage(item)" class="item_row" :style="{borderBottom: index === (data.length - 1) ? '' : '1px solid #E0E0E0'}">
				<view style="display: flex; flex-direction: row;flex: 1;align-items: center;">
					<u-image :src="item.icon" width="30px" height="30px"></u-image>
					<text class="item_text">{{item.title}}</text>
				</view>
				<u-icon name="arrow-right" color="#999999"></u-icon>
			</view>
		</view>
		<text class="complany">贵州小滴科技有限公司 版权所有</text>
		<u-popup :show="show" mode="bottom">
			<view class="popup_box">
				<view class="popup_box_title">公司切换</view>
				<view class="line"></view>
				<view v-for="(complany, index) in complanys" class="popup_box_info">
					<view class="popup_box_info_name">
						{{complany.text}}
						<view @click="selectComplany(index)" class="change_btn">切换</view>
					</view>
					<view class="line" ></view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: [
					{title: '接单/通知',  icon: '/static/img/my_notice.png', path: '/pages/model/my/Todo'},
					{title: '历史订单',  icon: '/static/img/history_orders.png', path: '/pages/model/my/HistoryOrders'},
					{title: '合同模板',  icon: '/static/img/pact.png', path: '/pages/model/my/ContractTemplate'},
					{title: '修改密码',  icon: '/static/img/modify_password.png', path: '/pages/model/login/ResetPassword'},
					{title: '公司信息',  icon: '/static/img/company_info.png', path: '/pages/model/my/UpdateComplanyInfo'},
					{title: '硬件设备',  icon: '/static/img/devices.png', path: '/pages/model/my/Equipment'},
					{title: '硬件订单',  icon: '/static/img/indent.png', path: '/pages/model/mall/EquipmentOrder'},
					{title: '清理缓存',  icon: '/static/img/clear.png', func: 'clear'},
					{title: '退出登录',  icon: '/static/img/logout.png', func: 'logout'},
				],
				user: uni.getStorageSync('user'),
				complanys: [],
				complanyId: '',
				complanyName: '',
				show: false,
			}
		},
		mounted() {
			this.initComplany();
		},
		methods: {
			initComplany() {
				let { complany } = this.user;
				if(complany){
					complany.forEach(o => {
						this.complanys.push({
							text: o.complanyName,
							value: o.id,
							data: o,
						});
					});
					this.complanys = this._.uniqBy(this.complanys, 'value');
					this.complanyId = uni.getStorageSync('complanyId');
					this.complanyName = this._.find(complany, o => { return o.id === uni.getStorageSync('complanyId')}).complanyName;
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
			},
			toPage(e){
				if(e?.path){
					uni.navigateTo({
						url: e.path,
					})
				} else {
					this[e?.func]();
				}
				
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

<style lang="scss" scoped>
	.page_top {
		width: 100%;
		background-color: #FFD101;
		border-radius: 0px 0px 60px 60px;
		display: flex;
		flex-direction: row;
		padding: 15px 0px 60px 15px;
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
		background-color: #CDCDCD;
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
		background: #FFD101;
		border-radius: 4px;
		font-size: 12px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #333333;
	}
	.complany {
		margin-top: 40rpx;
		font-size: 12px;
		color: #bebebe;
	}
</style>
