<template>
	<view class="content" style="align-items: center;">
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
					url: '/pages/model/InCar/index',
					success: () => {
						uni.$emit('inCar');
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
