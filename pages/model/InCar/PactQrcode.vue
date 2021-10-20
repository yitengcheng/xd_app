<template>
	<view class="content">
		<canvas id="qrcode" canvas-id="qrcode" style="width: 354px;height: 354px;" />
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import uQRCode from '../../../components/uqrcode/common/uqrcode.js';
	export default {
		onLoad(option) {
			this.pactId = option.pactId;
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
			    console.log(res)
			})
		},
	};
</script>

<style lang="scss">
</style>
