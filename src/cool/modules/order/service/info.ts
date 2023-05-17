import { BaseService, Service, Permission } from "/@/core";

@Service("order/info")
class orderInfo extends BaseService {
	@Permission("logistics")
	logistics(params: any) {
		return this.request({
			url: "/logistics",
			params: {
				...params
			}
		});
	}

	@Permission("orderAll")
	orderAll(params: any) {
		return this.request({
			url: "/orderAll",
			params: {
				...params
			}
		});
	}

	@Permission("deliver")
	deliver(data: any) {
		return this.request({
			url: "/deliver",
			method: "POST",
			data
		});
	}
}

export default orderInfo;
