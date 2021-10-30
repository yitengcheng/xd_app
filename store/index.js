import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/index.js';
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		socketTask: null,
		time: null
	},
	mutations: {
		WEBSOCKET_INIT(state, id) {
			state.time = setInterval(()=> {
				if((state.socketTask || {}).readyState !== 1){
					state.socketTask = uni.connectSocket({
						url: `wss://xd.qiantur.com/socket/websocket/${id}`,
						success() {
							console.log('websocket连接成功');
						},
					});
					state.socketTask.onOpen((res) => {
						console.log('WebSocket连接正常打开中...！')
						// 注：只有连接正常打开中 ，才能正常收到消息
						state.socketTask.onMessage((res = {}) => {
							let data = JSON.parse(res.data);
							console.log(data);
							let {
								type,
								message,
								orderId,
								handleId,
								contractId,
							} = data || {};
							switch (type) {
								case 'NEWORDER': // 新的订单-确认
									uni.showModal({
										title: message,
										success: (e) => {
											if (e.confirm) {
												api.handleRead({
													type,
													handleId
												});
												uni.redirectTo({
													url: `/pages/model/my/OrderDetail?id=${orderId}&type=1&handleId=${handleId}`
												});
											}
										}
									})
									break;
								case 'VIEWORDER': // 新的订单-线下支付
									uni.showModal({
										title: message,
										icon: 'none',
										success: (e) => {
											if (e.confirm) {
												api.handleRead({
													type,
													handleId
												});
												uni.redirectTo({
													url: `/pages/model/my/OrderDetail?id=${orderId}&type=1&handleId=${handleId}`
												});
											}
										}
									});
									break;
								case 'REFUNDED': // 已退款通知
									uni.showModal({
										title: message,
										icon: 'none',
										success: (e) => {
											if (e.confirm) {
												api.handleRead({
													type,
													handleId
												});
											}
										}
									});
									break;
								case 'APPLYREFUNDED': // 申请退款通知
									uni.showModal({
										title: message,
										success: (e) => {
											if (e.confirm) {
												api.handleRead({
													type,
													handleId
												});
												uni.redirectTo({
													url: `/pages/model/my/OrderDetail?id=${orderId}&type=2&handleId=${handleId}`
												});
											}
										}
									})
									break;
								case 'RETURNCAR': // 用户还车通知
									uni.showModal({
										title: message,
										icon: 'none',
										success: (e) => {
											if (e.confirm) {
												api.handleRead({
													type,
													handleId
												});
											}
										}
									});
									break;
								case 'QYSSEAL': // 合同生成成功
									uni.showToast({
										title: '生成合同成功',
										icon: 'none',
										success: (e) => {
											uni.navigateTo({
												url: `/pages/model/InCar/PactQrcode?pactId=${contractId}`
											})
										}
									});
									break;
								case 'QYSPERSONAL': // 用户签署完成
									uni.showToast({
										title: '用户签署完成',
										icon: 'none',
										success: (e) => {
											uni.navigateTo({
												url: `/pages/model/InCar/Finish`
											})
										}
									});
									break;
								case 'EXRETURNCAR': // 用户异常还车通知
									uni.showModal({
										title: message,
										icon: 'none',
										success: (e) => {
											if (e.confirm) {
												api.handleRead({
													type,
													handleId
												});
											}
										}
									});
									break;
							}
						});
					});
				}
				
			}, 5000);
			
		},
		WEBSOCKET_SEND(state, data) {
			state.socketTask.send({
				data,
				async success() {
					console.log('消息发送成功')
				},
			})
		},
		CLOSE_SOCKET(state) {
			clearInterval(state.time);
			if (!state.socketTask) return
			state.socketTask.close({
				success(res) {
					console.log('关闭成功', res)
				},
				fail(err) {
					console.log('关闭失败', err)
				}
			})
		}
	},
	actions: {
		WEBSOCKET_INIT({
			commit
		}, id) {
			commit('WEBSOCKET_INIT', id)
		},
		WEBSOCKET_SEND({
			commit
		}, data) {
			commit('WEBSOCKET_SEND', data)
		},
		CLOSE_SOCKET({
			commit
		}) {
			commit('CLOSE_SOCKET')
		}
	}
})

export default store
