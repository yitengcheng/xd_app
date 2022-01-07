<template>
	<view class="content" style="align-items: center;">
		<view style="display: flex;width: 95%;align-items: flex-start;margin-top: 5px;">
			<u-button type="primary" size="mini" style="margin: 0;" @click="operation">新增</u-button>
		</view>

		<view
			v-if="customerList.length !== 0"
			class="customer_box"
			v-for="(customer, index) in customerList"
			:key="index"
		>
			<view class="info_title">
				<view style="height: 42rpx; display: flex; flex-direction: row; align-items: center;">
					<view class="adorn"></view>
					<text>客户信息</text>
				</view>
				<u-button size="mini" style="margin: 0;" type="primary" @touchstart="showActions(customer)">操作</u-button>
			</view>
			<view class="line"></view>
			<view class="customer_row">
				<view>【姓名】{{ customer.name }}</view>
				<view>【电话】{{ customer.phoneNumber }}</view>
			</view>
			<view class="customer_row">
				<view>【身份证】{{ customer.idcard }}</view>
				<view>【性别】{{ customer.sex === '1' ? '女' : '男' }}</view>
			</view>
			<view>【准驾车型】{{ customer.driveType }}</view>
			<view>【现居住地】{{ customer.nowAddress }}</view>
		</view>
		<u-image v-if="customerList.length === 0" src="/static/img/defalut.png"></u-image>

		<u-popup :show="show" mode="right" closeable safeAreaInsetTop @close="() => (show = false)">
			<u-form labelPosition="top" labelWidth="100" :model="searchForm" ref="search" class="search_box">
				<u-form-item label="姓名" prop="name" borderBottom>
					<u-input v-model="searchForm.name" border="none" placeholder="请输入姓名"></u-input>
				</u-form-item>
				<u-form-item label="电话号码" prop="phoneNumber" borderBottom>
					<u-input v-model="searchForm.phoneNumber" border="none" placeholder="请输入电话号码"></u-input>
				</u-form-item>
				<u-form-item label="性别" prop="sex" borderBottom @click="pickSex">
					<u-input
						v-model="searchForm.sex"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择性别"
						border="none"
					/>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-button type="primary" class="btn" @click="search">搜索</u-button>
				<u-button type="error" class="btn" @click="resetForm">重置</u-button>
			</u-form>
		</u-popup>
		<u-action-sheet
			:show="showSex"
			:actions="actions"
			title="请选择性别"
			@close="showSex = false"
			@select="sexSelect"
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
				name: '',
				phoneNumber: '',
				sex: '',
			},
			show: false,
			showSex: false,
			actions: [
				{
					name: '男',
				},
				{
					name: '女',
				},
			],
			customerList: [],
		};
	},
	mounted() {
		this.getCustomerList(1);
		uni.$on('customer',()=>{
			this.getCustomerList(1);
		})
	},
	onNavigationBarButtonTap() {
		this.show = true;
	},
	onPullDownRefresh() {
		this.getCustomerList(1);
	},
	onReachBottom() {
		this.getCustomerList(this.pageNum);
	},
	methods: {
		operation(id, flag){
			if(flag){
				uni.navigateTo({
					url: `/pages/model/my/CustomerDetail?id=${id}&edit=look`
				});
			} else {
				uni.navigateTo({
					url: `/pages/model/my/CustomerDetail?${id ? 'id='+id : ''}`
				});
			}
		},
		pickSex() {
			this.showSex = true;
			uni.hideKeyboard();
		},
		showActions(customer) {
			let options = [{ title: '修改' }, { title: '承租人详情' }, { title: '删除' }];
			!customer.black && options.push({ title: '黑名单' });
			plus.nativeUI.actionSheet(
				{
					title: '功能',
					cancel: '取消',
					buttons: options,
				},
				e => {
					switch(e.index){
						case 1:
							this.operation(customer.id);
							break;
						case 2:
							this.operation(customer.id, true);
							break;
						case 3:
							this.deleteCustomer(customer.id);
							break;
						case 4:
							uni.showLoading({
								mask:true,
								title: '开发中，请移步电脑端'
							})
							break;
					}
				}
			);
		},
		async deleteCustomer(id){
			const res = await api.deleteCustomer(id);
			res && uni.showModal({
				title: '提示',
				content: '删除成功',
				showCancel:false,
				success: () => {
					this.getCustomerList(1);
				}
			})
		},
		async getCustomerList(pageNo) {
			let sex = undefined;
			if (this.searchForm.sex === '男') {
				sex = '0';
			} else if (this.searchForm.sex === '女') {
				sex = '1';
			}
			delete this.searchForm.sex;
			const list = await api.getCustomerList({
				pageNum: pageNo ?? this.pageNum,
				pageSize: 10,
				sex,
				...this.searchForm,
			});
			uni.stopPullDownRefresh();
			if (list?.total === 0) {
				this.customerList = [];
				this.pageNum = 1;
				return;
			}
			if (list?.rows.length > 0) {
				pageNo === 1
					? (this.customerList = list.rows)
					: (this.customerList = this._.concat(this.customerList, list.rows));
				pageNo === 1 ? (this.pageNum = 2) : (this.pageNum = this.pageNum + 1);
			}
		},
		sexSelect(e) {
			this.searchForm.sex = e.name;
		},
		resetForm() {
			this.searchForm = {
				name: '',
				phoneNumber: '',
				sex: '',
			};
			this.$nextTick(() => {
				this.show = false;
			});
		},
		search() {
			this.show = false;
			this.getCustomerList(1);
		},
	},
};
</script>

<style lang="scss" scoped>
.search_box {
	margin: 0 10px;
}
.btn {
	margin-top: 20px;
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
