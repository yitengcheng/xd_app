<template>
	<button @click="orc">识别银行卡</button>
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
						url: `${config.API_URL}/tool/orc/bankcard`,
						filePath: res.tempFilePaths[0],
						name:'file',
						success(res) {
							let result = JSON.parse(res.data);
							this.$emit('click', result);
						},
						fail(error) {
							console.log(error);
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
