<template>
	<view>
		
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				pageNum: 1,
			};
		},
		mounted() {
			this.initProductOrders();
		},
		methods: {
			initProductOrders(pageNo){
				let pageNum = pageNo ?? 1;
				api.productOrders({
					pageNum,
					pageSize: 10,
					complanyId: uni.getStorageSync('complanyId'),
				}).then( res => {
					console.log(res ?? {})
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
