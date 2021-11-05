<template>
	<view class="content">
		<web-view :src="src" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		onLoad(option) {
			api.send(option.orderId).then((res = {}) => {
				if (res.data) {
					this.src = res.data;
					let timer = setInterval(()=>{
						api.orderDetail(option.orderId).then((res = {}) => {
							let { data } = res;
							if (data.signStatus === 1) {
								clearInterval(timer);
								uni.navigateTo({
									url: `/pages/model/InCar/PactQrcode?pactId=${data.contract}&orderId=${option.orderId}`
								})
							}
						})
					}, 3000);
				} else {
					uni.navigateBack()
				}
			});
		},
		data() {
			return {
				src: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			};
		},
	};
</script>

<style lang="scss">
</style>
