<template>
	<view>
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="320">
			<FormUpload ref="upload" :formData="formData" name="photos" label="异常车辆照片" :limit="8" :required="false"/>
			<FormInput :formData="formData" name="remark" label="异常车辆说明" type="textarea" :required="false"></FormInput>
			<FormRadio :formData="formData" name="isJoinBlack" label="是否加入黑名单" :required="false" @change="hasJoinBlack"></FormRadio>
			<FormRadio v-if="blackFlag" :formData="formData" name="dictValue" label="黑名单类型" :required="false" :localdata="blackList" :multiple="true"></FormRadio>
			<FormRadio v-if="blackFlag" :formData="formData" name="hideInfo" label="是否隐藏公司信息" :required="false"></FormRadio>
			<FormInput v-if="blackFlag" :formData="formData" name="cause" label="拉黑原因" :required="false" type="textarea" autoHeight ></FormInput>
			<text>还车地点: {{address}}</text>
			<button type="primary" class="submitBtn" @click="sumbit">提交</button>
		</uni-forms>
	</view>
</template>

<script>
	import FormUpload from '../../../components/form/FormUpload.vue';
	import FormInput from '../../../components/form/FormInput.vue';
	import FormRadio from '../../../components/form/FormRadio.vue';
	import api from '../../../api/index.js';
	export default {
		components:{
			FormUpload,
			FormInput,
			FormRadio,
		},
		onLoad(option) {
			this.dictInit('black_type').then(() => {
				this.blackList = uni.getStorageSync('black_type');
			});
			this.id = option.id;
			this.blackIdcard = option.idcard;
			this.blackPhoneNumber = option.phoneNumber;
			this.blackName = option.name;
		},
		data() {
			return {
				formData:{
					photos: [],
					remark:'',
					isJoinBlack: 0,
					latlong:'',
					hideInfo: 0,
					cause: '',
				},
				id: '',
				address: '',
				blackFlag: false,
				blackList: [],
				blackIdcard: '',
				blackPhoneNumber: '',
				blackName: '',
			};
		},
		mounted() {
			uni.getLocation({
				geocode: true,
				success:(res)=>{
					this.address =`${res.address.country}${res.address.province}${res.address.city}${res.address.district}${res.address.street}`;
					this.$refs.form.setValue('latlong', [res.longitude, res.latitude].toString());
				}
			})
		},
		methods:{
			chooseAddress(){
				uni.chooseLocation({
					success: (res) => {
						this.address = res.name;
						this.$refs.form.setValue('latlong', [res.longitude, res.latitude].toString());
					}
				})
			},
			sumbit(){
				this.$refs.form.setValue('photos',this.$refs.upload.getFileList());
				this.$refs.form.validate().then(res => {
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
					let id = this.blackFlag ? {carId: this.id} : {id: this.id};
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
								this.$emit('inCar');
								this.$emit('returnCar');
								uni.switchTab({
									url: '../car/Car'
								})
							}
						});
					});
				});
			},
			hasJoinBlack(e){
				e.detail.value === 1 ? this.blackFlag = true :this.blackFlag = false;
			}
		}
	}
</script>

<style lang="scss">
.submitBtn{
	margin-top: 50rpx;
}
</style>
