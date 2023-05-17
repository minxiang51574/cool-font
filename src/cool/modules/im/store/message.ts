import { isArray, deepMerge } from "/@/core/utils";
import { v4 as uuidv4 } from "uuid";

const state = {
	list: []
};

const getters = {
	messageList: (state: any) => state.list
};

const actions = {};

const mutations = {
	// 设置列表
	SET_MESSAGE_LIST(state: any, data: any[]) {
		state.list = data;
	},

	// 追加数据
	APPEND_MESSAGE_LIST(state: any, data: any) {
		if (!data.id) {
			data.id = uuidv4();
		}
		state.list.push(data);
	},

	// 追加数据到头部
	PREPEND_MESSAGE_LIST(state: any, data: any) {
		const list = isArray(data) ? data : [data];
		state.list.unshift(...list.reverse());
	},

	// 清空列表
	CLEAR_MESSAGE_LIST(state: any) {
		state.list = [];
	},

	// 更新消息数据
	UPDATE_MESSAGE(state: any, { id, file, data, callback }: any) {
		let item = null;

		if (file) {
			item = state.list.find((e: any) => e.uid === file.uid);
		}

		if (id) {
			item = state.list.find((e: any) => e.id === id);
		}

		if (item) {
			if (data) {
				deepMerge(item, data);
			}

			if (callback) callback(item);
		}
	},

	// 暂停录音播放
	STOP_MESSAGE_VOICE(state: any) {
		state.list.map((e: any) => {
			if (e.contentType == 3) {
				e.isPlay = false;
			}
		});
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
