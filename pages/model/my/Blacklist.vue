<template>
	<view class="content" style="align-items: center;">
		<u-form labelPosition="top" :labelWidth="180" :model="searchForm" ref="search" class="search_box">
			<u-form-item label="黑名单类型" prop="dictValue" @click="pickDictValue">
				<u-input
					v-model="searchForm.dictValue"
					disabled
					disabledColor="#ffffff"
					placeholder="请选择黑名单类型"
				/>
			</u-form-item>
			<u-form-item label="拉黑原因" prop="cause">
				<u-input v-model="searchForm.cause" placeholder="请输入拉黑原因"></u-input>
			</u-form-item>
		</u-form>
		
		<view class="search_btn">
			<u-button type="primary" :customStyle="btn" @click="search" size="mini">搜索</u-button>
			<u-button type="error" :customStyle="btn" @click="resetForm" size="mini">重置</u-button>
		</view>
		
		<view
			v-if="blackCustomerList.length !== 0"
			class="customer_box"
			v-for="(blackCustomer, index) in blackCustomerList"
			:key="index"
		>
			<view class="info_title">
				<view style="height: 42rpx; display: flex; flex-direction: row; align-items: center;">
					<view class="adorn"></view>
					<text>客户信息</text>
				</view>
			</view>
			<view class="line"></view>
			<view class="customer_row">
				<view>【姓名】{{ blackCustomer.name }}</view>
				<view>【电话】{{ blackCustomer.phoneNumber }}</view>
			</view>
			<view class="customer_row">
				<view>【身份证】{{ blackCustomer.idcard }}</view>
				<view>【性别】{{ blackCustomer.sex === '1' ? '女' : '男' }}</view>
			</view>
			<view>【添加单位】{{ hideInfo('1',blackCustomer)}}</view>
			<view>【公司联系方式】{{ hideInfo('2',blackCustomer)}}</view>
			<view>【黑名单类型】{{ showBlackType(blackCustomer) }}</view>
			<view>【拉黑原因】{{ blackCustomer.cause }}</view>
		</view>
		<u-image v-if="blackCustomerList.length === 0" src="/static/img/defalut.png"></u-image>
		
		<u-action-sheet
			:show="showDictValue"
			:actions="actions"
			title="请选择黑名单类型"
			@close="showDictValue = false"
			@select="dictValueSelect"
		/>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				pageNum: 1,
				searchForm: {
					cause: '',
					dictValue: '',
				},
				showDictValue: false,
				actions: [],
				blackCustomerList: [],
				btn:{
					width: '35vw'
				}
			};
		},
		onLoad() {
			this.dictInit( 'black_type' ).then( () => {
				let blackList = uni.getStorageSync( 'black_type' );
				blackList.forEach(o => {
					this.actions.push({name: o.text, value: o.value});
				});
			} );
		},
		mounted() {
			this.initBlackList(1);
		},
		onPullDownRefresh() {
			this.initBlackList(1);
		},
		onReachBottom() {
			this.initBlackList(this.pageNum);
		},
		methods:{
			hideInfo(type,item){
				let info = item.hideInfo.split(',');
				let res = '该公司选择不公开';
				if(!this._.includes(info,type)) {
					if(type === '1') res = item.complany?.complanyName
					if(type === '2') res = item.complany?.phoneNumber
				}
				return res;
			},
			showBlackType(item){
				let types = item.dictValue?.split(',');
				let res = [];
				types.forEach(o => {
					let temp = this._.find(this.actions,{ value: o });
					res.push(temp?.name);
				});
				return res.join(',');
			},
			async initBlackList(pageNo){
				let item = this._.find(this.actions, o => { return o.name === this.searchForm.dictValue });
				const res = await api.blackList({
					pageNum: pageNo ?? this.pageNum,
					pageSize: 10,
					dictValue: item?.value * 1 || undefined,
					cause: this.searchForm.cause || undefined,
				});
				uni.stopPullDownRefresh();
				if(res?.total === 0){
					this.blackCustomerList = [];
					this.pageNum = 1;
					return;
				}
				if (res?.rows.length > 0) {
					pageNo === 1
						? (this.blackCustomerList = res.rows)
						: (this.blackCustomerList = this._.concat(this.blackCustomerList, res.rows));
					pageNo === 1 ? (this.pageNum = 2) : (this.pageNum = this.pageNum + 1);
				}
			},
			pickDictValue() {
				this.showDictValue = true;
				uni.hideKeyboard();
			},
			dictValueSelect(e) {
				this.searchForm.dictValue = e.name;
			},
			resetForm() {
				this.searchForm = {
					cause: '',
					dictValue: '',
				};
			},
			search() {
				this.show = false;
				this.initBlackList(1);
			},
		}
	}
</script>

<style lang="scss">
.search_box {
	display: flex;
	flex-direction: row;
}
.search_btn {
	display: flex;
	flex-direction: row;
	width: 80vw;
}
.customer_box {
	display: flex;
	flex-direction: column;
	width: 90%;
	padding: 10px;
	margin-top: 5px;
	background-color: #ffffff;
	border-radius: 5px;
}
.customer_row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.adorn {
	width: 3px;
	height: 60%;
	background-color: #ffd101;
	margin-right: 5px;
}
.info_title {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	font-weight: bold;
}
.line {
	width: 100%;
	height: 1px;
	background-color: #eee;
	margin: 5px 0px;
}
</style>
