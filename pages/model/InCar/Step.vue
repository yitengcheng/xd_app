<template>
	<view class="content">
		<uni-steps :active="active" :options="options" direction="column"></uni-steps>
		<view class="info_box">
			<text v-show="!!licenseText" class="info_text">驾照存分：{{licenseText}}</text>
			<text v-show="!!zdryText" class="info_text">重点人员核查：{{zdryText}}</text>
			<text v-show="!!faceText" class="info_text">人脸匹配度：{{faceText}}</text>
		</view>
		<button v-for="(item,index) in options" :key="index" type="primary" class="btn" v-show="active + 1 === index"
			@click="validation(item.title)">{{item.title}}</button>
		<button v-if="pactFlag" type="primary" class="pactBtn" @click="toPact">租车合同</button>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				active: -1,
				options: [],
				pactFlag: false,
				idCard: '',
				name: '',
				zdryText: '',
				licenseText: '',
				faceText: '',
			};
		},
		onLoad(option) {
			let checks = option.checks.split(',');
			this.idCard = option.idCard;
			this.name = option.name;
			checks.forEach(o => {
				this.options.push({
					title: o
				})
			});
		},
		mounted() {
			this.autoCheck();
		},
		methods: {
			autoCheck() {
				this.options.forEach(o => {
					if (o.title === '重点人员查询') {
						api.checkZtryService(this.idCard).then(res => {
							this.active = this.active + 1;
							this.zdryText = res.data.msg;
							this.$nextTick(() => {
								if (this.active === this.options.length - 1) {
									this.pactFlag = true;
								}
							});
						});
					}
					if (o.title === '驾照存分查询') {
						api.checkLicense(this.idCard).then(res => {
							this.active = this.active + 1;
							this.licenseText = (res.data || {}).data ? `已被扣除${res.data.data}分` : res.data
								.msg;
							this.$nextTick(() => {
								if (this.active === this.options.length - 1) {
									this.pactFlag = true;
								}
							});
						});
					}
					if (o.title === '老赖查询') {
						this.active = this.active + 1;
						this.$nextTick(() => {
							if (this.active === this.options.length - 1) {
								this.pactFlag = true;
							}
						});
					}
				});
			},
			toPact() {
				uni.navigateTo({
					url: '/pages/model/InCar/Pact'
				})
			},
			validation(checkTitle) {
				switch (checkTitle) {
					case '人脸核验':
						uni.showModal({
							title: '人脸核验',
							content: '即将开启人脸核验，点击确认开启核验。',
							confirmText: '确认',
							success: (e) => {
								e.confirm && uni.chooseVideo({
									sourceType: ['camera', 'album'],
									maxDuration: 3,
									success: (video) => {
										// #ifdef APP-PLUS
										const path = plus.io.convertLocalFileSystemURL(video.tempFilePath) //绝对路径
										const fileReader = new plus.io.FileReader()
										// #endif
										fileReader.readAsDataURL(path)
										fileReader.onloadend = (res) => { //读取文件成功完成的回调函数
											api.checkFace({
												idCard: this.idCard,
												name: this.name,
												livenessType: 'SILENT',
												videoBase64: res.target.result
											}).then(res => {
												let { flag, result } = res.data;
												if(flag){
													uni.showToast({
														title: '人脸核验通过',
														icon: 'none',
													});
													this.active = this.active + 1;
													this.$nextTick(() => {
														if (this.active === this.options.length - 1) {
															this.pactFlag = true;
														}
													});
												} else {
													uni.showModal({
														title: '人脸核验结果',
														content: '此人人脸核验匹配度过低，可能存在风险，是否强制通过？',
														confirmText: '通过',
														success: (e) => {
															if(e.confirm){
																this.active = this.active + 1;
																this.$nextTick(() => {
																	if (this.active === this.options.length - 1) {
																		this.pactFlag = true;
																	}
																});
															}
														},
													});
												}
												this.faceText = result.Sim;
											});
										}
									}
								})
							}
						})
						break;
					case '身份证真伪':
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

	.info_box {
		width: 80%;
		display: flex;
		flex-direction: column;
	}

	.info_text {
		margin-top: 20rpx;
	}

	.btn {
		margin-top: 200rpx;
	}
</style>
