<template>
	<view class="content">
		<uni-steps :active="active" :options="options" direction="row"></uni-steps>
		<button v-if="active >= 4" type="primary" class="pactBtn" @click="toPact">电子合同</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,
				options:[]
			};
		},
		onLoad(option) {
			let checks = option.checks.split(',');
			// checks.forEach(o=>{this.options.push(title: )})
		},
		methods:{
			toPact () {
				uni.navigateTo({
					url:'/pages/model/InCar/Pact'
				})
			}
		},
		mounted() {
			const time = setInterval(()=>{
				if(this.active < this.options.length){
					this.active ++;
				} else {
					clearInterval(time);
				}
			},2000);
		}
	}
</script>

<style lang="scss">
.pactBtn {
	margin-top: 50rpx;
}
</style>
