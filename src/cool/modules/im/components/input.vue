<template>
	<div class="cl-chat-input">
		<!-- 工具栏 -->
		<div class="cl-chat-input__opbar">
			<ul>
				<!-- 表情 -->
				<li>
					<emoji @select="onEmojiSelect" />
				</li>
				<!-- 图片上传 -->
				<li>
					<upload name="image" accept="image/*" @before-upload="append" @success="send">
						<img src="../static/images/image.png" alt="" />
					</upload>
				</li>
				<!-- 视频上传 -->
				<li>
					<upload name="video" accept="video/*" @before-upload="append" @success="send">
						<img src="../static/images/video.png" alt="" />
					</upload>
				</li>
				<!-- 发送商品 -->
				<li @click="openGoods">
					<img src="../static/images/goods.png" alt="" />
				</li>
			</ul>
		</div>

		<!-- 输入框，发送按钮 -->
		<div class="cl-chat-input__content">
			<el-input
				v-model="text"
				placeholder="请描述您想咨询的问题"
				type="textarea"
				resize="none"
				:rows="5"
				@keyup.enter="onTextSend"
			/>

			<el-button type="primary" size="mini" :disabled="!text" @click="onTextSend"
				>发送</el-button
			>
		</div>

		<!-- 商品选择 -->
		<goods-select :ref="setRefs('goods-select')" @select="onGoodsSelect" />
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, reactive, ref } from "vue";
import Emoji from "./emoji.vue";
import Upload from "./upload.vue";
import { useCool } from "/@/core";
import GoodsSelect from "/$/goods/components/select.vue";

export default defineComponent({
	components: {
		Emoji,
		Upload,
		GoodsSelect
	},

	setup() {
		const { refs, setRefs } = useCool();

		// 聊天
		const chat = inject<any>("chat");

		// 输入值
		const text = ref<string>("");

		// 表情
		const emoji = reactive<any>({
			visible: false
		});

		// 发送消息
		function send(data: any, isAppend?: boolean, isSend?: boolean) {
			chat.send(data, isAppend, isSend);
		}

		// 追加内容
		function append(data: any) {
			send(data, true, false);
		}

		// 发送文本内容
		function onTextSend() {
			if (text.value) {
				if (text.value.replace(/\n/g, "") !== "") {
					const data = {
						contentType: 0,
						content: {
							text: text.value
						}
					};

					send(data, true);

					nextTick(() => {
						text.value = "";
					});
				}
			}
		}

		// 图片选择
		function onImageSelect(res: any) {
			send(
				{
					content: {
						imageUrl: res.data
					},
					contentType: 1
				},
				true
			);
		}

		// 表情选择
		function onEmojiSelect(url: string) {
			emoji.visible = false;
			send(
				{
					content: {
						imageUrl: url
					},
					contentType: 2
				},
				true
			);
		}

		// 视频选择
		function onVideoSelect(url: string) {
			send(
				{
					content: {
						videoUrl: url
					},
					contentType: 4
				},
				true
			);
		}

		// 商品选择
		function openGoods() {
			refs.value["goods-select"].open();
		}

		// 商品选择回掉
		function onGoodsSelect(...selection: any[]) {
			selection.forEach((e: any) => {
				const data = {
					content: e,
					contentType: 5
				};

				send(data, true);
			});
		}

		return {
			refs,
			setRefs,
			text,
			emoji,
			onTextSend,
			onImageSelect,
			onEmojiSelect,
			onVideoSelect,
			send,
			append,
			openGoods,
			onGoodsSelect
		};
	}
});
</script>
<style lang="scss">
.cl-chat-input {
	background-color: #fff;
	padding: 10px;
	border-radius: 3px;

	&__opbar {
		margin-bottom: 5px;

		ul {
			display: flex;

			li {
				list-style: none;
				margin-right: 10px;
				cursor: pointer;

				&:hover {
					opacity: 0.7;
				}

				img {
					height: 26px;
					width: 26px;
				}
			}
		}
	}

	&__content {
		position: relative;

		.el-button {
			position: absolute;
			right: 15px;
			bottom: 10px;
		}
	}
}
</style>
