import { BaseService, Permission, Service } from "/@/core";

@Service("orderHome")
class OrderHome extends BaseService {
	/**
	 * 获取订单
	 * @param params
	 * @returns
	 */
	@Permission("orderAll")
	orderAll(params: any) {
		return this.request({
			url: "/orderAll",
			params: {
				...params
			}
		});
	}
	/**
	 * 订单走势
	 * @param params
	 * @returns
	 */
	@Permission("orderDayChart")
	orderDayChart(params: any) {
		return this.request({
			url: "/orderDayChart",
			params: {
				...params
			}
		});
	}
	/**
	 * 订单走势
	 * @param params
	 * @returns
	 */
	@Permission("goodsbuyNum")
	goodsbuyNum(params: any) {
		return this.request({
			url: "/goodsbuyNum",
			params: {
				...params
			}
		});
	}
	/**
	 * 订单走势
	 * @param params
	 * @returns
	 */
	@Permission("getType")
	getType(params: any) {
		return this.request({
			url: "/getType",
			params: {
				...params
			}
		});
	}
}

export default OrderHome;
