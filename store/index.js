import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/index.js';
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		socketTask: null
	},
	mutations: {
		WEBSOCKET_INIT(state, id) {
			state.socketTask = uni.connectSocket({
				url: `wss://xd.qiantur.com/socket/websocket/${id}`,
				// url: `ws://192.168.0.45:8080/websocket/${id}`,
				success() {
					console.log('websocket连接成功');
				},
			})
			state.socketTask.onOpen((res) => {
				console.log('WebSocket连接正常打开中...！')
				// 注：只有连接正常打开中 ，才能正常收到消息
				state.socketTask.onMessage((res = {}) => {
					let {
						type,
						message,
						orderId,
						handleId,
					} = res.data || {};
					switch (type) {
						case 'NEWORDER': // 新的订单-确认
							uni.showModal({
								title: message,
								success: (e) => {
									if (e.confirm) {
										uni.redirectTo({
											url: `/pages/model/my/OrderDetail?id=${orderId}&type=1`
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
										uni.redirectTo({
											url: `/pages/model/my/OrderDetail?id=${orderId}&type=2`
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
			})
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
