<template>
	<div class="cl-chat__wrap">
		<!-- 聊天窗口 -->
		<cl-dialog
			v-model="visible"
			:title="title"
			:height="height"
			:width="width"
			:props="{
				modal: true,
				customClass: 'cl-chat__dialog',
				'append-to-body': true,
				'close-on-click-modal': false
			}"
			:controls="['slot-session', 'cl-flex1', 'fullscreen', 'close']"
		>
			<div class="cl-chat">
				<!-- 会话列表 -->
				<chat-session />

				<!-- 会话详情 -->
				<div class="cl-chat__detail">
					<template v-if="session">
						<!-- 消息列表 -->
						<chat-message />

						<!-- 输入框 -->
						<chat-input />
					</template>
				</div>
			</div>

			<template #slot-session>
				<button v-if="session">
					<i v-if="sessionVisible" class="el-icon-notebook-2" @click="closeSession()"></i>
					<i v-else class="el-icon-arrow-left" @click="openSession()"></i>
				</button>
			</template>
		</cl-dialog>

		<!-- MP3 -->
		<div class="mp3">
			<audio :ref="setRefs('sound')" :src="NotifyMp3" controls style="display: none"></audio>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, h, onUnmounted, provide, ref } from "vue";
import { ElNotification } from "element-plus";
import dayjs from "dayjs";
import _ from "lodash";
import io from "socket.io-client";
import { socketUrl } from "/@/config/env";
import Session from "./session.vue";
import Message from "./message.vue";
import Input from "./input.vue";
import { parseContent } from "../utils";
import { useCool } from "/@/core";
import NotifyMp3 from "../static/notify.mp3";
import { isString } from "/@/core/utils";

export default defineComponent({
	name: "cl-chat",

	components: {
		"chat-session": Session,
		"chat-message": Message,
		"chat-input": Input
	},

	props: {
		height: {
			type: String,
			default: "650px"
		},
		width: {
			type: String,
			default: "1000px"
		}
	},

	emits: ["message"],

	setup() {
		const { store, mitt, refs, setRefs, service } = useCool();

		// 当前会话
		const session = computed(() => store.getters.session);

		// 会话列表是否可见
		const sessionVisible = computed(() => store.getters.sessionVisible);

		// 消息类型
		const modes = ["text", "image", "emoji", "voice", "video", "goods"];

		// 是否可见
		const visible = ref<boolean>(false);

		// socket 实例
		let socket: any = null;

		// 对话框标题
		const title = computed(() => {
			return session.value ? `与 ${session.value.nickname} 聊天中` : "聊天对话框";
		});

		// 打开
		function open() {
			visible.value = true;
		}

		// 关闭
		function close() {
			visible.value = false;
		}

		// 打开会话列表
		function openSession() {
			store.commit("OPEN_SESSION");
		}

		// 关闭会话列表
		function closeSession() {
			store.commit("CLOSE_SESSION");
		}

		// 消息通知
		function notification(msg: any) {
			const text = parseContent(msg);

			// 页面消息提示
			ElNotification({
				title: "提示",
				message: h("span", text),
				onClick: () => {
					open();
				}
			});

			// 浏览器消息通知
			const NotificationInstance = Notification || window.Notification;
			if (NotificationInstance) {
				if (NotificationInstance.permission !== "denied") {
					NotificationInstance.requestPermission(() => {
						const n = new Notification("COOL-ADMIN", {
							body: text,
							icon: "/favicon.ico"
						});

						setTimeout(() => {
							n.close();
						}, 2000);
					});
				}
			}
		}

		// 监听消息
		function onMessage(msg: any) {
			const { contentType, objectType, content, msgId, isUpdate, room } = msg;

			// 过滤自己的消息
			if (objectType != 0) {
				return false;
			}

			// 播放音乐
			if (refs.value.sound) {
				refs.value.sound.play();
			}

			if (!visible.value) {
				// 消息通知
				return notification(msg);
			}

			// 是否当前会话
			const same = session.value && session.value.room == room;

			// 是否存在该会话
			const item = store.getters.sessionList.find((e: any) => e.room == room);

			// 是否直接刷新列表
			if (isUpdate) {
				return mitt.emit("message.refresh");
			}

			if (item) {
				if (same) {
					// 更新消息
					store.commit("UPDATE_SESSION", {
						contentType,
						content
					});

					// 追加消息
					store.commit("APPEND_MESSAGE_LIST", msg);

					// 滚动到底
					mitt.emit("message.scrollToBottom");

					// 阅读消息
					service.im.message.read({
						ids: [msgId],
						session: session.value.id
					});
				} else {
					// 更新消息条数
					store.commit("UPDATE_SESSION_ITEM", {
						id: item.id,
						serviceUnreadCount: item.serviceUnreadCount + 1
					});
				}

				// 更新会话消息
				store.commit("UPDATE_SESSION_ITEM", {
					id: item.id,
					updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
					contentType,
					content
				});
			} else {
				// 刷新会话列表
				mitt.emit("session.refresh");
			}
		}

		// 追加消息
		function append(data: any) {
			store.commit("APPEND_MESSAGE_LIST", data);
			mitt.emit("message.scrollToBottom");
		}

		// 发送消息
		function send(data: any, isAppend?: boolean, isSend = true) {
			const { session, userInfo } = store.getters;

			// 格式化内容
			data.content = JSON.stringify(data.content);
			// 房间
			data.room = session.room;
			// 接收类型, 0: 后台 1: 用户 2:游客
			data.objectType = 1;
			// 消息类型, 0: 单聊 1: 群聊
			data.type = 0;
			// 会话id
			data.sessionId = session.id;
			// 创建者id
			data.userId = userInfo.id;

			delete data.id;

			// 更新消息
			store.commit("UPDATE_SESSION", data);

			if (isSend && socket) {
				socket.emit("message", data);
			}

			if (isAppend) {
				append(data);
			}
		}

		// 加载 socket
		(function () {
			// @ts-ignore
			socket = io(`${socketUrl}?isAdmin=true&token=${store.getters.token}`);
			socket.on("connect", () => {
				console.log("socket connect");
			});
			socket.on("message", (msg: any) => {
				try {
					const { action, data } = isString(msg) ? JSON.parse(msg) : msg;

					if (action) {
						// 绑定微信
						if (action == 2) {
							mitt.emit("bind-wx", data);
						}
					} else {
						onMessage(msg);
					}
				} catch (e) {
					onMessage(msg);
				}
			});
			socket.on("error", (err: any) => {
				console.log(err);
			});
			socket.on("disconnect", (err: string) => {
				console.error("socket disconnect ", err);
			});
		})();

		// 共享参数
		provide("chat", {
			modes,
			socket,
			append,
			send
		});

		// 销毁
		onUnmounted(function () {
			if (socket) {
				socket.close();
			}
		});

		return {
			NotifyMp3,
			refs,
			session,
			sessionVisible,
			visible,
			title,
			setRefs,
			open,
			close,
			openSession,
			closeSession,
			onMessage,
			send
		};
	}
});
</script>

<style lang="scss">
.cl-chat__dialog {
	.el-dialog__body {
		padding: 0 !important;
	}
}

.cl-chat {
	display: flex;
	height: 100%;
	background-color: #f7f7f7;
	padding: 5px;
	box-sizing: border-box;

	&__detail {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
	}
}
</style>
