<template>
	<view class="content">
		<uni-steps :active="active" :options="options" direction="column"></uni-steps>
		<view class="info_box">
			<text v-show="!!licenseText" class="info_text">驾照存分：{{licenseText}}</text>
			<text v-show="!!zdryText" class="info_text">重点人员核查：{{zdryText}}</text>
			<text v-show="!!faceText" class="info_text">人脸匹配度：{{faceText}}</text>
			<text v-show="!!blackText" class="info_text">老赖信息：{{blackText}}</text>
			<text v-show="!!blackListText" class="info_text">平台黑名单记录：{{blackListText}}</text>
		</view>
		<button v-for="(item,index) in options" :key="index" type="primary" class="btn" v-show="active + 1 === index"
			@click="validation(item.title)">{{item.title === '电子合同' ? '电子合同签订' : item.title}}</button>
		<view v-if="pactFlag" class="pactBtn">
			<button type="primary" @click="toPact">{{pactBtnText}}</button>
		</view>

	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
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
				blackText: '',
				blackListText: '',
				pactBtnText: '完成交车',
				orderId: '',
			};
		},
		onLoad(option) {
			let checks = (option.checks || '').split(',');
			this.idCard = option.idCard;
			this.name = option.name;
			this.orderId = option.orderId;
			checks.forEach(o => {
				this.options.push({
					title: o.substr(0, o.indexOf(" ")),
				})
			});
			if (!checks[0]) {
				this.pactFlag = true
			}
		},
		mounted() {
			this.autoCheck();
		},
		methods: {
			autoCheck() {
				this.options.forEach(o => {
					if (o.title === '重点人员查询') {
						uni.showLoading({
							mask: true,
							title: '查询中'
						})
						api.checkZtryService(this.idCard).then((res = {}) => {
							uni.hideLoading();
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
						uni.showLoading({
							mask: true,
							title: '查询中'
						})
						api.checkLicense(this.idCard).then((res = {}) => {
							uni.hideLoading()
							this.active = this.active + 1;
							this.licenseText = (res.data || {}).data ? `已被扣除${res.data.data}分` : (res
								.data || {}).msg;
							this.$nextTick(() => {
								if (this.active === this.options.length - 1) {
									this.pactFlag = true;
								}
							});
						});
					}
					if (o.title === '老赖查询') {
						uni.showLoading({
							mask: true,
							title: '查询中'
						})
						api.checkDeadbeat({
							idcard: this.idCard,
							realname: this.name,
						}).then((res = {}) => {
							uni.hideLoading()
							if (res.data) {
								if (res.data.msg !== '没有信息') {
									this.blackText = `${this.name}存在有履行能力而拒不履行生效法律文书确定义务的行为`
								} else {
									this.blackText = res.data.msg
								}
								this.active = this.active + 1;
								this.$nextTick(() => {
									if (this.active === this.options.length - 1) {
										this.pactFlag = true;
									}
								});
							}
						});
					}
					if (o.title === '黑名单校验') {
						uni.showLoading({
							mask: true,
							title: '查询中'
						})
						api.checkBlack({
							idcard: this.idCard,
						}).then((res = {}) => {
							uni.hideLoading()
							if (res.data) {
								if (res.data.length > 0) {
									this.blackListText = `此人已在平台中有${res.data.length}次不良记录`
								} else {
									this.blackListText = `此人在平台中未有不良记录`
								}
								this.active = this.active + 1;
								this.$nextTick(() => {
									if (this.active === this.options.length - 1) {
										this.pactFlag = true;
									}
								});
							}
						});
					}
				});
			},
			toPact() {
				uni.showModal({
					content: '是否上传纸质合同',
					cancelText: '直接交车',
					confirmText: '上传纸质合同',
					success: (e) => {
						if(e.confirm){
							uni.chooseImage({
								success: (res) => {
									uni.showLoading({
										mask: true,
										title: '合同上传中'
									})
									uni.uploadFile({
										url: `${config.API_URL}/system/wxorder/uploadContract/${this.orderId}`,
										filePath: res.tempFilePaths[0],
										name: 'file',
										header: {
											Authorization: 'Bearer ' + uni.getStorageSync('tonken')
										},
										success: (res) => {
											uni.hideLoading();
											uni.navigateTo({
												url: '/pages/model/InCar/Finish'
											});
										}
									});
								}
							});
						} else {
							api.finishCar(this.orderId).then( res => {
								uni.navigateTo({
									url: '/pages/model/InCar/Finish'
								});
							})
						}
					}
				});
			},
			validation(checkTitle) {
				switch (checkTitle) {
					case '人脸核验':
						uni.showModal({
							title: '人脸核验',
							content: '即将开启人脸核验，请保持面部正向对着屏幕3秒。',
							success: (e) => {
								if (e.confirm) {
									uni.chooseVideo({
										sourceType: ['camera'],
										camera: 'front',
										maxDuration: 3,
										success: (video) => {
											// #ifdef APP-PLUS
											const path = plus.io.convertLocalFileSystemURL(video
												.tempFilePath) //绝对路径
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
													let {
														flag,
														result
													} = res.data;
													if (flag) {
														uni.showToast({
															title: '人脸核验通过',
															icon: 'none',
														});
														this.active = this.active + 1;
														this.$nextTick(() => {
															if (this.active ===
																this.options
																.length - 1) {
																this.pactFlag =
																	true;
															}
														});
													} else {
														uni.showModal({
															title: '人脸核验结果',
															content: '此人人脸核验匹配度过低，可能存在风险，是否强制通过？',
															confirmText: '通过',
															success: (e) => {
																if (e
																	.confirm
																	) {
																	this.active =
																		this
																		.active +
																		1;
																	this.$nextTick(
																		() => {
																			if (this
																				.active ===
																				this
																				.options
																				.length -
																				1
																			) {
																				this.pactFlag =
																					true;
																			}
																		}
																		);
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
							}
						})
						break;
					case "电子合同":
						uni.navigateTo({
							url: `/pages/model/InCar/Pact?orderId=${this.orderId}`
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
	.checkBox {
		margin-bottom: 50rpx;
	}

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
