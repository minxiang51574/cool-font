import { BaseService, Permission, Service } from "/@/core";

@Service("conf/weChat")
class ConfWeChat extends BaseService {
	@Permission("createMpMenu")
	createMpMenu(data: any) {
		return this.request({
			url: "/createMpMenu",
			method: "POST",
			data
		});
	}

	@Permission("findMpMenu")
	findMpMenu() {
		return this.request({
			url: "/findMpMenu"
		});
	}

	@Permission("clearMpMenu")
	clearMpMenu() {
		return this.request({
			url: "/clearMpMenu"
		});
	}
}

export default ConfWeChat;
