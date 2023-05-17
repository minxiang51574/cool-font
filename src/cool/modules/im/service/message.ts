import { BaseService, Service, Permission } from "/@/core";

@Service({
	namespace: "im/message",
	mock: false
})
class ImMessage extends BaseService {
	@Permission("read")
	read(data: any) {
		return this.request({
			url: "/read",
			method: "POST",
			data
		});
	}

	@Permission("readAll")
	readAll(data: any) {
		return this.request({
			url: "/readAll",
			method: "POST",
			data
		});
	}
}

export default ImMessage;
