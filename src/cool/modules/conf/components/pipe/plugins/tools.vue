<template>
	<conf-plugin name="tools" label="组件库" left="20px" top="20px" max-height="600px">
		<div class="plugin-tools" @contextmenu.stop.prevent="openCM">
			<draggable
				v-model="list"
				:group="{
					name: 'app',
					pull: 'clone',
					put: false
				}"
				:animation="300"
				tag="el-row"
				item-key="id"
				:clone="onClone"
				:gutter="10"
			>
				<template #item="{ element }">
					<el-col :span="12" :key="element.id" :data-id="element.id">
						<div class="item" @contextmenu.stop.prevent="openCM($event, element)">
							<div class="icon">
								<el-image :src="element.icon" fit="fit">
									<template #error>
										<div class="error-image">
											{{ element.name }}
										</div>
									</template>
								</el-image>
							</div>
							<p>{{ element.name }}</p>
						</div>
					</el-col>
				</template>
			</draggable>
		</div>

		<!-- 组件编辑表单 -->
		<cl-form :ref="setRefs('form')">
			<template #slot-code="{ scope }">
				<cl-codemirror v-model="scope.code" height="400px">
					<template #tools>
						<cl-upload-space style="margin-left: 10px" />
					</template>
				</cl-codemirror>
			</template>
		</cl-form>
	</conf-plugin>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { v4 as uuidV4 } from "uuid";
import { ElMessage, ElMessageBox } from "element-plus";
import { ContextMenu } from "cl-admin-crud-vue3";
import { ContextMenuOptions } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import _ from "lodash";
import Draggable from "vuedraggable/src/vuedraggable";

export default defineComponent({
	components: {
		Draggable
	},

	setup() {
		const { setRefs, refs, service } = useCool();

		const active = ref<string>("1");

		// 工具列表
		const list = ref<any[]>([
			{
				name: "文本",
				code: JSON.stringify({
					value: "111",
					innerStyle: {
						fontSize: "50rpx"
					},
					dataset: [
						{
							label: "标题",
							prop: "value",
							component: {
								name: "el-input"
							}
						},
						{
							label: "大小",
							prop: "innerStyle-fontSize",
							component: {
								name: "el-input"
							}
						}
					]
				})
			},
			{
				name: "图片",
				code: JSON.stringify({
					name: "image",
					value:
						"https://img0.baidu.com/it/u=142521704,3862130419&fm=26&fmt=auto&gp=0.jpg",
					innerStyle: {
						height: "300rpx",
						width: "100%"
					},
					dataset: [
						{
							label: "背景图片",
							prop: "value",
							component: {
								name: "cl-upload"
							}
						}
					]
				})
			}
		]);

		// 克隆
		function onClone(d: any) {
			let code = {};

			try {
				code = JSON.parse(d.code);
			} catch (e) {}

			return _.cloneDeep({
				...code,
				id: uuidV4()
			});
		}

		// 获取组件列表
		function refresh() {
			service.conf.component.list().then((res: any) => {
				list.value = res;
			});
		}

		// 组件编辑
		function edit(data?: any) {
			refs.value["form"].open({
				width: "1000px",
				items: [
					{
						label: "名称",
						prop: "name",
						component: {
							name: "el-input",
							props: {
								placeholder: "请填写名称"
							}
						},
						rules: {
							required: true,
							message: "名称不能为空"
						}
					},
					{
						label: "预览图",
						prop: "icon",
						component: {
							name: "cl-upload",
							props: {
								text: "",
								size: [100, 140]
							}
						}
					},
					{
						lael: "代码",
						prop: "code",
						component: {
							name: "slot-code"
						}
					}
				],
				form: {
					...data
				},
				on: {
					submit(data: any, { close, done }: any) {
						try {
							const code = JSON.parse(data.code);

							if (code) {
								service.conf.component[data.id ? "update" : "add"](data)
									.then(() => {
										ElMessage.success("保存成功");
										close();
										refresh();
									})
									.catch((err: string) => {
										console.log(err);
										ElMessage.error(err);
										done();
									});
							}
						} catch (e) {
							console.error(e);
							ElMessage.error("代码格式错误");
							done();
						}
					}
				}
			});
		}

		// 右键菜单
		function openCM(e: any, data?: any) {
			const options: ContextMenuOptions = {
				list: [
					{
						label: "新增组件",
						hidden: data,
						callback(_: any, done: Function) {
							edit();
							done();
						}
					},
					{
						label: "编辑",
						hidden: !data,
						callback(_: any, done: Function) {
							edit(data);
							done();
						}
					},
					{
						label: "删除",
						hidden: !data,
						callback(_: any, done: Function) {
							ElMessageBox.confirm("你确定要删除该组件吗？", "提示", {
								type: "warning"
							})
								.then((action) => {
									if (action == "confirm") {
										service.conf.component
											.delete({
												ids: [data.id]
											})
											.then(() => {
												refresh();
												ElMessage.success("删除成功");
											})
											.catch((err: string) => {
												ElMessage.error(err);
											});
									}
								})
								.catch(() => null);
							done();
						}
					}
				]
			};

			ContextMenu.open(e, options);
		}

		onMounted(() => {
			refresh();
		});

		return {
			setRefs,
			refs,
			refresh,
			openCM,
			edit,
			onClone,
			list,
			active
		};
	}
});
</script>

<style lang="scss" scoped>
.plugin-tools {
	background-color: #fff;
	padding: 10px;
	box-sizing: border-box;
	width: 350px;

	.item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 5px;
		padding: 10px;
		box-sizing: border-box;
		border: 1px dashed #fff;
		margin-bottom: 10px;

		.icon {
			height: 100px;
			width: 100%;
			margin-bottom: 10px;
			border-radius: 5px;

			.el-image {
				height: 100%;
				width: 100%;
			}
		}

		p {
			font-size: 12px;
		}

		.error-image {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 100%;
			font-size: 15px;
			background-color: #f5f7fa;
		}

		&:hover {
			border-color: #ddd;
		}
	}
}
</style>
