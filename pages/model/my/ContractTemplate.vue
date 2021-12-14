<template>
	<view class="content" style="align-items: center;">
		<view class="top_button">
			<u-button color="linear-gradient(to right, #2af598, #009efd)" class="btn" size="mini" @click="toApprove">电子合同（企业认证）</u-button>
			<u-button color="linear-gradient(to right, #37ecba, #72afd3)" class="btn" size="mini" @click="qysLogin(1)">添加员工电子签章</u-button>
			<u-button color="linear-gradient(to right, #b721ff, #21d4fd)" class="btn" size="mini" @click="qysLogin(2)">员工电子签章授权</u-button>
		</view>
		<text>长按可编辑或删除自定义合同条款</text>
		<view class="contract_template_box">
			<view class="mask">
				<view class="contract_no">合同编号[000000000000]</view>
				<view class="contract_title">汽车租赁合同</view>
				<!-- 公司方 -->
				<view class="contract_jia">{{`甲方(出租方)：${(complany || {}).complanyName || ''}`}}</view>
				<view class="contract_jia">{{`主要负责人：${(complany || {}).juridicalName || ''}`}}</view>
				<view class="contract_jia">{{ `联系电话：${(complany || {}).phoneNumber || ''}` }}</view>
				<view class="contract_jia">{{ `公司地址：${(complany || {}).complanyAddress || ''}` }}</view>
				<!-- 租车人方 -->
				<view class="row_space_between">
					<h3>乙方(承租方)姓名：</h3>
					<h3>性别：</h3>
					<h3>民族：</h3>
				</view>
				<view class="row_space_between">
					<h3>身份证号：</h3>
					<h3>联系电话：</h3>
				</view>
				<h3>家庭住址：</h3>
				<h3>现住地址：</h3>
				<h4>根据《中华人民共和国民法典》及相关法律、法规之规定，根据平等、自愿、有偿的原则、双方将彼此的权利和义务约定如下：</h4>
				<text>第一条、甲方租给乙方车辆：</text>
				<table class="contract_table" cellpadding="0" cellspacing="0" border="1" width="100%">
					<tr>
						<td>品牌：</td>
						<td>车型：</td>
						<td>颜色：</td>
					</tr>
					<tr>
				  <td>车牌：</td>
						<td>发动机号：</td>
						<td>车辆使用燃油(号)</td>
					</tr>
					<tr>
						<td colspan="2">车架号：</td>
						<td>预计租期：(天)</td>
					</tr>
					<tr><td colspan="3">租车地点：</td></tr>
					<tr><td colspan="3">还车地点：</td></tr>
					<tr>
						<td colspan="2">交车时间：</td>
						<td colspan="2">还车时间：</td>
					</tr>
				</table>
				租赁期间车辆每日平均最高行驶里程: ____Km (
				<b>乙方确认:租赁期间,每日平均最高行驶里程超过约定,乙方按____元/公里支付违约金</b>
				)
				<text>第二条：租赁费为：____元／天，以实际租赁的时间交纳租赁费____元一次性支付给甲方，乙方租赁时间不足一天的按照一天计算，超时租赁费另行交纳计算。</text>
				<text>第三条：甲、乙方在签约之时，乙方应向甲方交纳_元作为车辆保证金，租期满后留____元作为违章保证金30日后无违章退还。（保证金不能做为租金）</text>
				<text>第四条：甲方租赁给乙方车辆，机动车保险由甲方购买。第三责任险：____机动车损失险：____</text>
			</view>
			<view v-for="text in textList" :key="text.id" @longpress="editText(text)" style="border: #333333 1px dashed;margin: 2px 0px;">{{text.value}}</view>
			<u-button type="primary" @click="editText()">添加条款</u-button>
			<view class="mask">
				<text>附车辆外观清单：刮痕（——）凹处（O）脱漆（√）裂痕（×）</text>
				<view class="row_warp">
					<image src="../../../static/img/car2.png" style="z-index: -20;width: 200px;height: 80px;"></image>
					<image src="../../../static/img/car1.png" style="z-index: -20;width: 200px;height: 80px;"></image>
					<image src="../../../static/img/car3.png" style="z-index: -20;width: 200px;height: 80px;"></image>
					<image src="../../../static/img/car4.png" style="z-index: -20;width: 200px;height: 80px;"></image>
					<image src="../../../static/img/car5.png" style="z-index: -20;width: 200px;height: 80px;"></image>
				</view>
				<view class="row_warp">
					<text>随车工具（ ）</text>
					<text>机油（ ）</text>
					<text>冷却液（ ）</text>
					<text>C D（ ）</text>
					<text>备 胎（ ）</text>
					<text>雨刮（ ）</text>
					<text>全车灯（ ）</text>
				</view>
				<text>备注</text>
				<table class="contract_table" cellpadding="0" cellspacing="0" border="1" width="100%">
				    <tr>
				        <td><strong>甲方签章：</strong></td>
				        <td><strong>乙方签章：</strong></td>
				    </tr>
				    <tr>
				        <td><strong>甲方签署日期：</strong></td>
				        <td><strong>乙方签署日期：</strong></td>
				    </tr>
				</table>
			</view>
		</view>
		<u-button type="primary" @click="saveContract" class="save_btn">保存</u-button>
		<u-modal negativeTop="80" :show="show" confirmText="确认" cancelText="删除" closeOnClickOverlay :showCancelButton="!!text" @close="() => show = false" @confirm="confirmValue" @cancel="deleteValue">
			<u-textarea
				:value="value"
				@input="(e) => value = e"
			    placeholder="请输入合同条款"
			    clearable
			  ></u-textarea>
		</u-modal>
	</view>
</template>

<script>
import config from '../../../common/config.js';
import api from '../../../api/index.js';
import { toChinese } from '../../../common/utils.js'
export default {
	data() {
		return {
			complany: {},
			textList: [],
			text: '',
			show: false,
			value: ''
		};
	},
	mounted() {
		let user = uni.getStorageSync('user');
		this.complany = this._.find(user?.complany, o => { return o.id === uni.getStorageSync('complanyId') });
		this.getComplanyInfo();
	},
	methods: {
		toApprove() {
			uni.navigateTo({
				url: '/pages/model/my/Approve'
			});
		},
		async qysLogin(type) {
			uni.showModal({
				title: '提示',
				content: '请前往电脑端办理此业务',
				showCancel: false,
			});
			return
			// const res = await api.qysLogin({
			// 	complanyName: this.complany.complanyName,
			// 	type,
			// });
			// if(res?.data){
			// 	plus.runtime.openURL(res?.data);
			// }
		},
		async getComplanyInfo(){
			const res = await api.getComplanyInfo(uni.getStorageSync('complanyId'));
			if(res?.data){
				this.textList = JSON.parse(res?.data?.conctratText);
			}
		},
		editText(text){
			this.show = true;
			this.text = text;
			this.value = text?.value ?? `第${toChinese(this.textList?.[this.textList.length -1].id + 1)}条：`;
		},
		confirmValue() {
			let obj = this._.find(this.textList, o => {
				return o.id === this.text?.id;
			});
			if(obj){
				obj.value = this.value;
			} else {
				this.textList.push({
					id: this.textList[this.textList.length - 1] + 1,
					read: true,
					value: this.value
				})
			}
			this.show = false;
		},
		deleteValue(){
			this.textList = this._.reject(this.textList, { 'id': this.text.id });
			this.show = false;
		},
		saveContract(){
			api.saveContract({
				complanyId: uni.getStorageSync('complanyId'),
				conctratText: JSON.stringify(this.textList)
			}).then(res => {
				uni.showModal({
					title: '提示',
					content: '修改成功',
					showCancel: false,
				})
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.top_button {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	width: 95%;
	padding: 10px;
}
.contract_template_box {
	display: flex;
	width: 95%;
	padding: 10px;
	flex-direction: column;
}
.contract_no {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
.contract_title {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	font-size: 22px;
	font-weight: bold;
}
.contract_jia {
	font-size: 18px;
	font-weight: bold;
}
.row_space_between {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding-right: 50px;
}
.contract_table {
	background:none; 
	bottom:0px;
}
.row_warp {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.mask {
	background-color: rgba(#000000, 0.6);
}
.save_btn {
	width: 100%;
}
</style>
