<template>
	<view class="content" style="align-items: center;background-color: #FFFFFF;">
		<view class="page_title">
			设置新密码
		</view>
		<uni-forms>
			<FormInput />
		</uni-forms>
	</view>
</template>

<script>
	import FormInput from '../../../components/form/FormInput.vue';
export default {
	components:{
		FormInput,
	},
	data() {
		return {
			
		};
	},
	methods: {
		getCode(val) {
			this.codeFlag = 3;
		},
	}
};
</script>

<style lang="scss" scoped>
	.page_title {
		margin-top: 123rpx;
		width: 80%;
		height: 62rpx;
		font-size: 24px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		line-height: 62rpx;
		color: #333333;
	}
</style>
