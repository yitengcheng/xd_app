<template>
	<view class="content" style="align-items: center;justify-content: center;">
		<u-image v-if="!flag" :src="contract" ></u-image>
		<web-view v-else :src="contract"></web-view>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import api from '../../../api/index.js';
	export default {
		async onLoad(option) {
			if(option.id.indexOf('/') === -1){
				this.flag = true
				const res = await api.lookContract(option.id);
				this.contract = `${res.data}`;
			} else {
				this.contract =`${config.IMG_URL}${option.id}`;
			}
		},
		data() {
			return {
				contract: '',
				flag: false,
			};
		}
	}
</script>

<style lang="scss">

</style>
