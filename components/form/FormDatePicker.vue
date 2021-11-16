<template>
	<uni-forms-item :label="label" :required="required" :name="name" :decoration="decoration">
		<uni-datetime-picker :value="formData[name]" @change="change" v-bind="$attrs"/>
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
	data(){
		return {
			holder:'',
			rule: [],
		}
	},
	mounted() {
		this.holder = this.placeholder ? this.placeholder : `请输入${this.label}`;
	},
	methods:{
		change(e){
			this.$emit('change',e);
		}
	}
};
</script>

<style lang="scss" scoped></style>
