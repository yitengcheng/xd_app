<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<switch  v-model="formData[name]" v-bind="$attrs" :checked="formData[name]"></switch>
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
		formData: {
			type: Object,
			default() {
				return {};
			}
		}
	}
};
</script>

<style lang="scss"></style>
