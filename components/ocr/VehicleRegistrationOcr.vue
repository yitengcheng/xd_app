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
					console.log('file:',res);
					uni.uploadFile({
						url: `${config.API_URL}/tool/ocr/registration`,
						file: res.tempFiles[0],
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
