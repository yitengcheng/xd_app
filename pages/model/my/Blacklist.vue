<template>
	<view>
		
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			initBlackList(){
				const res = await api.blackList();
			}
		}
	}
</script>

<style lang="scss">

</style>
