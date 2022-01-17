<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box" @change="e => (current = e.detail.current)">
			<swiper-item v-for="(item, index) in photo" :key="index">
				<image :src="(item || {}).url || '/static/img/defalut.png'" class="swiper_img" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="info_box">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>车辆信息</text>
				</view>
				<text style="font-size: 12px; color: #666666; font-weight: normal;">{{(car.complany || {}).complanyName || '暂无'}}</text>
			</view>
			<view class="line"></view>
			<text>【车辆品牌】{{car.carBrand}}</text>
			<text>【车牌号】{{car.carNum}}</text>
			<text>【调车单价】￥{{car.upperPrice || 0}} 元/天</text>
			<view style="display: flex;flex-direction: row;">
				<text>【车辆星级】{{car.leave || 0}}</text>
				<u-icon name="star-fill" size="16" color="#FFD101"></u-icon>
			</view>
			<text>【所属公司地址】{{(car.complany || {}).businessAddress || (car.complany || {}).complanyAddress}}</text>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>评价</text>
				</view>
				<view style="font-size: 12px;color: #FFD101;" @click="toEvaLuateList">查看全部</view>
			</view>
			<view class="line"></view>
			<view v-if="car.info.length > 0" v-for="(item ,index) in car.info" :key="index">
				<view class="info_row" style="justify-content: space-between;">
					<text style="font-size: 16px; font-weight: bold;">{{item.complany_name}}</text>
					<text style="font-size: 14px; color: #666666;">{{dayjs(item.return_time).format('YYYY年MM月DD日')}}</text>
				</view>
				<view class="evaluate_info"> {{item.evaluate}} </view>
				<view class="line"></view>
			</view>
			<u-image v-if="(car.info || []).length === 0" src="/static/img/emptyEvaluate.png" width="200" height="100" style="align-self: center;"></u-image>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="info_row">
					<view class="adorn"></view>
					<text>调车</text>
				</view>
			</view>
			<view class="line"></view>
			<uni-forms ref="formData" v-model="formData" :rules="rules" :labelWidth="130" class="form_box">
				<FormDatePicker :formData="formData" name="dateRange" label="预计调车时间" decoration type="daterange" :start="dayjs().format('YYYY-MM-DD')"/>
				<FormInput :formData="formData" name="name" label="调车人" decoration />
				<FormInput :formData="formData" name="phoneNumber" label="调车人联系电话" decoration type="number" />
			</uni-forms>
		</view>
		<u-button class="bottom_btn" type="primary" @click="applyShuntCar">申请调车</u-button>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import { formattingPhoto } from '../../../common/utils.js';
import FormInput from '../../../components/form/FormInput.vue';
import FormDatePicker from '../../../components/form/FormDatePicker.vue';
import { phoneRegex } from '../../../common/regex.js';
export default {
	onLoad(option) {
		this.carId = option.carId;
		this.initShuntCar(option.carId);
	},
	components:{
		FormInput,
		FormDatePicker,
	},
	mounted() {
		let user = uni.getStorageSync('user');
		this.formData.name = user.user.realName;
		this.formData.phoneNumber = user.user.phonenumber;
	},
	data() {
		return {
			current: 0,
			carId: '',
			photo: [],
			car: {},
			formData: {
				dateRange:[],
				name: '',
				phoneNumber: '',
			},
			rules: {
				dateRange: {
					rules: [
						{
							required: true,
							errorMessage: '请选择预计调车时间'
						}
					]
				},
				name: {
					rules: [
						{
							required: true,
							errorMessage: '请填写调车人'
						}
					]
				},
				phoneNumber: {
					rules: [
						{
							required: true,
							errorMessage: '请填写调车人联系电话'
						},
						{
							pattern: phoneRegex,
							errorMessage: '请输入正确的电话号码'
						}
					]
				},
			}
		};
	},
	methods: {
		toEvaLuateList(){
			uni.navigateTo({
				url: `/pages/model/car/CommentList?carId=${this.carId}`
			});
		},
		async initShuntCar(carId) {
			const res = await api.shuntCarDetail(carId);
			if (res?.car) {
				const { leave, complany, ...car } = res;
				let files = car.carPhotos?.split(',');
				let carsPhotos = [];
				files?.forEach((item, index) => {
					carsPhotos.push(formattingPhoto(item));
				});
				this.photo = carsPhotos;
				this.car = {...car,leave, complany};
			}
		},
		applyShuntCar(){
			this.$refs.formData.validate().then(async ()=>{
				const res = await api.applyShuntCar({
					beginTime: this.dayjs(this.formData.dateRange[0]).format('YYYY-MM-DD'),
					endTime: this.dayjs(this.formData.dateRange[1]).format('YYYY-MM-DD'),
					name: this.formData.name,
					phoneNumber: this.formData.phoneNumber,
					carId: this.carId,
				});
				if(res.data){
					uni.showModal({
						title: '成功',
						content: '申请成功，请联系对方商议交付调用车辆',
						confirmText: '拨打对方电话',
						cancelText: '取消',
						success: (e) => {
							if(e.confirm){
								uni.makePhoneCall({
									phoneNumber: res.msg,
									success: (e) => {
										console.log(e)
										uni.navigateBack()
									},
									fail: (error) => {
										console.log('error:',error)
									}
								})
							}
						}
					})
				}else{
					uni.showModal({
						title: '失败',
						content: res.msg,
						showCancel:false,
					})
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
.evaluate_info {
	text-overflow: -o-ellipsis-lastline;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  line-clamp: 2;
}
.bottom_btn {
	width: 100vw;
}
</style>
