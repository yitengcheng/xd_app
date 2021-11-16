<template>
	<view class="content">
		<canvas id="qrcode" canvas-id="qrcode" style="width: 354px;height: 354px;" />
		<text>请客户打开优行小滴小程序，在首页点击合同扫码，扫描上面的二维码</text>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import uQRCode from '../../../components/uqrcode/common/uqrcode.js';
	import api from '../../../api/index.js';
	export default {
		onLoad(option) {
			this.pactId = option.pactId;
			let timer = setInterval(() => {
				api.orderDetail(option.orderId).then((res = {}) => {
					let {
						data
					} = res;
					if (data.signStatus === 2) {
						clearInterval(timer);
						uni.navigateTo({
							url: `/pages/model/InCar/Finish`
						})
					}
				})
			}, 3000);
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
</style>
