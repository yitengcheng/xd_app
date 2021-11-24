<template>
	<view class="content" style="align-items: center;" @longpress="saveImage">
		<text>添加管理员微信，长按保存图片到手机</text>
		<u-image src="/static/img/wxQr.jpg" height="950rpx" width="750rpx" ></u-image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	methods: {
		saveImage(){
			uni.saveImageToPhotosAlbum({
				filePath: '/static/img/wxQr.jpg',
				success: ()=>{
					uni.showModal({
						title: '成功',
						content: '保存成功，打开微信扫一扫，选取本地图片进行扫描',
						confirmText: '进入微信',
						cancelText: '留在小滴',
						success: (e) => {
							if(e.confirm){
								plus.runtime.openURL("weixin://");
							}
						}
					})
				},
				fail: (error) => {
					console.log(error)
					uni.showModal({
						title: '提示',
						content: '保存失败，重启应用再尝试',
						showCancel: false,
					});
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	
</style>
