<script>
export default {
	globalData: {
		text: 'text',
	},
};
</script>
<style lang="scss">
@import './static/icon/iconfont.css';
@import '@/uni_modules/uview-ui/index.scss';

/*每个页面公共css */
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
}
page {
	display: flex;
	min-height: 100%;
	width: 100%;
	background-color: #f4f4f4;
}
.u-swipe-action-item__content {
	position: relative;
}
</style>
