<script>
export default {
	globalData: {
		text: 'text'
	},
	onLaunch() {
		uni.clearStorage();
		console.log('App Launch');
	},
	onShow() {
		console.log('App Show');
	},
	onHide() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}
</style>
