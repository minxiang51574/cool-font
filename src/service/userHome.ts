import { BaseService, Permission, Service } from "/@/core";

@Service("userHome")
class UserHome extends BaseService {
	/**
	 * 用户走势
	 * @param params
	 * @returns
	 */
	@Permission("userChart")
	userChart(params: any) {
		return this.request({
			url: "/userChart",
			params: {
				...params
			}
		});
	}
	/**
	 * 用户总数量
	 * @param params
	 * @returns
	 */
	@Permission("userTotal")
	userTotal() {
		return this.request({
			url: "/userTotal"
			// params: {
			// 	...params
			// }
		});
	}
}

export default UserHome;
