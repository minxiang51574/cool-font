import { BaseService, Permission, Service } from "/@/core";

@Service("market/activity/goods")
class ActivityGoods extends BaseService {
	@Permission("selectGoods")
	selectGoods(data: any) {
		return this.request({
			url: "/selectGoods",
			method: "POST",
			data
		});
	}
}

export default ActivityGoods;
