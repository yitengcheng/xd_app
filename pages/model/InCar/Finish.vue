<template>
	<view class="content">
		<image src="../../../static/img/finish.png"></image>
		<view @click="toIndex">请将贵AXXXXX车辆交于客户</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			toIndex(){
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
