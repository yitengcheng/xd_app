import user from './modules/user.js'
import regionalManage from './modules/regionalManage.js'
import car from './modules/car.js'
import gps from './modules/gps.js'
import tool from './modules/tool.js'
import order from './modules/order.js'
import handle from './modules/handle.js'
import pay from './modules/pay.js'
import qys from './modules/qys.js'
import product from './modules/product.js'
import customer from './modules/customer.js'
const api = {
	...user,
	...regionalManage,
	...car,
	...gps,
	...tool,
	...order,
	...handle,
	...pay,
	...qys,
	...product,
	...customer,
}
export default api