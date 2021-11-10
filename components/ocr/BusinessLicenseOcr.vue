<template>
	<button @click="orc">识别营业执照</button>
</template>

<script>
import config from '../../common/config.js';
export default {
	methods: {
		orc() {
			uni.chooseImage({
				count: 1,
				success(res) {
					uni.uploadFile({
						url: `${config.API_URL}/tool/orc/complany`,
						filePath: res.tempFilePaths[0],
						name:'file',
						success(res) {
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
