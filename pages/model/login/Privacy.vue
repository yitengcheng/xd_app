<template>
	<web-view src="https://xd.qiantur.com/policy"></web-view>
</template>

<script>
export default {
	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false
		}
		uni.showModal({
			title: '提示',
			content: '我已认真阅读隐私政策，是否同意该隐私政策',
			confirmText: '同意',
			cancelText: '拒绝',
			success: e => {
				uni.$emit('operation', e.confirm);
				uni.setStorageSync('privacyFlag', e.confirm);
				uni.navigateBack();
			}
		});
		return true;
	}
};
</script>

<style lang="scss"></style>
