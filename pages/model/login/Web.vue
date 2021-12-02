<template>
	<web-view :src="src"></web-view>
</template>

<script>
export default {
	onLoad(option) {
		this.src = option.url
	},
	data(){
		return {
			src: ''
		}
	}
};
</script>

<style lang="scss"></style>
