<template>
	<uni-forms-item :label="label" :required="required" :name="name" :decoration="decoration">
		<switch  v-model="formData[name]" v-bind="$attrs" :checked="formData[name]" @change="change"></switch>
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
		decoration: {
			type: Boolean,
			default: false
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
	},
	methods:{
		change(e){
			this.$emit('change', e.detail.value);
		}
	}
};
</script>

<style lang="scss" scoped></style>
