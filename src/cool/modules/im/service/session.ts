import { BaseService, Service, Permission } from "/@/core";

@Service({
	namespace: "im/session",
	mock: false
})
class ImSession extends BaseService {
	@Permission("unreadCount")
	unreadCount() {
		return this.request({
			url: "/unreadCount"
		});
	}
}

export default ImSession;
