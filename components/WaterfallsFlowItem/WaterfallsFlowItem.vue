<template>
    <view class="wf-item-page">
        <image :src="(item|| {}).image" mode="widthFix" class="item-img" @click="imageTap(item)"/>
        <view class="item-info" >
			<image :src="(item|| {}).avatar" mode="aspectFill" class="info-avatar"/>
			<view class="info_box">
				<view class="info_top">
					<view class="info-nickname" >{{ (item|| {}).nickName }}</view>
					<u-icon class="info-to" name="arrow-right" size="24"></u-icon>
				</view>
				<view class="info-plate" v-if="item.plate">{{ (item|| {}).plate }}</view>
				<view class="info-price" v-if="item.price">
					<span style="font-size: 8px;">¥</span>
					{{ (item|| {}).price }}
					<span v-if="item.unit" style="font-size: 8px;color: #333333;">{{item.unit}}</span>
				</view>
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
	color: #999999;
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
.info-price {
	color: #FF4343;
	font-size: 18px;
	font-family: 'MicrosoftYaHei';
}
</style>
