<template>
	<view>
		<uni-forms ref="form" v-model="formData" label-position="top" :label-width="320">
			<FormUpload ref="upload" :formData="formData" name="carPhotos" label="异常车辆照片" :limit="8" :required="false"/>
			<FormInput :formData="formData" name="remark" label="异常车辆说明" type="textarea" :required="false"></FormInput>
			<FormRadio :formData="formData" name="isJoinBlack" label="是否加入黑名单" :required="false"></FormRadio>
			<button size="mini" type="warn" :plain='true' @click="chooseAddress">还车地点: {{address || '选择还车地点'}}</button>
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
					carPhotos: [],
					remark:'',
					isJoinBlack: 0,
					latlong:'',
				},
				id: '',
				address: '',
			};
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
				this.$refs.form.setValue('carPhotos',this.$refs.upload.getFileList());
				this.$refs.form.validate().then(res => {
					api.updateCarStatus({
						id: this.carInfo.id,
						status: 8,
						...res,
					}).then(o => {
						if(o.msg){
							uni.showToast({
								title: o.msg,
								icon: 'error'
							});
							return;
						}
						uni.showToast({
							title: '还车成功',
							icon: 'success',
							success: () => {
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
