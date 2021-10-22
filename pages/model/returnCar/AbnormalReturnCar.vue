<template>
	<view>
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="320">
			<FormUpload ref="upload" :formData="formData" name="photos" label="异常车辆照片" :limit="8" :required="false"/>
			<FormInput :formData="formData" name="remark" label="异常车辆说明" type="textarea" :required="false"></FormInput>
			<FormRadio :formData="formData" name="isJoinBlack" label="是否加入黑名单" :required="false"></FormRadio>
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
			this.id = option.id;
		},
		data() {
			return {
				formData:{
					photos: [],
					remark:'',
					isJoinBlack: 0,
					latlong:'',
				},
				id: '',
				address: '',
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
					api.updateCarStatus({
						id: this.id,
						status: 8,
						...res,
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
				
			}
		}
	}
</script>

<style lang="scss">
.submitBtn{
	margin-top: 50rpx;
}
</style>
