<template>
	<button @click="orc">识别机动车登记本</button>
</template>

<script>
import config from '../../common/config.js';
export default {
	methods: {
		orc() {
			let token = uni.getStorageSync('tonken');
			uni.chooseImage({
				count: 1,
				success:(res) =>{
					uni.uploadFile({
						url: `${config.API_URL}/tool/ocr/registration`,
						filePath: res.tempFilePaths[0],
						name:'file',
						header:{Authorization: 'Bearer ' + token},
						success:(res) => {
							let result = JSON.parse(res.data);
							this.$emit('click', result);
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
