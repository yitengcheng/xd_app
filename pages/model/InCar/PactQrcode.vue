<template>
	<view class="content" style="align-items: center;">
		<canvas id="qrcode" canvas-id="qrcode" style="width: 354px;height: 354px;" />
		<text>请客户打开优行小滴小程序，在首页点击合同扫码，扫描上面的二维码</text>
		<u-button type="primary" @click="uploadPact" class="btn">上传纸质合同</u-button>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import uQRCode from '../../../components/uqrcode/common/uqrcode.js';
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				timer: undefined,
				pactId: '',
				orderId: undefined,
			};
		},
		onBackPress(e) {
			this.timer && clearInterval(this.timer);
		},
		methods:{
			uploadPact(){
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.showLoading({
							mask: true,
							title: '合同上传中'
						});
						res.tempFiles.forEach(file => {
							uni.uploadFile({
								url: `${config.API_URL}/tool/oss/upload`,
								filePath: file.path,
								name: 'file',
								header: {
									Authorization: 'Bearer ' + uni.getStorageSync('tonken')
								},
								success: (res) => {
									uni.hideLoading();
									this.timer && clearInterval(this.timer);
									let result = JSON.parse(res.data);
									api.finishCar({
										orderId: this.orderId,
										contracts: result.data,
									}).then(res => {
										uni.navigateTo({
											url: '/pages/model/InCar/Finish'
										});
									});
								},
							});
						});
					}
				});
			},
		},
		onLoad(option) {
			this.pactId = option.pactId;
			this.orderId = option.orderId;
			this.$nextTick(() => {
				this.timer = setInterval(() => {
					if(this.orderId){
						api.orderDetail(this.orderId, false).then((res = {}) => {
							let { data } = res;
							if (data?.signStatus === 2) {
								clearInterval(this.timer);
								uni.navigateTo({
									url: `/pages/model/InCar/Finish`,
								})
							}
						})
					}
				}, 3000);
			});
		},
		onReady() {
			uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					size: 354,
					margin: 10,
					text: this.pactId,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'png',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H
				})
				.then(res => {
					process.env.NODE_ENV === 'development' && console.log(res)
				})
		},
	};
</script>

<style lang="scss" scoped>
	.btn {
		width: 90%;
		margin-top: 200rpx;
	}
</style>
