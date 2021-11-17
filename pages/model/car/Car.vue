<template>
	<view class="content">
		<u-sticky>
			<u-tabs :current="current" :list="items" @change="onClickItem" lineColor="#FFD101" :activeStyle="{color: '#FFD101'}" :is-scroll="false"></u-tabs>
		</u-sticky>
		<view>
			<view v-show="current === 0">
				<WaterfallsFlow :wfList="allList" @itemTap="itemTap"/>
			</view>
			<view v-show="current === 1">
				<WaterfallsFlow :wfList="forRentList" @itemTap="itemTap"/>
			</view>
			<view v-show="current === 2">
				<WaterfallsFlow :wfList="rentOutList" @itemTap="itemTap"/>
			</view>
		</view>
		<uni-fab :content="content" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger">
		</uni-fab>
	</view>
</template>
<script>
	import WaterfallsFlow from '../../../components/WaterfallsFlow/WaterfallsFlow.vue';
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	export default {
		components: {
			WaterfallsFlow,
		},
		data() {
			return {
				current: 1,
				items: [
					{name: '全部车辆'},
					{name: '待租车辆'},
					{name: '在租车辆'},
				],
				allList: [],
				forRentList: [],
				rentOutList: [],
				content: [ {
					iconPath: '../../../static/img/goToTop.png',
					selectedIconPath: '',
					text: '回到顶部'
				}, {
					iconPath: '../../../static/img/carDetail.png',
					selectedIconPath: '',
					text: '添加车辆'
				} ],
				allPageNo: 1,
				forRentPageNo: 1,
				rentOutPageNo: 1,
			};
		},
		onLoad() {
			this.getCarList( 1 );
			this.$on( 'car', () => {
				this.getCarList( 1 );
			} )
		},
		onReachBottom() {
			let pageNo = this.current === 0 ? this.allPageNo : this.current === 1 ? this.forRentPageNo : this.rentOutPageNo;
			this.getCarList( pageNo );
		},
		onPullDownRefresh() {
			this.getCarList( 1 );
		},
		methods: {
			itemTap( item ) {
				uni.navigateTo( {
					url: `/pages/model/car/CarDetail?type=detail&id=${item.carInfo.id}`,
				} )
			},
			onClickItem( e ) {
				this.current = e;
				this.$nextTick( () => {
					this.getCarList( 1 );
				} )
			},
			trigger( e ) {
				switch ( e.index ) {
					case 0:
						uni.pageScrollTo( {
							scrollTop: 0,
							duration: 200
						} );
						break;
					case 1:
						uni.navigateTo( {
							url: '/pages/model/car/CarDetail?type=add',
						} )
						break;
					default:
						break;
				}
			},
			judgePageNo() {
				switch ( this.current ) {
					case 0:
						return this.allPageNo;
						break;
					case 1:
						return this.forRentPageNo;
						break;
					case 2:
						return this.rentOutPageNo;
						break;
					default:
						return 1;
						break;
				}
			},
			getCarList( pageNo ) {
				let pageNum = pageNo || this.judgePageNo();
				let status = this.current === 0 ? undefined : this.current === 1 ? 0 : 1;
				api.carList( {
					pageNum,
					pageSize: 10,
					status,
				} ).then( ( res ) => {
					if ( res?.rows.length > 0 ) {
						let tmp = [];
						res.rows.forEach( ( item ) => {
							let img = item.carPhotos.split( ',' )[ 0 ];
							tmp.push( {
								image: `${config.IMG_URL}${img}`,
								nickName: item.carBrand,
								plate: item.carNum,
								carInfo: item,
								id: item.id,
							} )
						} );
						if ( pageNum === 1 ) {
							this.current === 0 ? this.allList = tmp : this.current === 1 ? this.forRentList = tmp :
								this.rentOutList = tmp;
							this.current === 0 ? this.allPageNo = pageNo : this.current === 1 ? this
								.forRentPageNo = pageNo : this.rentOutPageNo = pageNo;
						} else {
							this.current === 0 ? this.allList = this._.concat( this.allList, tmp ) : this
								.current === 1 ? this.forRentList = this._.concat( this.forRentList, tmp ) : this
								.rentOutList = this._.concat( this.rentOutList, tmp );
						}
						this.current === 0 ? this.allPageNo = this.allPageNo + 1 : this.current === 1 ? this
							.forRentPageNo = this.forRentPageNo + 1 : this.rentOutPageNo = this.rentOutPageNo + 1;
					}
					uni.stopPullDownRefresh();
				} );
			}
		}
	};
</script>
<style lang="scss" scoped>
	
</style>
