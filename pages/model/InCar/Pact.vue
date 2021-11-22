<template>
	<view class="content">
		<web-view :src="src" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import FormInput from '../../../components/form/FormInput.vue';
	export default {
		components: {
			FormInput,
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.getContract(option.orderId);
		},
		data() {
			return {
				src: '',
				orderId: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				show: false,
				timer: undefined,
			};
		},
		onBackPress(e) {
			this.timer && clearInterval(this.timer);
		},
		methods: {
			getContract(orderId) {
				api.send({ orderId }).then((res = {}) => {
					if (res.data) {
						this.src = res.data;
						this.timer = setInterval(() => {
							api.orderDetail(orderId, false).then((res = {}) => {
								let { data } = res;
								if (data?.signStatus === 1) {
									clearInterval(this.timer);
									uni.navigateTo({
										url: `/pages/model/InCar/PactQrcode?pactId=${data.contract}&orderId=${orderId}`
									})
								}
							})
						}, 3000);
					} else {
						uni.navigateBack()
					}
				});
			},
			submit() {
				this.$refs.form.validate().then(data => {
					this.getContract(this.formData);
				}).catch(err => {
					uni.showModal({
						title: '提示',
						content: '必填项请填写完整',
						showCancel: false,
					})
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tips_box {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 10px;
	}

	.tips_title {
		font-size: 18px;
		font-weight: 700;
	}

	.form_box {
		width: 80%;
		margin: 10px 0px;
	}

	.form_btn {
		width: 80%;
	}
</style>
