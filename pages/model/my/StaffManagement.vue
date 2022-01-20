<template>
	<view class="content" style="align-items: center;">
		<view style="display: flex;width: 95%;align-items: flex-start;margin-top: 5px;">
			<u-button type="primary" size="mini" style="margin: 0;" @click="operation">新增</u-button>
		</view>

		<view class="staff_box" v-if="staffList.length !== 0" v-for="(staff, index) in staffList" :key="index">
			<view class="info_title">
				<view style="height: 42rpx; display: flex; flex-direction: row; align-items: center;">
					<view class="adorn"></view>
					<text>员工信息</text>
				</view>
				<view @touchstart="showActions(staff)">操作</view>
			</view>
			<view class="line"></view>
			<view class="staff_row">
				<view>【姓名】{{ staff.realName }}</view>
				<view>【电话】{{ staff.phonenumber }}</view>
			</view>
			<view class="staff_row">
				<view>【身份证】{{ staff.idcard }}</view>
				<view>【性别】{{ staff.sex === '1' ? '女' : '男' }}</view>
			</view>
			<view>【地址】{{ staff.address }}</view>
		</view>
		<u-image v-if="staffList.length === 0" src="/static/img/defalut.png"></u-image>

		<u-popup :show="show" mode="right" closeable safeAreaInsetTop @close="() => (show = false)">
			<u-form labelPosition="top" labelWidth="100" :model="searchForm" ref="search" class="search_box">
				<u-form-item label="姓名" prop="realName" borderBottom>
					<u-input v-model="searchForm.realName" border="none" placeholder="请输入姓名"></u-input>
				</u-form-item>
				<u-form-item label="电话号码" prop="phonenumber" borderBottom>
					<u-input v-model="searchForm.phonenumber" border="none" placeholder="请输入电话号码"></u-input>
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
				realName: '',
				phonenumber: '',
				sex: '',
			},
			show: false,
			showSex: false,
			staffList: [],
			actions: [
				{
					name: '男',
				},
				{
					name: '女',
				},
			],
		};
	},
	mounted() {
		this.getStaffList(1);
		uni.$on('staff',()=>{
			this.getStaffList(1);
		})
	},
	onNavigationBarButtonTap() {
		this.show = true;
	},
	onPullDownRefresh() {
		this.getStaffList(1);
	},
	onReachBottom() {
		this.getStaffList(this.pageNum);
	},
	methods: {
		operation(id, flag) {
			if (flag) {
				uni.navigateTo({
					url: `/pages/model/my/StaffDetail?id=${id}&edit=look`,
				});
			} else {
				uni.navigateTo({
					url: `/pages/model/my/StaffDetail?${id ? 'id=' + id : ''}`,
				});
			}
		},
		showActions(staff) {
			let options = [{ title: '修改' }, { title: '删除' }];
			plus.nativeUI.actionSheet(
				{
					title: '功能',
					cancel: '取消',
					buttons: options,
				},
				e => {
					switch (e.index) {
						case 1:
							this.operation(staff.userId);
							break;
						case 2:
							this.operation(staff.userId, true);
							break;
					}
				}
			);
		},
		async deleteCustomer(id) {
			const res = await api.deleteCustomer(id);
			res &&
				uni.showModal({
					title: '提示',
					content: '删除成功',
					showCancel: false,
					success: () => {
						this.getCustomerList(1);
					},
				});
		},
		async getStaffList(pageNo) {
			let sex = undefined;
			if (this.searchForm.sex === '男') {
				sex = '0';
			} else if (this.searchForm.sex === '女') {
				sex = '1';
			}
			delete this.searchForm.sex;
			const list = await api.getstaffList({
				pageNum: pageNo ?? this.pageNum,
				pageSize: 10,
				sex,
				...this.searchForm,
			});
			uni.stopPullDownRefresh();
			if (list?.total === 0) {
				this.staffList = [];
				this.pageNum = 1;
				return;
			}
			if (list?.rows.length > 0) {
				pageNo === 1
					? (this.staffList = list.rows)
					: (this.staffList = this._.concat(this.staffList, list.rows));
				pageNo === 1 ? (this.pageNum = 2) : (this.pageNum = this.pageNum + 1);
			}
		},
		sexSelect(e) {
			this.searchForm.sex = e.name;
		},
		resetForm() {
			this.searchForm = {
				realName: '',
				phonenumber: '',
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
		pickSex() {
			this.showSex = true;
			uni.hideKeyboard();
		},
	},
};
</script>

<style lang="scss">
.search_box {
	margin: 0 10px;
}
.btn {
	margin-top: 20px;
}
.staff_box {
	display: flex;
	flex-direction: column;
	width: 90%;
	padding: 10px;
	margin-top: 5px;
	background-color: #ffffff;
	border-radius: 5px;
}
.staff_row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.adorn {
	width: 3px;
	height: 60%;
	background-color: #1B90D1;
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
