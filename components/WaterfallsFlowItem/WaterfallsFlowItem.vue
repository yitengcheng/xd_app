<template>
    <view class="wf-item-page">
        <image :src="(item|| {}).image" mode="widthFix" class="item-img" @click="imageTap(item)"/>
        <view class="item-info" >
			<image :src="(item|| {}).avatar" mode="aspectFill" class="info-avatar"/>
			<view class="info_box">
				<view class="info_top">
					<view class="info-nickname" >{{ (item|| {}).nickName }}</view>
					<view class="info-to">＞</view>
				</view>
				<view class="info-plate" v-if="item.plate">{{ (item|| {}).plate }}</view>
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
	width: 100%;
}

.info-avatar {
    width: 25rpx;
    height: 25rpx;
    border-radius: 50%;
    margin-right: 5px;
}

.info_box {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.info_top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding-right: 10px;
}

.info-nickname {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
	
}
.info-to {
	font-size: 14px;
	color: #999999;
	font-weight: bold;
}
.info-plate {
	background-color: #FFD101;
	border-radius: 2px;
	padding: 3px;
	color: #333333;
	font-size: 10px;
	width: 60px;
	text-align: center;
}
</style>
