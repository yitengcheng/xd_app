<template>
	<web-view :src="src"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				src: ''
			};
		},
		onLoad(option) {
			this.src = option.url;
		},
	}
</script>

<style lang="scss">

</style>
