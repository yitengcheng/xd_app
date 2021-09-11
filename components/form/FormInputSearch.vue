<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<uni-combox class="form_picker" v-bind="$attrs" v-model="formData[name]" :name="name" :placeholder="holder" ></uni-combox>
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
	data() {
		return {
			holder: ''
		};
	},
	mounted() {
		this.holder = this.placeholder ? this.placeholder : `请输入${this.label}`;
	}
};
</script>

<style lang="scss">
.form_picker {
	border: 1px solid rgb(229, 229, 229);
	border-radius: 4px;
}
</style>
