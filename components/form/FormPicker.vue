<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<picker class="picker_box" v-bind="$attrs" v-model="formData[name]" :range="localdata" range-key="text" @change="change">
			<view class="uni-input">{{ (localdata[index] || {}).text || this.holder }}</view>
		</picker>
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
		},
		localdata: {
			type: Array,
			default() {
				return [];
			}
		},
	},
	data() {
		return {
			holder: '',
			index: ''
		};
	},
	mounted() {
		this.holder = this.placeholder ? this.placeholder : `请选择${this.label}`;
	},
	methods:{
		change(e){
			this.index = e.detail.value || 0;
			this.$emit('change', this.localdata[e.detail.value || 0]);
		}
	},
	watch: {
		formData: {
			//深度监听，可监听到对象、数组的变化
			handler(val, oldVal) {
				this.index = this._.findIndex(this.localdata, o => {
					return o.value == val[this.name];
				});
			},
			deep: true //true 深度监听
		}
	}
};
</script>

<style lang="scss">
	.picker_box {
		border: 1px solid rgb(229, 229, 229);
		height: 35px;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 10px;
	}
</style>
