<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<uni-data-checkbox v-model="formData[name]" v-bind="$attrs" :localdata="localdata" @change="change"></uni-data-checkbox>
	</uni-forms-item>
</template>

<script>
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
		localdata: {
			type: Array,
			default(){
				return [
					{value: 0, text: '否'},
					{value: 1, text: '是'},
				]
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		formData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	mounted() {
		this.disabled && this.localdata.forEach((item)=>{
			item.disabled = true
		})
	},
	methods:{
		change(e){
			this.$emit('change',e);
		}
	}
};
</script>

<style lang="scss"></style>
