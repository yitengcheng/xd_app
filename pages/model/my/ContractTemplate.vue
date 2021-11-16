<template>
	<view class="content">
		<uni-data-picker v-show="((user || {}).complany || []).length >= 2" v-model="complanyId" :localdata="complanys" @change="selectComplany" class="complanyPicker"></uni-data-picker>
		<button class="btn" type="primary" @click="downLoadTemplate" v-show="!fileFlag">下载模板</button>
		<button class="btn" type="primary" @click="upLoadTemplate" v-show="!fileFlag">上传模板</button>
		<nk-select-file v-model="fileFlag" @confirm="getPath"></nk-select-file>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	export default {
		data() {
			return {
				fileFlag: false,
				complanys: [],
				complanyId: '',
				complany: '',
				user: uni.getStorageSync('user'),
			}
		},
		mounted() {
			this.initComplany();
		},
		methods: {
			initComplany() {
				let {
					complany
				} = this.user;
				if(complany){
					this.complany = complany[0];
					complany.forEach(o => {
						this.complanys.push({
							text: o.complanyName,
							value: o.id,
							data: o,
						});
					});
					this.complanyId = complany[0].id;
				}
			},
			selectComplany(e) {
				this.complany = e.detail.value[0].data;
			},
			downLoadTemplate() {
				let url = this.complany.templateUrl ? `${config.API_URL}/contract/template?url=${this.complany.templateUrl}` : 'http://www.fanzehua.cn/uploads/contractTemplate.docx'
				uni.downloadFile({
					url,
					header: {
						Authorization: 'Bearer ' + uni.getStorageSync('tonken')
					},
					success: (res = {}) => {
						let {
							tempFilePath
						} = res;
						uni.saveFile({
							tempFilePath,
							success: (file = {}) => {
								let {
									savedFilePath
								} = file
								if (savedFilePath) {
									uni.openDocument({
										filePath: tempFilePath,
										fail: () => {
											uni.showToast({
												title: '打开失败，请检查手机内是否安装了Microsoft Word',
												icon: 'none',
												duration: 5000,
											})
										}
									})
								}
							}
						});
					},
				})
			},
			upLoadTemplate() {
				this.fileFlag = true;
			},
			getPath(path) {
				uni.uploadFile({
					url: `${config.API_URL}/qys/upload/${this.complany.id}`,
					filePath: path[0].url,
					name:'file',
					header:{Authorization: 'Bearer ' + uni.getStorageSync('tonken')},
					success:(res)=>{
						let { data } = res;
						uni.showToast({
							title: data.msg,
							icon: 'success'
						});
						uni.navigateBack();
					},
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 60%;
		margin-top: 50rpx;
	}
	.complanyPicker {
		margin-top: 40rpx;
	}
</style>
