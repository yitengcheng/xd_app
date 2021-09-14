import user from './modules/user.js'
import regionalManage from './modules/regionalManage.js'
import car from './modules/car.js'
import gps from './modules/gps.js'
import tool from './modules/tool.js'
const api = {
	...user,
	...regionalManage,
	...car,
	...gps,
	...tool,
}
export default api