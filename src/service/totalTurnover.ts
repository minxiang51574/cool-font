import { BaseService, Permission, Service } from "/@/core";

@Service("totalTurnover")
class TotalTurnover extends BaseService {
	/**
	 * 获得总营业额
	 * @returns
	 */
	@Permission("getVipToral")
	getVipToral() {
		return this.request({
			url: "/getVipToral"
			// params: {
			// 	...params
			// }
		});
	}
	/**
	 * 获得周同比
	 * @returns
	 */
	@Permission("getWeekMoney")
	getWeekMoney() {
		return this.request({
			url: "/getWeekMoney"
			// params: {
			// 	...params
			// }
		});
	}
	/**
	 * 获得日同比
	 * @returns
	 */
	@Permission("getDayMoney")
	getDayMoney() {
		return this.request({
			url: "/getDayMoney"
			// params: {
			// 	...params
			// }
		});
	}
	/**
	 * 订单走势
	 * @param params
	 * @returns
	 */
	@Permission("orderChart")
	orderChart(params: any) {
		return this.request({
			url: "/orderChart",
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
	 * 订单月走势
	 * @param params
	 * @returns
	 */
	@Permission("orderMonthChart")
	orderMonthChart(params: any) {
		return this.request({
			url: "/orderMonthChart",
			params: {
				...params
			}
		});
	}
}

export default TotalTurnover;
