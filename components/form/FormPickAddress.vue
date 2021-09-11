<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<uni-data-picker
			v-model="formData[name]"
			:readonly="disabled"
			:placeholder="holder"
			popup-title="请选择城市"
			collection="opendb-city-china"
			field="code as value, name as text"
			orderby="value asc"
			:step-searh="true"
			self-field="code"
			parent-field="parent_code"
			@change="onchange"
		></uni-data-picker>
	</uni-forms-item>
</template>

<script>
import api from '../../api/index.js';
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
		disabled: {
			type: Boolean,
			default: false
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
			holder: '',
		};
	},
	mounted() {
		this.holder = this.placeholder ? this.placeholder : `请输入${this.label}`;
	},
	methods: {
		onchange(e) {
			const value = e.detail.value;
			this.$emit('change', value);
		}
	}
};
</script>

<style lang="scss"></style>
