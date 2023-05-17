import { BaseService, Service, Permission } from "/@/core";

@Service("user/wachat")
class UserWachat extends BaseService {
	@Permission("qrcode")
	qrcode() {
		return this.request({
			url: "/qrcode"
		});
	}
}

export default UserWachat;
