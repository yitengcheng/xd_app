<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<uni-file-picker v-model="formData[name]" v-bind="$attrs" @select="upload"></uni-file-picker>
	</uni-forms-item>
</template>

<script>
import config from '../../common/config.js';
export default {
	props: {
		label: {
			type: String,
			default: ''
		},
		required: {
			type: Boolean,
			default: true
		},
		name: {
			type: String,
			default: ''
		},
		url:{
			type:String,
			default: '/tool/oss/upload',
		},
		loadingTitle:{
			type:String,
			default: '上传中',
		},
		formData: {
			type: Object,
			default() {
				return {};
			}
		},
		otherData: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	data(){
		return {
			fileList:[],
		}
	},
	methods:{
		upload(e){
			uni.showLoading({
				title: this.loadingTitle,
				mask: true,
			})
			let token = uni.getStorageSync('tonken');
			for (let i = 0; i < e.tempFiles.length; i++) {
				let item = e.tempFiles[i]
				uni.uploadFile({
					url:`${config.API_URL}${this.url}`,
					filePath: item.path,
					file: item.file,
					name:'file',
					header:{Authorization: 'Bearer ' + token},
					formData: {...this.otherData},
					success:(res) =>{
						let result = JSON.parse(res.data);
						this.$emit('getOcrData', result.data);
						result.data && this.fileList.push(result.data);
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			}
		},
		getFileList(){
			return this.fileList;
		}
	}
};
</script>

<style lang="scss"></style>
