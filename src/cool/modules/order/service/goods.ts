import { BaseService, Service, Permission } from "/@/core";

@Service("order/goods")
class orderGoods extends BaseService {
	@Permission("agreeRefund")
	agreeRefund(data: any) {
		return this.request({
			url: "/agreeRefund",
			method: "POST",
			data
		});
	}
	@Permission("rejectRefund")
	rejectRefund(data: any) {
		return this.request({
			url: "/rejectRefund",
			method: "POST",
			data
		});
	}
}

export default orderGoods;
