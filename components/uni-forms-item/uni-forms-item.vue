<template>
	<view class="uni-forms-item" :class="{'uni-forms-item--border':border,'is-first-border':border&&isFirstBorder,'uni-forms-item-error':msg}">
		<view class="uni-forms-item__inner" :class="['is-direction-'+labelPos,]">
			<view v-if="label" class="uni-forms-item__label" :style="{width:labelWid+'px',justifyContent: justifyContent}">
				<slot name="left">
					<uni-icons v-if="leftIcon" class="label-icon" size="16" :type="leftIcon" :color="iconColor" />
					<text>{{label}}</text>
					<text v-if="required" class="is-required">*</text>
				</slot>
			</view>
			<view class="uni-forms-item__content" :class="{'is-input-error-border': msg}">
				<slot></slot>
			</view>
		</view>
		<view class="uni-error-message" :class="{'uni-error-msg--boeder':border}" :style="{
			paddingLeft: (labelPos === 'left'? Number(labelWid)+5:5) + 'px'
		}">{{ showMsg === 'undertext' ? msg:'' }}</view>
	</view>
</template>

<script>
	export default {
		name: "uniFormsItem",
		props: {
			// 自定义内容
			custom: {
				type: Boolean,
				default: false
			},
			// 是否显示报错信息
			showMessage: {
				type: Boolean,
				default: true
			},
			name: String,
			required: Boolean,
			validateTrigger: {
				type: String,
				default: ''
			},
			leftIcon: String,
			iconColor: {
				type: String,
				default: '#606266'
			},
			label: String,
			// 左边标题的宽度单位px
			labelWidth: {
				type: [Number, String],
				default: ''
			},
			// 对齐方式，left|center|right
			labelAlign: {
				type: String,
				default: ''
			},
			// lable的位置，可选为 left-左边，top-上边
			labelPosition: {
				type: String,
				default: ''
			},
			errorMessage: {
				type: [String, Boolean],
				default: ''
			}
		},
		data() {
			return {
				errorTop: false,
				errorBottom: false,
				labelMarginBottom: '',
				errorWidth: '',
				errMsg: '',
				val: '',
				labelPos: '',
				labelWid: '',
				labelAli: '',
				showMsg: 'undertext',
				border: false,
				isFirstBorder: false
			};
		},
		computed: {
			msg() {
				return this.errorMessage || this.errMsg;
			},
			fieldStyle() {
				let style = {}
				if (this.labelPos == 'top') {
					style.padding = '0 0'
					this.labelMarginBottom = '6px'
				}
				if (this.labelPos == 'left' && this.msg !== false && this.msg != '') {
					style.paddingBottom = '0px'
					this.errorBottom = true
					this.errorTop = false
				} else if (this.labelPos == 'top' && this.msg !== false && this.msg != '') {
					this.errorBottom = false
					this.errorTop = true
				} else {
					// style.paddingBottom = ''
					this.errorTop = false
					this.errorBottom = false
				}
				return style
			},

			// uni不支持在computed中写style.justifyContent = 'center'的形式，故用此方法
			justifyContent() {
				if (this.labelAli === 'left') return 'flex-start';
				if (this.labelAli === 'center') return 'center';
				if (this.labelAli === 'right') return 'flex-end';
			}

		},
		watch: {
			validateTrigger(trigger) {
				this.formTrigger = trigger
			}
		},
		created() {
			this.form = this.getForm()
			this.group = this.getForm('uniGroup')
			this.formRules = []
			this.formTrigger = this.validateTrigger
			// if (this.form) {
			this.form.childrens.push(this)
			// }
			this.init()
		},
		destroyed() {
			if (this.form) {
				this.form.childrens.forEach((item, index) => {
					if (item === this) {
						this.form.childrens.splice(index, 1)
					}
				})
			}
		},
		methods: {
			init() {
				if (this.form) {
					let {
						formRules,
						validator,
						formData,
						value,
						labelPosition,
						labelWidth,
						labelAlign,
						errShowType
					} = this.form

					this.labelPos = this.labelPosition ? this.labelPosition : labelPosition
					this.labelWid = this.label ? (this.labelWidth ? this.labelWidth : labelWidth):0
					this.labelAli = this.labelAlign ? this.labelAlign : labelAlign
					// 判断第一个 item
					if (!this.form.isFirstBorder) {
						this.form.isFirstBorder = true
						this.isFirstBorder = true
					}
					// 判断 group 里的第一个 item
					if (this.group) {
						if (!this.group.isFirstBorder) {
							this.group.isFirstBorder = true
							this.isFirstBorder = true
						}
					}

					this.border = this.form.border
					this.showMsg = errShowType

					if (formRules) {
						this.formRules = formRules[this.name] || {}
					}

					this.validator = validator

					if (this.name) {
						formData[this.name] = value.hasOwnProperty(this.name) ? value[this.name] : this.form._getValue(this, '')
					}
				} else {
					this.labelPos = this.labelPosition || 'left'
					this.labelWid = this.labelWidth || 65
					this.labelAli = this.labelAlign || 'left'
				}
			},
			/**
			 * 获取父元素实例
			 */
			getForm(name = 'uniForms') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false
					parentName = parent.$options.name;
				}
				return parent;
			},
			/**
			 * 移除该表单项的校验结果
			 */
			clearValidate() {
				this.errMsg = ''
			},
			setValue(value){
				if (this.name) {
					if(this.errMsg) this.errMsg = ''
					this.form.formData[this.name] =  this.form._getValue(this, value)
				}
			},
			/**
			 * 校验规则
			 * @param {Object} value
			 */
			async triggerCheck(value, callback) {
				let promise = null;
				this.errMsg = ''
				// if no callback, return promise
				if (callback && typeof callback !== 'function' && Promise) {
					promise = new Promise((resolve, reject) => {
						callback = function(valid) {
							!valid ? resolve(valid) : reject(valid)
						};
					});
				}

				if (!this.validator) {
					typeof callback === 'function' && callback(null);
					if (promise) return promise
				}

				const isNoField = this.isRequired(this.formRules.rules || [])


				let isTrigger = this.isTrigger(this.formRules.validateTrigger, this.validateTrigger, this.form.validateTrigger)

				let result = null

				if (!(!isTrigger)) {
					result = this.validator && (await this.validator.validateUpdate({
						[this.name]: value
					}, this.form.formData))
				}
				// 判断是否必填
				if (!isNoField && !value) {
					result = null
				}

				if (isTrigger && result && result.errorMessage) {
					if (this.form.errShowType === 'toast') {
						uni.showToast({
							title: result.errorMessage || '校验错误',
							icon: 'none'
						})
					}
					if (this.form.errShowType === 'modal') {
						uni.showModal({
							title: '提示',
							content: result.errorMessage || '校验错误'
						})
					}
				}

				this.errMsg = !result ? '' : result.errorMessage
				this.form.validateCheck(result ? result : null)
				typeof callback === 'function' && callback(result ? result : null);
				if (promise) return promise

			},
			/**
			 * 触发时机
			 * @param {Object} event
			 */
			isTrigger(rule, itemRlue, parentRule) {
				let rl = true;
				//  bind  submit
				if (rule === 'submit' || !rule) {
					if (rule === undefined) {
						if (itemRlue !== 'bind') {
							if (!itemRlue) {
								return parentRule === 'bind' ? true : false
							}
							return false
						}
						return true
					}
					return false
				}
				return true;
			},
			// 是否有必填字段
			isRequired(rules) {
				let isNoField = false
				for (let i = 0; i < rules.length; i++) {
					const ruleData = rules[i]
					if (ruleData.required) {
						isNoField = true
						break
					}
				}
				return isNoField
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-forms-item {
		position: relative;
		// padding: 16px 14px;
		text-align: left;
		color: #333;
		font-size: 14px;
		margin-bottom: 22px;
		background-color: #fff;
	}

	.uni-forms-item__inner {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		// flex-direction: row;
		// align-items: center;
	}

	.is-direction-left {
		flex-direction: row;
	}

	.is-direction-top {
		flex-direction: column;
	}

	.uni-forms-item__label {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		font-size: 14px;
		color: #333;
		width: 65px;
		// line-height: 2;
		// margin-top: 3px;
		padding: 5px 0;
		box-sizing: border-box;
		height: 36px;
		margin-right: 5px;
	}

	.uni-forms-item__content {
		/* #ifndef APP-NVUE */
		width: 100%;
		// display: flex;
		/* #endif */
		// flex: 1;
		// flex-direction: row;
		// align-items: center;
		box-sizing: border-box;
		min-height: 36px;
	}


	.label-icon {
		margin-right: 5px;
		margin-top: -1px;
	}

	// 必填
	.is-required {
		color: $uni-color-error;
	}

	.uni-error-message {
		position: absolute;
		bottom: -17px;
		left: 0;
		line-height: 12px;
		color: $uni-color-error;
		font-size: 12px;
		text-align: left;
	}

	.uni-error-msg--boeder {
		position: relative;
		bottom: 0;
		line-height: 22px;
	}

	.is-input-error-border {
		border-color: $uni-color-error;
	}

	.uni-forms-item--border {
		margin-bottom: 0;
		padding: 10px 15px;
		// padding-bottom: 0;
		border-top: 1px #eee solid;
	}

	.uni-forms-item-error {
		padding-bottom: 0;
	}

	.is-first-border {
		border: none;
	}
</style>
