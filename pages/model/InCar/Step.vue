<template>
	<view class="content">
		<view class="step_box">
			<u-steps :current="active" direction="column" activeColor="#1B90D1" dot>
				<u-steps-item v-for="(item,index) in options" :key="index" :title="item.name" :desc="item.desc" :error="item.error"/>
			</u-steps>
		</view>
		<u-button type="error" v-if="_.includes(_.map(options, 'name'), '黑名单校验')" @click="lookDetail">黑名单详情</u-button>
		<u-button v-for="(item,index) in options" :key="index" type="primary" class="btn" v-show="active + 1 === index"
			@click="validation(item.name)">{{item.name === '电子合同' ? '电子合同签订' : item.name}}</u-button>
		<view v-if="pactFlag" class="pactBtn">
			<u-button type="primary" @click="toPact" class="btn">{{pactBtnText}}</u-button>
		</view>
		<u-popup :show="show" mode="bottom" :overlay="true" :closeOnClickOverlay="true" @close="() => show = false">
			<u-empty mode="history" v-if="backList.length === 0"/>
			<view v-for="(backInfo, index) in backList" :key="index" >
				<text>{{`${dayjs(backInfo.createTime).format('YYYY-MM-DD')}${backInfo.cause}`}}</text>
			</view>
		</u-popup>
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
				backList: [],
				show: false,
			};
		},
		onLoad(option) {
			let checks = option.checks?.split(',');
			this.idCard = option.idcard;
			this.name = option.name;
			this.orderId = option.orderId;
			checks?.forEach(o => {
				this.options.push({
					name: o.substr(0, o.indexOf(" ")),
					error: false,
				})
			});
			if (option?.pactFlag === 'false') {
				this.pactFlag = true;
			} else if(option?.pactFlag === 'true') {
				this.options = [{
					name: '电子合同',
					error: false,
				}];
			} else if(checks?.length > 0 && !!checks[0]) {
				this.autoCheck();
			} else {
				this.active = 0;
				this.pactFlag = true;
			}
			if(this.options.length === 0){
				this.active = -1;
				this.pactFlag = true;
			}
		},
		methods: {
			autoCheck() {
				this.options.forEach(o => {
					if (o.name === '重点人员查询') {
						api.checkZtryService(this.idCard).then((res = {}) => {
							this.active = this.active + 1;
							o.desc = res.data.msg;
							this.$nextTick(() => {
								if (this.active === this.options.length - 1) {
									this.pactFlag = true;
								}
							});
						});
					}
					if (o.name === '一人多租') {
						api.checkLease(this.idCard).then((res = {}) => {
							this.active = this.active + 1;
							o.desc = `租车未还${res.data}辆车`;
							this.$nextTick(() => {
								
								if (this.active === this.options.length - 1) {
									this.pactFlag = true;
								}
							});
						});
					}
					if (o.name === '驾照存分查询') {
						api.checkLicense(this.idCard).then((res = {}) => {
							this.active = this.active + 1;
							o.desc = `已被扣除${res.data.data}分`;
							this.$nextTick(() => {
								
								if (this.active === this.options.length - 1) {
									this.pactFlag = true;
								}
							});
						});
					}
					if (o.name === '黑名单校验') {
						api.checkBlack({
							idcard: this.idCard,
						}).then((res = {}) => {
							if (res.data) {
								this.backList = res.data;
								if (res.data.length > 0) {
									o.desc = `此人已有${res.data.length}次不良记录`;
								} else {
									o.desc = `此人在平台中未有不良记录`;
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
					if (o.name === '老赖查询') {
						api.checkDeadbeat({
							idcard: this.idCard,
							realname: this.name,
						}).then((res = {}) => {
							if (res.data) {
								if (res.data.msg !== '没有信息') {
									o.desc = `${this.name}存在有履行能力而拒不履行生效法律文书确定义务的行为`;
								} else {
									o.desc = res.data.msg;
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
								count: 1,
								success: (res) => {
									uni.showLoading({
										mask: true,
										title: '合同上传中'
									});
									res.tempFiles.forEach(file => {
										uni.uploadFile({
											url: `${config.API_URL}/tool/oss/upload`,
											filePath: file.path,
											name: 'file',
											header: {
												Authorization: 'Bearer ' + uni.getStorageSync('tonken')
											},
											success: (res) => {
												uni.hideLoading();
												let result = JSON.parse(res.data);
												api.finishCar({
													orderId: this.orderId,
													contracts: result.data,
												}).then(res => {
													uni.navigateTo({
														url: '/pages/model/InCar/Finish'
													});
												});
											},
										});
									});
								}
							});
						} else {
							api.finishCar({orderId: this.orderId}).then( res => {
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
													let {
														flag,
														result
													} = res.data;
													let current = this._.find(this.options, o => { return checkTitle === o.name });
													if (flag) {
														uni.showToast({
															title: '人脸核验通过',
															icon: 'none',
														});
														current.desc = '人脸识别通过';
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
																if (e.confirm) {
																	this.active =this.active + 1;
																	this.$nextTick(() => {
																		if (this.active === this.options.length - 1 ) {
																			this.pactFlag = true;
																		}
																		
																	});
																} else {
																	current.desc = '人脸识别未通过';
																	current.error = true;
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
						uni.redirectTo({
							url: `/pages/model/InCar/Pact?orderId=${this.orderId}`
						});
						break;
					default:
						this.pactFlag = true;
						break;
				}
			},
			lookDetail(item){
				this.show = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 90%;
		margin-top: 200rpx;
	}
	.step_box {
		background-color: #FFFFFF;
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
	}
	.slot-icon {
		width: 21px;
		height: 21px;
		background-color: #1B90D1;
		border-radius: 100px;
		font-size: 12px;
		color: #333333;
		line-height: 21px;
		text-align: center;
	}
</style>
