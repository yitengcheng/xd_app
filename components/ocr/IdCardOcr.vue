<template>
	<button @click="orc" v-bind="$attrs">识别身份证</button>
</template>

<script>
import config from '../../common/config.js';
export default {
	methods: {
		orc() {
			let token = uni.getStorageSync('tonken');
			uni.chooseImage({
				count: 1,
				success:(res) => {
					uni.showLoading({
						mask:true,
						title:'识别中'
					})
					uni.uploadFile({
						url: `${config.API_URL}/tool/ocr/idcard?type=2`,
						filePath: res.tempFilePaths[0],
						name:'file',
						header:{Authorization: 'Bearer ' + token},
						success:(data) => {
							let result = JSON.parse(data.data);
							this.$emit('click', result.data);
							uni.hideLoading();
						},
						fail:(error) => {
							uni.hideLoading();
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
