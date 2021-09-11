<template>
	<uni-forms-item :label="label" :required="required" :name="name">
		<picker v-bind="$attrs" v-model="formData[name]" :value="index" :range="localdata" range-key="text" :name="name">
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
		}
	},
	data() {
		return {
			holder: '',
			index: 0
		};
	},
	mounted() {
		this.holder = this.placeholder ? this.placeholder : `请输入${this.label}`;
	},
	watch: {
		formData: {
			//深度监听，可监听到对象、数组的变化
			handler(val, oldVal) {
				this.index = this._.findIndex(this.localdata, o => {
					return o.value === val[this.name];
				});
			},
			deep: true //true 深度监听
		}
	}
};
</script>

<style lang="scss"></style>
