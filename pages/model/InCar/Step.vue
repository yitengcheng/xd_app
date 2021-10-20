<template>
	<view class="content">
		<uni-steps :active="active" :options="options" direction="column"></uni-steps>
		<view class="info_box">
			<text v-show="!!licenseText" class="info_text">驾照存分：{{licenseText}}</text>
			<text v-show="!!zdryText" class="info_text">重点人员核查：{{zdryText}}</text>
			<text v-show="!!faceText" class="info_text">人脸匹配度：{{faceText}}</text>
			<text v-show="!!idCardText" class="info_text">身份证真伪：{{idCardText}}</text>
			<text v-show="!!blackText" class="info_text">老赖信息：{{blackText}}</text>
		</view>
		<button v-for="(item,index) in options" :key="index" type="primary" class="btn" v-show="active + 1 === index"
			@click="validation(item.title)">{{item.title}}</button>
		<view v-if="pactFlag" class="pactBtn">
			<uni-data-checkbox v-model="checkBtn" :localdata="checkData" @change="changePact" class="checkBox">
			</uni-data-checkbox>
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
				idCardText: '',
				blackText: '',
				pactBtnText: '签订电子合同',
				orderId: '',
				checkBtn: 0,
				checkData: [{
					value: 0,
					text: "电子合同"
				}, {
					value: 1,
					text: '纸质合同'
				}, ]
			};
		},
		onLoad(option) {
			let checks = (option.checks || '').split(',');
			this.idCard = option.idCard;
			this.name = option.name;
			this.orderId = option.orderId;
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
						api.checkZtryService(this.idCard).then((res = {}) => {
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
						api.checkLicense(this.idCard).then((res = {}) => {
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
						api.checkDeadbeat({
							idcard: this.idCard,
							realname: this.name,
						}).then((res = {}) => {
							if (res.msg) {
								let {
									result
								} = res.msg;
								if (this._.isObject(result)) {
									this.blackText = `${this.name}存在有履行能力而拒不履行生效法律文书确定义务的行为`
								} else {
									this.blackText = res.msg.msg
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
				if (this.checkBtn === 1) {
					uni.chooseImage({
						success(res) {
							uni.uploadFile({
								url: `${config.API_URL}/system/wxorder/uploadContract?orderId=${this.orderId}`,
								filePath: res.tempFilePaths[0],
								name:'file',
								header:{Authorization: 'Bearer ' + uni.getStorageSync('tonken')},
								success:()=>{
									uni.navigateTo({
										url: '/pages/model/InCar/Finish'
									});
								}
							});
						}
					});
				} else {
					uni.navigateTo({
						url: `/pages/model/InCar/Pact?orderId=${this.orderId}`
					})
				}
			},
			changePact(e) {
				if (e.detail.value === 1) {
					this.pactBtnText = '上传纸质合同';
				} else {
					this.pactBtnText = '签订电子合同';
				}
				this.checkBtn = e.detail.value;
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
															if (e.confirm) {
																this.active =this.active +1;
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
						if (uni.getSystemInfoSync().platform == "android") {
							uni.openBluetoothAdapter({
								success: () => {
									let { complany } = uni.getStorageSync('user');
									uni.startBluetoothDevicesDiscovery({
										success: (res) => {
											uni.onBluetoothDeviceFound((e) => {
												let { devices } = e;
												if (devices[0].name.search('ST710') !== -1) {
													uni.showLoading({
														mask:true,
														title: '识别中...'
													});
													uni.stopBluetoothDevicesDiscovery({
														success: () => {
															let device = devices[0];
															if (this._.includes(complany.macAddress,device.deviceId)) {
																const idcard = uni.requireNativePlugin('plugin_idcardModule');
																idcard.readIdcard({mac: e.deviceId}, (e) => {
																		this.idCardText = JSON.parse(e.data);
																});
																this.active = this.active + 1;
																this.$nextTick(() => {
																		if (this.active === this.options.length - 1) {
																			this.pactFlag = true;
																		}
																});
															} else {
																uni.showToast({
																	title: `${device.deviceId}不属于本公司授权设备`,
																	icon: 'none',
																})
															}
															uni.hideLoading();
															uni.closeBluetoothAdapter();
														}
													});
												}
											})
										}
									});
								},
								fail: () => {
									uni.showToast({
										title: '蓝牙启动失败',
										icon: 'none'
									})
								}
							});
						} else {
							uni.showToast({
								title: '该功能暂时仅限安卓系统手机使用',
								icon: 'none',
							})
						}
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
