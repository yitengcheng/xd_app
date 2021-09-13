<template>
	<view class="content">
		<image src="../../../static/img/finish.png"></image>
		<view @click="toIndex">请将{{plateNo}}车辆交于客户</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				plateNo: ''
			};
		},
		onBackPress(){
			this.toIndex();
		},
		onBackPress() {
		    this.toIndex();
		},
		methods:{
			toIndex(){
				uni.switchTab({
					url: '/pages/model/InCar/index'
				});
			},
		}
	}
</script>

<style lang="scss">
</style>
