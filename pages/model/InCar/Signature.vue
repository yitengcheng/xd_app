<template>
	<view class="main-content" v-if="isShow">
		<!-- 签字canvas -->
		<canvas 
			class="mycanvas" 
			id="mycanvas" 
			canvas-id="mycanvas" 
			@touchstart="touchstart" 
			@touchmove="touchmove" 
			@touchend="touchend"
		></canvas>
		<!-- 旋转canvas -->
		<canvas
			class="mycanvas"
			:style="{ 'z-index': 1, width: `${screenWidth}px`, height: `${(screenWidth * screenWidth) / screenHeight}px` }"
			id="rotatCanvas"
			canvas-id="rotatCanvas"
		></canvas>
		<view class="button-line">
			<view class="save-button" @tap="finish">保存</view>
			<view class="clear-button" @tap="clear">清除</view>
			<view class="cancel-button" @tap="hide">取消</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			ctx: '', //绘图图像
			points: [], //路径点集合
			isShow: true,
			screenWidth: '',
			screenHeight: ''
		};
	},
	mounted() {
		this.createCanvas();
		uni.getSystemInfo({
			success: e => {
				this.screenWidth = e.screenWidth;
				this.screenHeight = e.screenHeight;
			}
		});
	},
	methods: {
		show() {
			this.clear();
			this.isShow = true;
		},
		hide() {
			this.isShow = false;
			uni.navigateBack({
				
			});
		},
		//创建并显示画布
		createCanvas() {
			this.showCanvas = true;
			this.ctx = uni.createCanvasContext('mycanvas', this); //创建绘图对象
			//设置画笔样式
			this.ctx.lineWidth = 2;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
		},
		//触摸开始，获取到起点
		touchstart(e) {
			let startX = e.changedTouches[0].x;
			let startY = e.changedTouches[0].y;
			let startPoint = {
				X: startX,
				Y: startY
			};
			this.points.push(startPoint);
			//每次触摸开始，开启新的路径
			this.ctx.beginPath();
		},
		//触摸移动，获取到路径点
		touchmove(e) {
			let moveX = e.changedTouches[0].x;
			let moveY = e.changedTouches[0].y;
			let movePoint = {
				X: moveX,
				Y: moveY
			};
			this.points.push(movePoint); //存点
			let len = this.points.length;
			if (len >= 2) {
				this.draw(); //绘制路径
			}
		},
		// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
		touchend() {
			this.points = [];
		},
		/* ***********************************************
			#   绘制笔迹
			#	1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#	2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#	3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
		draw() {
			let point1 = this.points[0];
			let point2 = this.points[1];
			this.points.shift();
			this.ctx.moveTo(point1.X, point1.Y);
			this.ctx.lineTo(point2.X, point2.Y);
			this.ctx.stroke();
			this.ctx.draw(true);
		},
		//清空画布
		clear() {
			this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
			this.ctx.draw(true);
		},
		//完成绘画并保存到本地
		finish() {
			uni.canvasToTempFilePath(
				{
					canvasId: 'mycanvas',
					success: res => {
						this.rotat(res.tempFilePath);
						uni.navigateTo({
							url:'/pages/model/InCar/Finish'
						})
					},
					complete: com => {}
				},
				this
			);
		},
		// 将图片选装
		rotat(e) {
			let rotatCtx = uni.createCanvasContext('rotatCanvas', this); //创建绘图对象
			// 重新定位中心点
			rotatCtx.translate(0, (this.screenWidth * this.screenWidth) / this.screenHeight);
			// 将画布逆时针旋转90度
			rotatCtx.rotate((270 * Math.PI) / 180);
			// 将签字图片绘制进入Canvas
			rotatCtx.drawImage(e, 0, 0, (this.screenWidth * this.screenWidth) / this.screenHeight, this.screenWidth);
			// 保存后旋转后的结果
			rotatCtx.draw(true);
			setTimeout(() => {
				// 生成图片并回调
				uni.canvasToTempFilePath(
					{
						canvasId: 'rotatCanvas',
						success: val => {
							this.$emit('tempFilePath', val.tempFilePath);
							setTimeout(() => {
								this.hide();
							}, 500);
						},
						complete: com => {
							// console.log(com);
						}
					},
					this
				);
			}, 500);
		}
	}
};
</script>

<style lang="scss" scoped>
.main-content {
	// transform: rotate(90deg);
	width: 100vw;
	height: 100vh;
	background-color: red;
	position: fixed;
	top: 0rpx;
	left: 0rpx;
	z-index: 999;
}
.mycanvas {
	width: 100vw;
	height: 100vh;
	background-color: #efefef;
	// transform: rotate(360deg);
	position: fixed;
	left: 0rpx;
	top: 0rpx;
	z-index: 2;
}
.button-line {
	transform: rotate(90deg);
	position: fixed;
	bottom: 170rpx;
	left: -100rpx;
	width: 340rpx;
	height: 50rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 2;
}
.button-style {
	color: #ffffff;
	width: 100rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
	border-radius: 10rpx;
}
.save-button {
	@extend .button-style;
	background-color: #02b340;
}
.clear-button {
	@extend .button-style;
	background-color: #ffa500;
}
.cancel-button {
	@extend .button-style;
	background-color: #e10b2b;
}
</style>

