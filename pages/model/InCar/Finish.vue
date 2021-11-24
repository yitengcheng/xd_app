<template>
	<view class="content" style="align-items: center;">
		<image src="../../../static/img/finish.png"></image>
		<view>请将{{plateNo}}车辆交于客户</view>
		<u-button type="primary" @click="toIndex">返回首页</u-button>
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
					url: '/pages/model/my/Orders',
					success: () => {
						uni.$emit('orders');
						uni.$emit('returnCar');
						uni.$emit('car');
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
