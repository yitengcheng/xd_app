<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box">
			<swiper-item v-for="(item, index) in (orderInfo || {}).carPhotos" :key="index"><image :src="item" class="swiper_img" mode="aspectFill"></image></swiper-item>
		</swiper>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>订单信息</text>
			</view>
			<view class="line"></view>
			<text>【支付状态】{{ orderInfo.payStatus === 'NOTPAY' ? '未付款' : orderInfo.payStatus === 'SUCCESS' ? '付款成功' : orderInfo.payStatus === 'REFUNDED' ? '退款成功' : orderInfo.payStatus === '到店付款' ? '到店付款' : '未知状态' }}</text>
			<text>【租赁费用】{{ orderInfo.shouldMoney / 100 || 0 }}</text>
			<text>【预计交车时间】{{ dayjs(orderInfo.wantCarTime).format('YYYY-MM-DD HH:mm:ss') }}</text>
			<text>【预计还车时间】{{ dayjs(orderInfo.estimateReturnTime).format('YYYY-MM-DD HH:mm:ss') }}</text>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<text>【交车地点】{{ orderInfo.address }}</text>
				<u-icon name="map" color="#1B90D1" @click="showMap(orderInfo.latitude, orderInfo.address)" />
			</view>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<text>【还车地点】{{ orderInfo.returnAddress }}</text>
				<u-icon name="map" color="#1B90D1" @click="showMap(orderInfo.returnLatitude, orderInfo.returnAddress)" />
			</view>
		</view>
		<view class="info_box" v-if="orderInfo.customer">
			<view class="info_title">
				<view class="adorn"></view>
				<text>交易信息</text>
			</view>
			<view class="line"></view>
			<text>【姓名】{{ (orderInfo.customer || {}).name || '无' }}</text>
			<text>【身份证号】{{ (orderInfo.customer || {}).idcard || '无' }}</text>
			<text>【手机号】{{ (orderInfo.customer || {}).phoneNumber || '无' }}</text>
			<text v-if="(orderInfo || {}).crvTime">【实际交车时间】{{ (orderInfo || {}).crvTime || '无' }}</text>
			<text v-if="(orderInfo || {}).returnTime">【实际还车时间】{{ (orderInfo || {}).returnTime || '无' }}</text>
			<text v-if="''">【实际租车天数】{{ '' || '无' }}</text>
		</view>
		<u-button v-show="type === '1'" @click="orderHandle(1)" class="btn" type="primary">确认接单</u-button>
		<u-button v-show="type === '1'" @click="orderHandle(2)" class="btn">放弃接单</u-button>
		<u-button v-show="type === '2'" @click="orderHandle(4)" class="btn" type="primary">交车</u-button>
		<u-button v-show="type === '2'" @click="orderHandle(3)" class="btn" type="error">{{ orderInfo.payStatus === '到店付款' ? '取消订单' : '确认退款' }}</u-button>
		<u-button v-show="!!orderInfo.contract" @click="pact" class="btn">合同</u-button>
		<u-popup :show="show" mode="center">
			<map :longitude="longitude" :latitude="latitude" :markers="marker" :show-location="true" style="width: 750rpx; height: 500rpx;"></map>
			<u-button type="primary" @click="closeMap" class="close_map">关闭</u-button>
		</u-popup>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
export default {
	data() {
		return {
			type: '0',
			orderInfo: {},
			handleId: '',
			show: false,
			longitude: '',
			latitude: '',
			marker: []
		};
	},
	onLoad(option) {
		this.type = option?.type ?? '0'; // 0 列表进入 1 新订单确认或取消 2 退款确认 3交车
		this.handleId = option.handleId ?? '';
		this.initOrderDetail(option.id);
	},
	onBackPress() {
		uni.switchTab({
			url: 'pages/model/my/Orders'
		});
	},
	methods: {
		initOrderDetail(id) {
			api.orderDetail(id).then((res = {}) => {
				let { data } = res;
				if (data) {
					let tmp = [];
					data?.car?.carPhotos?.split(',').forEach(o => {
						o ? tmp.push(`${config.IMG_URL}${o}`) : tmp.push('/static/img/defalut.png');
					});
					delete res?.data?.car?.carPhotos;
					if (res?.data?.comfirStatus && this.type !== '3' && this.type !== '0') {
						this.type = '2';
					}
					this.orderInfo = {
						carPhotos: tmp,
						...res.data
					};
				}
			});
		},
		orderHandle(type) {
			// 1 确认接单 2 取消接单 3 确认退款
			if(!this.orderInfo?.car?.id && (type === 1 || type === 4)){
				uni.showModal({
					title: '提示',
					content: '订单异常，请取消后重新下单',
					showCancel:false,
				});
				return
			}
			let func = type === 1 ? api.orderConfirm : type === 2 ? api.orderCannel : type === 3 ? api.orderCannel : undefined;
			if (type === 4) {
				uni.navigateTo({
					url: `/pages/model/InCar/InCarDetail?id=${this.orderInfo?.car?.id}`
				});
				return;
			}
			func({
				orderId: this.orderInfo.orderId,
				handleId: this.handleId
			}).then(res => {
				if (res) {
					this.initOrderDetail(this.orderInfo.orderId);
					uni.$emit('inCar');
					uni.$emit('returnCar');
					uni.$emit('car');
					uni.$emit('orders');
					if (type === 1) {
						uni.showModal({
							title: '提示',
							content: '现在是否交车',
							success: e => {
								if (e.confirm) {
									uni.navigateTo({
										url: `/pages/model/InCar/InCarDetail?id=${this.orderInfo.car.id}`
									});
								}
							}
						});
						return;
					}
					uni.showModal({
						title: '提示',
						content: '操作成功',
						showCancel: false,
						success: () => {
							uni.navigateBack();
						}
					});
				}
			});
		},
		showMap(latitude, address) {
			if (!latitude) {
				uni.showModal({
					title: '提示',
					content: '下单人未上传坐标，无法打开地图',
					showCancel: false
				});
				return;
			}
			this.show = true;
			this.$nextTick(() => {
				this.marker = [
					{
						id: 1,
						latitude: latitude?.split(',')?.[1],
						longitude: latitude?.split(',')?.[0],
						iconPath: '/static/img/location.png',
						width: 10,
						height: 10,
						callout: {
							content: address,
							display: 'ALWAYS'
						}
					}
				];
				this.longitude = latitude?.split(',')?.[0];
				this.latitude = latitude?.split(',')?.[1];
			});
		},
		closeMap() {
			this.show = false;
			this.longitude = '';
			this.latitude = '';
			this.marker = [];
		},
		pact() {
			uni.showActionSheet({
				itemList: ['查看合同', '下载合同'],
				success: res => {
					switch (res.tapIndex) {
						case 0:
							uni.navigateTo({
								url: `/pages/model/my/ContractPreview?id=${this.orderInfo.contract}`
							});
							break;
						case 1:
							let url = '';
							let suffix = '';
							let method = 'POST';
							if (this.orderInfo.contract.indexOf('/') === -1) {
								url = `${config.API_URL}/qys/download/${this.orderInfo.contract}`;
								suffix = `${this.orderInfo.contract}.PDF`
							} else {
								suffix = this.orderInfo.contract?.substring( this.orderInfo.contract?.lastIndexOf( '/' ) + 1 );
								url = `${config.IMG_URL}${this.orderInfo.contract}`;
								method = 'GET';
							}
							let dtask = null
							dtask = plus.downloader.createDownload(url, { filename: '_downloads/' + suffix, method }, (d, status) => {
								//d为下载的文件对象
								if (status == 200) {
									uni.hideLoading();
									//下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
									let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
									plus.runtime.openFile(d.filename); //选择软件打开文件
								} else {
									uni.hideLoading();
									//下载失败
									plus.downloader.clear(); //清除下载任务
								}
							});
							uni.showLoading({
								title: '下载中',
								mask: true,
							});
							dtask.setRequestHeader('Authorization', 'Bearer ' + uni.getStorageSync('tonken'));
							dtask.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
							dtask.start();
							break;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.swiper_box {
	width: 100%;
	height: 300rpx;
}

.swiper_img {
	width: 100%;
	height: 300rpx;
}

.info_box {
	width: 90%;
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: #ffffff;
	border-radius: 10px;
	margin-bottom: 10px;
	margin-top: 10px;
}
.adorn {
	width: 3px;
	height: 60%;
	background-color: #1B90D1;
	margin-right: 5px;
}
.info_title {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 42rpx;
}
.line {
	width: 100%;
	height: 1px;
	background-color: #eee;
	margin: 5px 0px;
}

.btn {
	margin-top: 30rpx;
	width: 90%;
}
.close_map {
	margin-top: 10px;
	width: 60%;
}
</style>
