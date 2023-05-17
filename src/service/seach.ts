import { BaseService, Permission, Service } from "/@/core";

@Service("seach")
class HomeSeach extends BaseService {
	/**
	 * 模板下载占比
	 * @returns
	 */
	@Permission("seachAll")
	seachAll() {
		return this.request({
			url: "/seachAll"
			// params: {
			// 	...params
			// }
		});
	}
}

export default HomeSeach;
