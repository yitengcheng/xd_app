<template>
    <view class="wf-item-page">
        <image :src="(item|| {}).image" mode="widthFix" class="item-img" @click="imageTap(item)"/>
        <view class="item-info" >
			<image :src="(item|| {}).avatar" mode="aspectFill" class="info-avatar"/>
			<view class="info_box">
				<view class="info-nickname" >{{ (item|| {}).nickName }}</view>
				<button v-if="item.btnText" type="primary" @click="click(item)" class="item-btn" size="mini">{{item.btnText}}</button>
			</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            require: true
        }
    },
	methods:{
		click(item){
			this.$emit('itemClick', item);
		},
		
		// item点击
		imageTap(item) {
		    this.$emit('itemTap', item)
		}
	}
}
</script>

<style lang="scss" scoped>
.wf-item-page {
    background: #fff;
    overflow: hidden;
    border-radius: 5px;
}

.item-img {
    width: 100%;
}

.item-info {
    display: flex;
    align-items: center;
    padding: 5px;
}

.info-avatar {
    width: 25rpx;
    height: 25rpx;
    border-radius: 50%;
    margin-right: 5px;
}

.info_box {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.info-nickname {
    font-size: 12px;
    color: #333;
	width: 120rpx;
}
.item-btn {
	width: 140rpx;
	height: 50rpx;
	line-height: 50rpx;
	font-size: 10px;
}
</style>
