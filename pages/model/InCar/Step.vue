<template>
	<view class="content">
		<uni-steps :active="active" :options="options" direction="row"></uni-steps>
		<button v-for="(item,index) in options" :key="index" type="primary" class="btn" v-show="active + 1 === index"
			@click="validation(item.title)">{{item.title}}</button>
		<button v-if="pactFlag" type="primary" class="pactBtn" @click="toPact">电子合同</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: -1,
				options: [],
				pactFlag: false,
			};
		},
		onLoad(option) {
			let checks = option.checks.split(',');
			checks.forEach(o => {
				this.options.push({
					title: o
				})
			});
		},
		methods: {
			toPact() {
				uni.navigateTo({
					url: '/pages/model/InCar/Pact'
				})
			},
			validation(checkTitle) {
				switch (checkTitle) {
					case '人脸核验':
						this.active = this.active + 1;
						this.$nextTick(() => {
							if (this.active === this.options.length - 1) {
								this.pactFlag = true;
							}
						});
						break;
					case '身份证真伪':
						this.active = this.active + 1;
						this.$nextTick(() => {
							if (this.active === this.options.length - 1) {
								this.pactFlag = true;
							}
						});
						break;
					case '驾照存分查询':
						this.active = this.active + 1;
						this.$nextTick(() => {
							if (this.active === this.options.length - 1) {
								this.pactFlag = true;
							}
						});
						break;
					case '老赖查询':
						this.active = this.active + 1;
						this.$nextTick(() => {
							if (this.active === this.options.length - 1) {
								this.pactFlag = true;
							}
						});
						break;
					default:
						uni.showToast({
							title: '功能尚未开发完成',
							icon: 'none'
						});
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.pactBtn {
		margin-top: 200rpx;
	}

	.btn {
		margin-top: 200rpx;
	}
</style>
