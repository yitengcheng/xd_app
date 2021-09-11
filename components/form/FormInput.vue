<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<uni-easyinput v-model="formData[name]" v-bind="$attrs" :placeholder="holder" ></uni-easyinput>
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
		placeholder: {
			type: String,
			default: ''
		},
		formData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data(){
		return {
			holder:'',
			rule: [],
		}
	},
	mounted() {
		this.holder = this.placeholder ? this.placeholder : `请输入${this.label}`;
	},
};
</script>

<style lang="scss"></style>
