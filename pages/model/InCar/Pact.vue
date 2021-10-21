<template>
	<view class="content">
		<web-view :src="src" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		onLoad(option) {
			uni.showLoading({
				title: '加载中'
			})
			api.send(option.orderId).then((res = {}) => {
				if (res.data) {
					this.src = res.data;
					uni.hideLoading();
				}
			})
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
