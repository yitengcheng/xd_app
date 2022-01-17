<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box" @change="e => (current = e.detail.current)">
			<swiper-item v-for="(item, index) in photo" :key="index">
				<image
					:src="(item || {}).url || '/static/img/defalut.png'"
					class="swiper_img"
					mode="aspectFill"
				></image>
			</swiper-item>
		</swiper>
		<view class="info_box">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>车辆信息</text>
				</view>
			</view>
			<view class="line"></view>
			<text>【车辆品牌】{{ detail.car.carBrand }}</text>
			<text>【车牌号】{{ detail.car.carNum }}</text>
			<text>【调车单价】￥{{ detail.car.upperPrice || 0 }} 元/天</text>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>申请者</text>
				</view>
				<view style="display: flex;flex-direction: row;">
					<text>{{ detail.complany.leave || 0 }}</text>
					<u-icon name="star-fill" size="16" color="#FFD101"></u-icon>
				</view>
			</view>
			<view class="line"></view>
			<text>【申请公司】{{ detail.complany.complanyName }}</text>
			<text>【公司电话】{{ detail.complany.phoneNumber }}</text>
			<text>【申请人】{{ detail.info.name }}</text>
			<text>【申请人联系方式】{{ detail.info.phoneNumber }}</text>
			<text>【公司地址】{{ detail.complany.businessAddress }}</text>
		</view>
		<view class="info_box" v-if="detail.info.status === 2">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>拒绝详情</text>
				</view>
			</view>
			<view class="line"></view>
			<text>【拒绝理由】{{ detail.info.cause }}</text>
		</view>
		<view class="info_box" v-if="detail.info.status === 1 || detail.info.status === 3">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>合同留存</text>
				</view>
			</view>
			<view class="line"></view>
			<u-image :src="`${config.IMG_URL}${detail.info.contract}`">
				<template slot="error">
					<text style="font-size: 10px;">暂无留存</text>
				</template>
			</u-image>
		</view>
		<view class="info_box" v-if="detail.info.status === 0 && flag === '0'">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>选项</text>
				</view>
			</view>
			<view class="line"></view>
			<uni-forms ref="formData" v-model="formData" :labelWidth="130" class="form_box">
				<FormInput
					:formData="formData"
					name="unitPrice"
					label="调车单价(元/天)"
					decoration
					type="number"
					:required="false"
				/>
				<FormInput
					:formData="formData"
					name="bondMoney"
					label="调车保证金"
					decoration
					type="number"
					:required="false"
				/>
				<FormInput
					:formData="formData"
					name="violationBondMoney"
					label="违章保证金"
					decoration
					type="number"
					:required="false"
				/>
			</uni-forms>
		</view>
		<view class="btn_box" v-if="detail.info.status === 0 && flag === '0'">
			<u-button @click="applyShuntModal" class="btn" type="primary">同意调车</u-button>
			<u-button class="btn" type="error" @click="refuseShunt">拒绝调车</u-button>
		</view>
		<view class="btn_box" v-if="detail.info.status === 1 && flag === '0'">
			<u-button class="btn" type="error" @click="forceReturn">强制回收</u-button>
		</view>
		<view class="btn_box" v-if="detail.info.status === 1 && flag === '1'">
			<u-button class="btn" type="primary" @click="() => (show = true)">归还车辆</u-button>
		</view>
		<view class="btn_box" v-if="detail.info.status === 0 && flag === '1'">
			<u-button class="btn" type="error" @click="cancelShunt">取消申请</u-button>
		</view>
		<u-popup
			:show="show"
			mode="center"
			:overlay="true"
			:closeOnClickOverlay="true"
			@close="() => (show = false)"
		>
			<view class="popup_box">
				<view class="popup_box_title">归还车辆</view>
				<view class="line"></view>
				<uni-rate value="evaluateLevel" activeColor="#ffd101" :margin="5"></uni-rate>
				<uni-easyinput
					type="textarea"
					v-model="evaluate"
					placeholder="请输入评论"
					:maxlength="200"
				></uni-easyinput>
				<view>
					<u-button type="primary" @click="returnShuntCar">确认</u-button>
					<u-button style="margin-top: 10px;" type="error" @click="() => (show = false)">
						取消
					</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
import { formattingPhoto } from '../../../common/utils.js';
import FormInput from '../../../components/form/FormInput.vue';
export default {
	components: {
		FormInput
	},
	onLoad(option) {
		this.initApplyDetail(option?.applyId);
		this.flag = option?.flag;
	},
	data() {
		return {
			flag: '',
			current: 0,
			show: false,
			photo: [],
			detail: {
				car: {},
				complany: {},
				info: {}
			},
			formData: {
				bondMoney: '',
				unitPrice: '',
				violationBondMoney: ''
			},
			evaluateLevel: 5,
			evaluate: '',
			config,
		};
	},
	methods: {
		async initApplyDetail(applyId) {
			const res = await api.applyDetail(applyId);
			this.photo = this._.map(res?.car?.carPhotos?.split(','), item => formattingPhoto(item));
			this.formData.unitPrice = res?.car?.upperPrice ?? 0;
			this.detail = {
				car: res?.car,
				complany: res?.complany,
				info: res?.info
			};
		},
		initOtherPage() {
			uni.$emit('orders');
			uni.$emit('returnCar');
			uni.$emit('car');
			uni.reLaunch({
				url: '/pages/model/car/Car'
			});
		},
		async returnShuntCar() {
			const res = await api.returnShuntCar({
				carId: this.detail.car.id,
				evaluate: this.evaluate ?? '暂无评论',
				evaluateLevel: this.evaluateLevel ?? 5,
				shuntId: this.detail.info.id,
				status: false
			});
			uni.showModal({
				title: '提示',
				content: res?.msg,
				showCancel: false,
				success: () => {
					this.initOtherPage();
				}
			});
		},
		async cancelShunt() {
			const res = await api.cancelShunt(this.detail.info.id);
			if(res?.code === 200){
				uni.showModal({
					title: '提示',
					content: res?.msg,
					showCancel: false,
					success: () => {
						this.initOtherPage();
					}
				});
			}
		},
		applyShuntModal() {
			uni.showModal({
				title: '同意',
				content: '是否上传合同？',
				confirmText: '上传合同',
				cancelText: '无需上传，直接调车',
				success: e => {
					if (e.confirm) {
						uni.chooseImage({
							count: 1,
							success: res => {
								uni.showLoading({
									mask: true,
									title: '合同上传中'
								});
								res.tempFiles.forEach(file => {
									uni.uploadFile({
										url: `${config.API_URL}/tool/oss/upload`,
										filePath: file.path,
										name: 'file',
										header: {
											Authorization: 'Bearer ' + uni.getStorageSync('tonken')
										},
										success: res => {
											uni.hideLoading();
											let { data } = JSON.parse(res.data);
											this.handleCar(data, 1);
										}
									});
								});
							}
						});
					} else {
						this.handleCar(undefined, 1);
					}
				}
			});
		},
		async handleCar(contract, status, cause) {
			const res = await api.handleShunt({
				id: this.detail.info.id,
				contract,
				...this.formData,
				status,
				cause
			});
			uni.showModal({
				title: '提示',
				content: res?.msg,
				showCancel: false,
				success: () => {
					this.initOtherPage();
				}
			});
		},
		refuseShunt() {
			uni.showModal({
				title: '拒绝',
				content: '是否拒绝当前调用申请',
				editable: true,
				placeholderText: '请输入拒绝理由',
				success: e => {
					this.handleCar(undefined, 2, e.content);
				}
			});
		},
		async forceReturn() {
			const res = await api.returnShuntCar({
				carId: this.detail.car.id,
				shuntId: this.detail.info.id,
				status: false
			});
			if (!res?.data) {
				uni.showModal({
					title: '提示',
					content: '车辆处于租赁状态，是否选择强行收回？',
					success: async e => {
						if (e.confirm) {
							const result = await api.returnShuntCar({
								carId: this.detail.car.id,
								shuntId: this.detail.info.id,
								status: true
							});
							uni.showModal({
								title: '提示',
								content: result?.msg,
								showCancel: false,
								success: () => {
									uni.$emit('orders');
									uni.$emit('returnCar');
									uni.$emit('car');
									uni.reLaunch({
										url: '/pages/model/car/Car'
									});
								}
							});
						}
					}
				});
				return;
			}
			uni.showModal({
				title: '提示',
				content: res?.msg,
				showCancel: false,
				success: () => {
					uni.$emit('orders');
					uni.$emit('returnCar');
					uni.$emit('car');
					uni.reLaunch({
						url: '/pages/model/car/Car'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.swiper_box {
	width: 100%;
	height: 300rpx;
}
.swiper_img {
	width: 100%;
	height: 300rpx;
}
.info_box {
	width: 90%;
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: #ffffff;
	border-radius: 10px;
	margin-bottom: 10px;
}
.info_row {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.info_title {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	font-weight: bold;
	height: 42rpx;
}
.line {
	width: 100%;
	height: 1px;
	background-color: #eee;
	margin: 5px 0px;
}
.adorn {
	width: 3px;
	height: 25.2rpx;
	background-color: #ffd101;
	margin-right: 5px;
}
.btn_box {
	display: flex;
	flex-direction: row;
	width: 100vw;
}
.btn {
	margin: 0;
	padding: 0;
	flex: 1;
}
.popup_box {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding: 10px;
	width: 80vw;
	height: 30vh;
}
.popup_box_title {
	font-size: 16px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #333333;
}
</style>
