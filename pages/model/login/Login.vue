<template>
	<view class="content" style="align-items: center;background-color: #FFFFFF;">
		<view class="page_title">
			<text class="page_title_text">您好，</text>
			<text class="page_title_text">欢迎来到优行小滴</text>
		</view>
		<uni-forms border v-model="formData" class="form" ref="form">
			<FormInput :formData="formData" name="userName" label="" :inputBorder="false" :required="false" placeholder="请输入手机号/账号" />
			<FormInput :formData="formData" name="password" label="" type="password" :inputBorder="false" :required="false" placeholder="请输入密码" />
		</uni-forms>
		<view class="login_option">
			<view @click="forgetPassword" style="display: flex;flex-direction: row;align-items: center;">
				<u-image src="/static/img/service.png" width="12" height="12"></u-image>
				<text>联系客服</text>
			</view>
			<view @click="register">快速注册</view>
		</view>
		<u-button type="primary" class="login" @click="login">账号登录</u-button>
		<u-popup :show="show" mode="center">
			<view class="download_box">
				<text>当前进度{{progress}}%</text>
				<u-line-progress height="8" :percentage="progress" active-color="#3c9cff" inactive-color="#f3f3f3"></u-line-progress>
			</view>
		</u-popup>
	</view>
</template>

<script>
import FormInput from '../../../components/form/FormInput.vue';
import updateApp from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
import api from '../../../api/index.js';
export default {
	components: {
		FormInput
	},
	data() {
		return {
			formData: {
				userName: '',
				password: ''
			},
			appVersion: '',
			progress: 0,
			show:false,
		};
	},
	mounted() {
		uni.getStorage({
			key: 'userName',
			success: res => {
				this.formData.userName = res?.data;
			}
		});
		uni.getStorage({
			key: 'password',
			success: res => {
				this.formData.password = res?.data;
			}
		});
		this.appVersion = plus.runtime.versionCode;
		uni.$on('operation', flag => (this.select = flag));
	},
	methods: {
		refused() {
			this.select = false;
			uni.setStorageSync('privacyFlag', false);
		},
		forgetPassword() {
			plus.runtime.openURL('https://work.weixin.qq.com/kfid/kfcfc9e2a601d6b5d2d');
		},
		register(e) {
			uni.navigateTo({
				url: '/pages/model/login/Register'
			});
		},
		login() {
			this.$refs.form
				.validate()
				.then(data => {
					api.login({
						sginType: 1,
						type: 'app',
						...data
					}).then((res = {}) => {
						if (process.env.NODE_ENV !== 'development') {
							if (uni.getSystemInfoSync().platform == 'android' && this.appVersion * 1 < res.appVersion * 1) {
								uni.showModal({
									content: '当前使用版本过低，请更新',
									showCancel: false,
									success: e => {
										const downloadTask = uni.downloadFile({
											url: 'http://www.fanzehua.cn/uploads/xd-app.apk',
											success: downloadResult => {
												plus.runtime.install(downloadResult.tempFilePath, { force: false }, () => {
													plus.runtime.restart();
												});
											},
											fail: () => {
												uni.showToast({
													title: '更新失败',
													icon: 'error'
												});
											},
										});
										downloadTask.onProgressUpdate(res => {
											this.show = true;
											this.progress = res.progress;
										});
									}
								});
								return;
							} else if (uni.getSystemInfoSync().platform == 'ios' && this.appVersion * 1 < res.appleVersion * 1) {
								uni.showModal({
									content: '当前使用版本过低，请到应用商店更新',
									showCancel: false,
									success: e => {
										let appleId = 1597034670;
										plus.runtime.launchApplication({
												action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
											},(e) => {
												console.log('Open system default browser failed: ' + e.message);
											}
										);
									}
								});
								return;
							}
						}
						if (res.token) {
							uni.setStorage({
								key: 'tonken',
								data: res.token
							});
							uni.setStorage({
								key: 'userName',
								data: data.userName
							});
							uni.setStorage({
								key: 'password',
								data: data.password
							});
							api.info(uni.getStorageSync('token')).then(info => {
								// 开启websocket
								let complanyId = uni.getStorageSync('complanyId');
								this.$store.dispatch('WEBSOCKET_INIT', complanyId ? complanyId : info.complany[0].id);
								uni.setStorage({
									key: 'user',
									data: {
										user: info.user,
										complany: info.complany,
										roles: info.roles,
									},
									success: () => {
										uni.switchTab({
											url: '/pages/model/car/Car'
										});
									}
								});
								uni.setStorage({
									key: 'complanyId',
									data: complanyId ? complanyId : info.complany[0].id
								});
							});
						}
					});
				})
				.catch(err => {
					uni.showModal({
						title: '提示',
						content: '必填项请填写完整',
						showCancel: false
					});
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.page_title {
	width: 80%;
	display: flex;
	flex-direction: column;
	margin-top: 122rpx;
	margin-bottom: 60rpx;
}

.page_title_text {
	height: 62rpx;
	font-size: 24px;
	font-family: Microsoft YaHei;
	font-weight: bold;
	line-height: 62rpx;
	color: #333333;
}

.form {
	width: 80%;
	border-bottom: 1px #eee solid;
}

.login_option {
	width: 80%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 19rpx;
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
}

.login {
	margin-top: 60rpx;
	width: 80%;
}

.download_box {
	display: flex;
	flex-direction: column;
	padding: 20px;
	width: 550rpx;
	height: 80rpx;
}
.privacy_box {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	width: 80%;
	margin-top: 20px;
}
.privacy_title {
	color: #2979ff;
	text-decoration: underline;
}
.web_box {
	height: 100px;
	width: 100%;
}
</style>
