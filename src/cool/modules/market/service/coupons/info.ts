import { BaseService, Service, Permission } from "/@/core";

@Service("market/coupons/info")
class MarketCouponsInfo extends BaseService {
	@Permission("getRecord")
	getRecord(params: any) {
		return this.request({
			url: "/getRecord",
			params: {
				...params
			}
		});
	}
	@Permission("sendIds")
	sendIds(data: any) {
		return this.request({
			url: "/sendIds",
			method: "POST",
			data
		});
	}
}

export default MarketCouponsInfo;
