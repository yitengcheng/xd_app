<template>
	<view>
		
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		mounted() {
			this.initTodoList(1);
		},
		data() {
			return {
				pageNo: 1,
			};
		},
		methods:{
			initTodoList(pageNo){
				let pageNum = pageNo || this.pageNo;
				let user = uni.getStorageSync('user');
				api.handles({
					pageNum,
					pageSize: 10,
					// complanyIds: this._.map(user.complany, 'id').join(','),
					complanyId: 8,
				}).then((res ={})=>{
					console.log(res)
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
