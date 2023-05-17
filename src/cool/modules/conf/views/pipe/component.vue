<template>
	<div class="view-conf-component">
		<!-- 头部 -->
		<div class="header">
			<el-button size="mini" @click="back" icon="el-icon-back">返回</el-button>
			<span class="name" v-if="info">{{ info.name }}（{{ info.path }}）</span>

			<div class="flex1"></div>

			<el-button size="mini" @click="reset">重置</el-button>
			<el-button size="mini" type="primary" @click="save">保存</el-button>
		</div>

		<!-- 内容 -->
		<div class="container">
			<div class="view">
				<p class="tips">
					<i class="el-icon-warning-outline"></i>
					预览有偏差，请以真机为主
				</p>

				<div class="show">
					<div class="box">
						<draggable
							v-model="list"
							:group="{ name: 'app' }"
							:animation="300"
							tag="ul"
							item-key="id"
						>
							<template #item="{ element, index }">
								<li
									:key="element.id"
									:data-id="element.id"
									@click="edit(element, index)"
									@contextmenu.stop.prevent="openCM($event, element, index)"
								>
									<conf-pipe :data="element" />
								</li>
							</template>
						</draggable>
					</div>
				</div>
			</div>

			<!-- 工具插件 -->
			<plugin-tools />

			<!-- 参数配置插件 -->
			<plugin-dataset :ref="setRefs('plugin-dataset')" />

			<!-- 代码编辑 -->
			<cl-form :ref="setRefs('code-form')">
				<template #slot-code="{ scope }">
					<cl-codemirror v-model="scope.code" height="400px">
						<template #tools>
							<cl-upload-space style="margin-left: 10px" />
						</template>
					</cl-codemirror>
				</template>
			</cl-form>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref } from "vue";
import Draggable from "vuedraggable/src/vuedraggable";
import { useCool } from "/@/core";
import { ElMessage, ElMessageBox } from "element-plus";
import { ContextMenu } from "cl-admin-crud-vue3";
import { ContextMenuOptions } from "cl-admin-crud-vue3/types";
import PluginTools from "/$/conf/components/pipe/plugins/tools.vue";
import PluginDataset from "/$/conf/components/pipe/plugins/dataset.vue";

export default defineComponent({
	cool: {
		route: {
			path: "/conf/component"
		}
	},

	components: {
		Draggable,
		PluginTools,
		PluginDataset
	},

	setup() {
		// 公共
		const { setRefs, refs, router, service, route } = useCool();

		// 列表
		const list = ref<any[]>([]);

		// 详情
		const info = ref<any>(null);

		// 共享
		provide("list", list);

		function edit(item: any, index: number) {
			refs.value["plugin-dataset"].edit(item, index);
		}

		// 重置
		function reset() {
			list.value = [];
		}

		// 保存
		function save() {
			service.conf.page
				.update({
					...info.value,
					code: JSON.stringify(list.value)
				})
				.then(() => {
					ElMessage.success("保存成功");
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}

		// 返回
		function back() {
			router.back();
		}

		// 右键
		function openCM(e: any, item: any, index: number) {
			const options: ContextMenuOptions = {
				list: [
					{
						label: "编辑",
						callback(_: any, done: Function) {
							refs.value["code-form"].open({
								dialog: {
									width: "1000px"
								},
								items: [
									{
										props: {
											"label-width": "0"
										},
										lael: "代码",
										prop: "code",
										value: JSON.stringify(item),
										component: {
											name: "slot-code"
										}
									}
								],
								on: {
									submit: (data: any, { close, done }: any) => {
										try {
											list.value[index] = JSON.parse(data.code);
											close();
										} catch (e) {
											ElMessage.error("代码格式错误");
											done();
										}
									}
								}
							});
							done();
						}
					},
					{
						label: "删除",
						callback(_: any, done: Function) {
							ElMessageBox.confirm("你确定要删除该组件吗？", "提示", {
								type: "warning"
							})
								.then((action) => {
									if (action == "confirm") {
										list.value.splice(index, 1);
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
			// 获取详情
			service.conf.page
				.info({
					id: route.query.id
				})
				.then((res: any) => {
					info.value = res;

					if (res.code) {
						list.value = JSON.parse(res.code);
					}
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		});

		return {
			setRefs,
			refs,
			list,
			info,
			edit,
			reset,
			save,
			back,
			openCM
		};
	}
});
</script>

<style lang="scss">
.view-conf-component {
	position: relative;

	li {
		list-style: none;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin-bottom: 10px;
		padding: 10px;

		.flex1 {
			flex: 1;
		}

		.name {
			font-size: 12px;
			margin-left: 20px;
		}
	}

	.container {
		display: flex;
		align-items: center;
		height: calc(100% - 60px);
		background-color: #f1f1f1;
		position: relative;

		.view {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;
			position: relative;

			.tips {
				font-size: 12px;
				margin-bottom: 5px;
				color: red;
			}

			.show {
				height: 667px;
				width: 375px;
				position: relative;

				.box {
					background-color: #fff;
					height: 1334px;
					width: 750px;
					transform: scale(0.5);
					border-radius: 6px;
					position: absolute;
					left: -50%;
					top: -50%;
					overflow: hidden auto;

					& > ul {
						min-height: 100%;

						& > li {
							cursor: pointer;
							border: 1px solid #eee;
						}
					}
				}
			}
		}
	}
}
</style>
