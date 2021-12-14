<template>
	<view>
		<image src="/static/img/xuzhi_00.jpg" style="width: 788rpx; height: 4000rpx;"></image>
		<web-view v-if="src" :src="src"></web-view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				src: ''
			};
		},
		mounted() {
			this.authComplany();
		},
		onReachBottom() {
			this.payAuth();
		},
		methods:{
			async authComplany(){
				const res = await api.authComplany(uni.getStorageSync('complanyId'));
				if(res.data){
					this.getQYSAuthPage();
				}
			},
			async getQYSAuthPage(){
				const result = await api.getQYSAuthPage(uni.getStorageSync('complanyId'));
				const { msg, data } = result;
				if(msg){
					uni.showModal({
						title: '提示',
						content: msg,
						showCancel:false,
						success: () => {
							uni.navigateBack();
						}
					});
					return
				}
				this.src = data;
			},
			payAuth(){
				uni.showModal({
					title: '提示',
					content: '我已认真阅读用户需知',
					confirmText: '同意并继续',
					cancelText: '拒绝',
					success:(e) => {
						if(e.confirm){
							api.payAuthMoney({
								 complanyId: uni.getStorageSync('complanyId'),
								 type: false,
							}).then(res => {
								if(res?.data){
									uni.requestPayment({
										provider: 'wxpay',
										orderInfo: res?.data,
										success: () => {
											this.getQYSAuthPage();
										}
									})
								}
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
