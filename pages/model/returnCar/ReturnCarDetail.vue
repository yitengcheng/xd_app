<template>
	<view class="content" style="align-items: center;">
		<swiper class="swiper_box" @change="change">
			<swiper-item v-for="(item, index) in carInfo.carPhotos" :key="index">
				<image :src="item" class="swiper_img" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>车辆信息</text>
			</view>
			<view class="line"></view>
			<text>【车辆品牌】{{ carInfo.carBrand || '无' }}</text>
			<text>【车牌号】{{ carInfo.carNum || '无' }}</text>
			<text>【车牌颜色】{{ carInfo.color || '无' }}</text>
			<text>【租车单价】{{ ((carInfo || {}).wxOrder || {}).unitPrice || '无' }} 元/天</text>
			<text>【租车保证金】{{ ((carInfo || {}).wxOrder || {}).bondMoney || '无' }} 元</text>
			<text>
				【违章保证金】{{ ((carInfo || {}).wxOrder || {}).violationBondMoney || '无' }} 元
			</text>
			<text>
				【租车时间】{{
					dayjs(((carInfo || {}).wxOrder || {}).wantCarTime).format(
						'YYYY-MM-DD HH:mm:ss'
					)
				}}至{{
					dayjs(((carInfo || {}).wxOrder || {}).estimateReturnTime).format(
						'YYYY-MM-DD HH:mm:ss'
					)
				}}
			</text>
			<text>【租车天数】{{ ((carInfo || {}).wxOrder || {}).rentCarDays }} 天</text>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>租车人信息</text>
			</view>
			<view class="line"></view>
			<text>【姓名】{{ (carInfo.driverUser || {}).name || '无' }}</text>
			<text>【身份证号】{{ (carInfo.driverUser || {}).idcard || '无' }}</text>
			<text>【手机号】{{ (carInfo.driverUser || {}).phoneNumber || '无' }}</text>
			<view
				class="photo_box"
				v-if="(carInfo.driverUser || {}).idcardFront"
				@touchstart="tostart"
				@touchmove="tomove"
				@longpress="saveImage((carInfo.driverUser || {}).idcardFront)"
			>
				<text>
					【身份证】
					<span style="font-size: 12px;color: #666666;">长按图片可下载到手机</span>
				</text>
				<image
					style="margin-left: 3vw;"
					:src="newUrl((carInfo.driverUser || {}).idcardFront)"
					mode="aspectFit"
				></image>
			</view>
			<view
				class="photo_box"
				v-if="(carInfo.driverUser || {}).licenseMainUrl"
				@touchstart="tostart"
				@touchmove="tomove"
				@longpress="saveImage((carInfo.driverUser || {}).licenseMainUrl)"
			>
				<text>
					【驾驶证正面】
					<span style="font-size: 12px;color: #666666;">长按图片可下载到手机</span>
				</text>
				<image
					style="margin-left: 3vw;"
					:src="newUrl((carInfo.driverUser || {}).licenseMainUrl)"
					mode="aspectFit"
				></image>
			</view>
			<view
				class="photo_box"
				v-if="(carInfo.driverUser || {}).licenseViceUrl"
				@touchstart="tostart"
				@touchmove="tomove"
				@longpress="saveImage((carInfo.driverUser || {}).licenseViceUrl)"
			>
				<text>
					【驾驶证背面】
					<span style="font-size: 12px;color: #666666;">长按图片可下载到手机</span>
				</text>
				<image
					style="margin-left: 3vw;"
					:src="newUrl((carInfo.driverUser || {}).licenseViceUrl)"
					mode="aspectFit"
				></image>
			</view>
			<view class="photo_box" v-if="(carInfo.wxOrder || {}).photoScan">
				<text>
					【相关照片】
					<span style="font-size: 12px;color: #666666;">长按图片可下载到手机</span>
				</text>
				<view
					v-for="(item, index) in (carInfo.wxOrder || {}).photoScan.split(',')"
					:key="index"
					@touchstart="tostart"
					@touchmove="tomove"
					@longpress="saveImage(item)"
				>
					<image
						style="margin-left: 3vw;"
						:src="newUrl(item)"
						mode="aspectFit"
					></image>
				</view>
			</view>
		</view>
		<view class="info_box">
			<view class="info_title">
				<view class="adorn"></view>
				<text>操作</text>
			</view>
			<view class="line"></view>
			<view class="margin_box">
				<text>【是否续租】</text>
				<u-switch
					v-model="hasRelet"
					@change="(e)=> {hasRelet = e; hasChangeCar=false}"
					active-color="#1B90D1"
				></u-switch>
			</view>
			<view class="margin_box">
				<text>【是否换车】</text>
				<u-switch
					v-model="hasChangeCar"
					@change="(e)=> {hasChangeCar = e; hasRelet=false}"
					active-color="#1B90D1"
				></u-switch>
			</view>
			<Combox v-if="hasChangeCar" placeholder="请选择待换车辆" :value="carId" :candidates="carList" :isJSON="true" keyName="text" @getValue="getCarValue"></Combox>
			<u-input
				v-if="hasChangeCar"
				v-model="unitPrice"
				placeholder="请输入租金"
				type="number"
				border="bottom"
				shape="circle"
				inputAlign="right"
			></u-input>
			<u-input
				v-if="hasChangeCar"
				v-model="violationBondMoney"
				placeholder="请输入违章保证金"
				type="number"
				border="bottom"
				shape="circle"
				inputAlign="right"
			></u-input>
			<u-input
				v-if="hasChangeCar"
				v-model="bondMoney"
				placeholder="请输入车辆保证金"
				type="number"
				border="bottom"
				shape="circle"
				inputAlign="right"
			></u-input>
			<u-input
				v-if="hasRelet"
				v-model="makeUpRent"
				placeholder="请输入续租租金"
				type="number"
				border="bottom"
				shape="circle"
				inputAlign="right"
			></u-input>
			<u-input
				v-if="hasRelet"
				v-model="renewalDay"
				placeholder="请输入续租天数"
				type="number"
				border="bottom"
				shape="circle"
				inputAlign="right"
			></u-input>
			<view v-if="!hasRelet && !hasChangeCar" class="margin_box">
				<text>【已扣除租车保证金】</text>
				<u-input
					v-model="deductBondMoney"
					placeholder="请输入已扣除租车保证金"
					type="number"
					border="bottom"
					shape="circle"
					inputAlign="right"
				></u-input>
				<text>元</text>
			</view>
		</view>
		<view class="btn_box" v-if="!hasRelet && !hasChangeCar">
			<u-button class="btn" type="primary" @click="normalReturnCar">正常一键还车</u-button>
			<u-button class="btn" @click="abnormalReturnCar">异常还车</u-button>
			<u-button v-show="!!(carInfo.wxOrder || {}).contract" @click="pact(carInfo.wxOrder.contract)" class="btn">
				最新合同
			</u-button>
			<u-button v-show="!!(carInfo.wxOrder || {}).contract" @click="allPact" class="btn">全部合同</u-button>
		</view>
		<view class="btn_box" v-if="hasRelet">
			<u-button class="btn" type="primary" @click="reletCar(1)">确认续租</u-button>
		</view>
		<view class="btn_box" v-if="hasChangeCar">
			<u-button class="btn" type="primary" @click="reletCar(2)">确认换车</u-button>
		</view>
	</view>
</template>

<script>
import api from '../../../api/index.js';
import config from '../../../common/config.js';
import IdCardOcr from '../../../components/ocr/IdCardOcr.vue';
import FormInput from '../../../components/form/FormInput.vue';
import FormRadio from '../../../components/form/FormRadio.vue';
import { card15, card18, phoneRegex } from '../../../common/regex.js';
import { togetherUrl } from '../../../common/utils.js';
import Combox from '../../../components/cuihai-combox/cuihai-combox.vue';
export default {
	components: {
		IdCardOcr,
		FormInput,
		FormRadio,
		Combox,
	},
	data() {
		return {
			carInfo: {},
			idCardInfo: {},
			driverUser: {},
			current: 0,
			hasRelet: false,
			reletDate: '',
			deductBondMoney: 0,
			makeUpRent: '',
			returnDate: '',
			selectDate: '',
			renewalDay: '',
			touchStartX: 0,
			touchStartY: 0,
			isMove: false,
			hasChangeCar: false,
			carList: [],
			carId:'',
			unitPrice: '',
			violationBondMoney: '',
			bondMoney: '',
			pactList: [],
		};
	},
	onLoad(option) {
		this.getCarInfo(option.id);
		api.getChangeCarList().then(res => {
			if (res.data) {
				let { data } = res;
				data.forEach(car => {
					this.carList.push({
						value: car.id,
						text: car.carNum
					});
				});
			}
		});
	},
	methods: {
		allPact(){
			const itemList = new Array(this?.pactList?.length).fill('合同');
			uni.showActionSheet({
				itemList,
				success: (res) => {
					this.pact(this.pactList[res?.tapIndex ?? 0]);
				}
			})
		},
		operationCarList(orderId){
			api.operationCarList({orderId}).then(res=>{
				this.pactList = this._.map(res?.data ?? [], 'contract');
			});
		},
		newUrl(url) {
			return togetherUrl(url);
		},
		tomove(e) {
			let delX = e.touches[0].clientX - this.touchStartX;
			let delY = e.touches[0].clientY - this.touchStartY;
			if (Math.abs(delX) > 5 || Math.abs(delY) > 5) {
				this.isMove = true;
				this.touchStartX = 0;
				this.touchStartY = 0;
			}
		},
		tostart(e) {
			this.isMove = false;
			this.touchStartX = e.touches[0].clientX;
			this.touchStartY = e.touches[0].clientY;
		},
		saveImage(url) {
			if (!this.isMove) {
				uni.downloadFile({
					url: this.newUrl(url),
					success: res => {
						let { tempFilePath } = res;
						uni.saveImageToPhotosAlbum({
							filePath: tempFilePath,
							success: () => {
								uni.showModal({
									title: '成功',
									content: '保存成功，可在手机相册中查看',
									showCancel: false
								});
							},
							fail: error => {
								uni.showToast({
									title: error,
									icon: 'error'
								});
							}
						});
					},
					fail: err => {
						uni.showToast({
							title: err,
							icon: 'error'
						});
					}
				});
			}
		},
		getCarValue(e){
			this.carId = this.carList[e]?.text ?? '';
		},
		pact(contract) {
			uni.showActionSheet({
				itemList: ['查看合同', '下载合同'],
				success: res => {
					switch (res.tapIndex) {
						case 0:
							uni.navigateTo({
								url: `/pages/model/my/ContractPreview?id=${contract}`
							});
							break;
						case 1:
							let url = '';
							let suffix = '';
							let method = 'POST';
							if (contract.indexOf('/') === -1) {
								url = `${config.API_URL}/qys/download/${contract}`;
								suffix = `${contract}.PDF`;
							} else {
								let name =contract?.substring(contract?.lastIndexOf('/') + 1);
								url = `${config.IMG_URL}${contract}`;
								suffix = `${name}`;
								method = 'GET';
							}
							let dtask = null;

							dtask = plus.downloader.createDownload(
								url,
								{ filename: '_downloads/' + suffix, method },
								(d, status) => {
									//d为下载的文件对象
									if (status == 200) {
										uni.hideLoading();
										//下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
										let fileSaveUrl = plus.io.convertLocalFileSystemURL(
											d.filename
										);
										plus.runtime.openFile(d.filename); //选择软件打开文件
									} else {
										uni.hideLoading();
										//下载失败
										plus.downloader.clear(); //清除下载任务
									}
								}
							);
							uni.showLoading({
								title: '下载中',
								mask: true
							});
							dtask.setRequestHeader(
								'Authorization',
								'Bearer ' + uni.getStorageSync('tonken')
							);
							dtask.setRequestHeader(
								'Content-Type',
								'application/x-www-form-urlencoded'
							);
							dtask.start();
							break;
					}
				}
			});
		},
		reletCar(type) {
			if (this.makeUpRent * 1 < 0) {
				uni.showModal({
					content: '租金不能为负数',
					showCancel: false
				});
				return;
			}
			if (this.unitPrice * 1 < 0) {
				uni.showModal({
					content: '租金不能为负数',
					showCancel: false
				});
				return;
			}
			if (this.violationBondMoney * 1 < 0) {
				uni.showModal({
					content: '违章保证金不能为负数',
					showCancel: false
				});
				return;
			}
			if (this.bondMoney * 1 < 0) {
				uni.showModal({
					content: '车辆保证金不能为负数',
					showCancel: false
				});
				return;
			}
			if(!this.carId && type === 2){
				uni.showModal({
					content: '请选择需要更换的车辆',
					showCancel: false
				});
				return;
			}
			uni.showModal({
				content: '是否上传纸质合同',
				cancelText: `直接${type === 1 ? '续租' : '换车'}`,
				confirmText: '上传纸质合同',
				success: (e) => {
					if(e.confirm){
						uni.chooseImage({
							count: 1,
							success: (res) => {
								uni.showLoading({
									mask: true,
									title: '合同上传中'
								});
								res.tempFiles.forEach(file => {
									uni.uploadFile({
										url: `${config.API_URL}/tool/oss/upload`,
										filePath: file.path,
										name: 'file',
										header: {
											Authorization: 'Bearer ' + uni.getStorageSync('tonken')
										},
										success: (res) => {
											uni.hideLoading();
											let result = JSON.parse(res.data);
											this.carOperation(result.data, type)
										},
									});
								});
							}
						});
					} else {
						this.carOperation('', type);
					}
					
				},
			})
			
		},
		carOperation(contract, type){
			let params;
			let currentCar = this._.find(this.carList, o => {
				return o.text === this.carId;
			});
			type === 1 ? params = {
				days: this.renewalDay,
				money: this.makeUpRent ?? 0,
				carId: this.carInfo.id,
			} : params = {
				unitPrice: this.unitPrice,
				violationBondMoney: this.violationBondMoney,
				bondMoney: this.bondMoney,
				carId: currentCar.value,
			}
			api.reletCar({
				orderId: this.carInfo.wxOrder.orderId,
				contract,
				type,
				status: false,
				...params,
			}).then(res => {
				if (res.data) {
					uni.showModal({
						content: '续租成功',
						showCancel: false,
						success: () => {
							uni.navigateBack();
						}
					});
				} else {
					uni.showModal({
						title: '提示',
						content: res.msg,
						success: e => {
							if (e.confirm) {
								api.reletCar({
									orderId: this.carInfo.wxOrder.orderId,
									contract,
									type,
									status: true,
									...params,
								}).then(result => {
									uni.showModal({
										content: '续租成功',
										showCancel: false,
										success: () => {
											uni.navigateBack();
										}
									});
								});
							}
						}
					});
				}
			});
		},
		changeDate(e) {
			let selectDate = this.dayjs(e);
			let returnDate = this.dayjs(this.carInfo.estimateReturnTime);
			if (selectDate.isBefore(returnDate)) {
				uni.showModal({
					content: '请选择正确的续租时间',
					showCancel: false
				});
				return;
			}
			this.selectDate = selectDate;
			this.returnDate = returnDate;
		},
		change(e) {
			this.current = e.detail.current;
		},
		getCarInfo(id) {
			api.returnCarInfo(id).then((res = {}) => {
				if (res.data) {
					let tmp = [];
					let { data } = res;
					data?.carPhotos?.split(',').forEach(o => {
						tmp.push(`${config.IMG_URL}${o}`);
					});
					delete data.carPhotos;
					this.carInfo = {
						carPhotos: tmp,
						...data
					};
					this.driverUser = data.driverUser || {};
					this.operationCarList(data.wxOrder.orderId);
				}
			});
		},
		normalReturnCar() {
			if (this.deductBondMoney * 1 > this.carInfo?.wxOrder?.bondMoney * 1) {
				uni.showModal({
					title: '提示',
					content: '扣除的租车保证金已超过已缴纳的租车保证金，请确认后重新输入',
					showCancel: false
				});
				return;
			} else {
				uni.showModal({
					title: '提示',
					content: `请退${this.carInfo?.wxOrder?.bondMoney * 1 -
						this.deductBondMoney * 1}元的租车保证金`,
					success: e => {
						if (e.confirm) {
							api.updateCarStatus({
								id: this.carInfo.id,
								deductBondMoney: this.deductBondMoney,
								status: 0
							}).then((res = {}) => {
								uni.showToast({
									title: '还车成功',
									icon: 'success',
									success: () => {
										uni.switchTab({
											url: '/pages/model/car/Car',
											success: () => {
												uni.$emit('returnCar');
												uni.$emit('car');
											}
										});
									}
								});
							});
						}
					}
				});
			}
		},
		abnormalReturnCar() {
			uni.navigateTo({
				url: `/pages/model/returnCar/AbnormalReturnCar?id=${this.carInfo.id}&idcard=${
					this.carInfo.driverUser?.idcard
				}&phoneNumber=${this.carInfo.driverUser?.phoneNumber}&name=${
					this.carInfo.driverUser?.name
				}&bondMoney=${this.carInfo.wxOrder?.bondMoney}&money=${this.deductBondMoney}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.swiper_box {
	width: 100%;
	height: 300rpx;
	margin-bottom: 10px;
}

.swiper_img {
	width: 100%;
	height: 300rpx;
}

.info_box {
	width: 90%;
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: #ffffff;
	border-radius: 10px;
	margin-bottom: 10px;
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
	font-weight: bold;
	height: 42rpx;
}
.line {
	width: 100%;
	height: 1px;
	background-color: #eee;
	margin: 5px 0px;
}
.btn_box {
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-top: 50rpx;
}

.btn {
	width: 90%;
	margin-top: 20px;
}
.reletDate {
	margin-top: 20rpx;
}
.margin_box {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.photo_box {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
</style>
