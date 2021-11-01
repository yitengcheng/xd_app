<template>
	<scroll-view>
		<uni-easyinput v-model="keyword" placeholder="请输入关键字搜索" suffixIcon="search" @iconClick="getData(1)"/>
		<uni-list :border="false">
			<uni-list-item
				v-for="(item, index) in data"
				:key="index"
				:avatar-circle="true"
				:title="item.carBrand"
				:thumb="`${configImg}${item.carPhotos.split(',')[0]}`"
				:note="item.note"
				:rightText="item.time"
				thumbSize="lg"
				:clickable="true"
				@click="clickItem(item)"
			/>
		</uni-list>
	</scroll-view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
export default {
	data() {
		return {
			keyword: '',
			data: [],
			pageNo: 1,
			configImg: config.IMG_URL,
		};
	},
	onLoad() {
		this.getData(1);
		uni.$on('inCar', ()=>{
			this.getData(1);
		});
	},
	mounted() {
		api.notHandle({
			pageNum: 1,
			pageSize: 10,
		}).then(res => {
			if(res.total > 0){
				uni.showModal({
					title: '提示',
					content: '您有待办事项未处理，请及时处理！',
					showCancel: false,
					success: () => {
						uni.navigateTo({
							url: '/pages/model/my/Todo',
						})
					}
				})
			}
		});
	},
	onPullDownRefresh() {
		this.getData(1);
	},
	onReachBottom() {
		this.getData(this.pageNo);
	},
	methods: {
		getData(page) {
			let tmp = [];
			let pageNum = page || this.pageNo;
			let user = uni.getStorageSync('user');
			api.carList({
				pageNum,
				pageSize: 10,
				status: 2,
				keyword: this.keyword,
				complanyIds: this._.map(user.complany, 'id').join(','),
			}).then((res={}) =>{
				if(pageNum === 1){
					this.data = res.rows;
					this.pageNo = page;
				} else {
					this.data = this._.concat(this.data, res.rows);
				}
			})
			this.pageNo = this.pageNo + 1;
			uni.stopPullDownRefresh();
		},
		clickItem(e){
			uni.navigateTo({
				url: `/pages/model/InCar/InCarDetail?id=${e.id}`
			})
			
		}
	}
};
</script>

<style lang="scss"></style>
