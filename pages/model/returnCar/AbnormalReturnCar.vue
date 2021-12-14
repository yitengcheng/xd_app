<template>
	<view class="content" style="align-items: center;">
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="320" class="form_box">
			<FormUpload
				ref="upload"
				:formData="formData"
				name="photos"
				label="异常车辆照片"
				:limit="8"
				:required="false"
			/>
			<FormInput
				:formData="formData"
				name="deductBondMoney"
				label="已扣除租车保证金"
				type="number"
				:required="false"
			></FormInput>
			<FormInput
				:formData="formData"
				name="remark"
				label="异常车辆说明"
				type="textarea"
				:required="false"
			></FormInput>
			<FormRadio
				:formData="formData"
				name="isJoinBlack"
				label="是否加入黑名单"
				:required="false"
				@change="hasJoinBlack"
			></FormRadio>
			<FormRadio
				v-if="blackFlag"
				:formData="formData"
				name="dictValue"
				label="黑名单类型"
				:required="false"
				:localdata="blackList"
				:multiple="true"
			></FormRadio>
			<FormRadio
				v-if="blackFlag"
				:formData="formData"
				name="hideInfo"
				label="是否隐藏公司信息"
				:required="false"
				:localdata="hideInfoList"
				:multiple="true"
			></FormRadio>
			<FormInput
				v-if="blackFlag"
				:formData="formData"
				name="cause"
				label="拉黑原因"
				:required="false"
				type="textarea"
				autoHeight
			></FormInput>
			<text>还车地点: {{ address }}</text>
		</uni-forms>
		<u-button type="primary" class="submitBtn" @click="sumbit">提交</u-button>
	</view>
</template>

<script>
import FormUpload from '../../../components/form/FormUpload.vue';
import FormInput from '../../../components/form/FormInput.vue';
import FormRadio from '../../../components/form/FormRadio.vue';
import api from '../../../api/index.js';
export default {
	components: {
		FormUpload,
		FormInput,
		FormRadio,
	},
	onLoad(option) {
		this.dictInit('black_type', 'hide_info').then(() => {
			this.blackList = uni.getStorageSync('black_type');
			this.hideInfoList = uni.getStorageSync('hide_info');
		});
		this.id = option.id;
		this.blackIdcard = option.idcard;
		this.blackPhoneNumber = option.phoneNumber;
		this.blackName = option.name;
		this.bondMoney = option.bondMoney;
		this.formData.deductBondMoney = option.money;
	},
	data() {
		return {
			formData: {
				photos: [],
				remark: '',
				isJoinBlack: 1,
				latlong: '',
				hideInfo: '',
				cause: '',
				deductBondMoney: '',
			},
			id: '',
			address: '',
			blackFlag: true,
			blackList: [],
			hideInfoList: [],
			blackIdcard: '',
			blackPhoneNumber: '',
			blackName: '',
			bondMoney: '',
		};
	},
	mounted() {
		uni.getLocation({
			geocode: true,
			success: res => {
				this.address = `${res.address.country}${res.address.province}${res.address.city}${
					res.address.district
				}${res.address.street}`;
				this.formData.latlong = [res.longitude, res.latitude].join(',');
			},
		});
	},
	methods: {
		chooseAddress() {
			uni.chooseLocation({
				success: res => {
					this.address = res.name;
					this.formData.latlong = [res.longitude, res.latitude].join(',');
				},
			});
		},
		sumbit() {
			this.formData.photos = this.$refs.upload.getFileList();
			this.$refs.form
				.validate()
				.then(res => {
					let photos = res.photos.join(',');
					delete res.photos;
					let params = {
						dictValue: (res.dictValue || []).join(','),
						blackIdcard: this.blackIdcard,
						blackPhoneNumber: this.blackPhoneNumber,
						blackName: this.blackName,
						photos,
					};
					let func = this.blackFlag ? api.returnCarAndJoinBlack : api.updateCarStatus;
					let id = this.blackFlag ? { carId: this.id } : { id: this.id };
					if (res.deductBondMoney * 1 > this?.bondMoney * 1) {
						uni.showModal({
							title: '提示',
							content: '扣除的租车保证金已超过已缴纳的租车保证金，请确认后重新输入',
							showCancel: false,
						});
						return;
					} else {
						uni.showModal({
							title: '提示',
							content: `请退${this?.bondMoney * 1 - res.deductBondMoney * 1}元的租车保证金`,
							success: e => {
								if (e.confirm) {
									func({
										status: 8,
										...id,
										...res,
										...params,
									}).then(o => {
										uni.showToast({
											title: '还车成功',
											icon: 'success',
											success: () => {
												uni.$emit('returnCar');
												uni.$emit('orders');
												uni.$emit('car');
												uni.switchTab({
													url: '/pages/model/returnCar/index',
												});
											},
										});
									});
								}
							},
						});
					}
				})
				.catch(err => {
					uni.showModal({
						title: '提示',
						content: '必填项请填写完整',
						showCancel: false,
					});
				});
		},
		hasJoinBlack(e) {
			e.detail.value === 1 ? (this.blackFlag = true) : (this.blackFlag = false);
		},
	},
};
</script>

<style lang="scss" scoped>
.form_box {
	width: 90%;
	background-color: #ffffff;
	border-radius: 10px;
	margin-top: 10px;
	padding: 10px;
}
.submitBtn {
	width: 90%;
	margin-top: 50rpx;
}
</style>
