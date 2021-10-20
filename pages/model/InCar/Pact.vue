<template>
	<view class="content">
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		onLoad(option) {
			api.send(option.orderId).then((res = {}) => {
				if(res.data){
					this.src = res.data;
				}
			})
		},
		data() {
			return {
				src: '',
			};
		},
	};
</script>

<style lang="scss">
</style>
