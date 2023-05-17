<template>
	<cl-crud :ref="setRefs('crud')" @load="onLoad">
		<el-row type="flex" align="middle">
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table :ref="setRefs('table')" v-bind="table">
				<template #slot-op-btn="{ scope }">
					<el-button type="text" size="mini" @click="toEdit(scope.row)"
						>页面配置</el-button
					>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</el-row>

		<cl-upsert v-bind="upsert" />
	</cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Table, Upsert } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";

export default defineComponent({
	setup() {
		// 功能
		const { refs, setRefs, service, router } = useCool();

		// 新增、编辑
		const upsert = reactive<Upsert>({
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
					label: "页面路径",
					prop: "path",
					component: {
						name: "el-input",
						props: {
							placeholder: "匹配 uniapp 上的页面路径"
						}
					}
				},
				{
					label: "状态",
					prop: "status",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "开启",
								value: 1
							},
							{
								label: "关闭",
								value: 0
							}
						]
					}
				}
			]
		});

		// 表格配置
		const table = reactive<Table>({
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					label: "名称",
					prop: "name"
				},
				{
					label: "页面路径",
					prop: "path"
				},
				{
					label: "状态",
					prop: "status",
					dict: [
						{
							label: "开启",
							value: 1,
							type: "success"
						},
						{
							label: "关闭",
							value: 0,
							type: "danger"
						}
					]
				},
				{
					type: "op",
					buttons: ["edit", "delete", "slot-op-btn"]
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			// 绑定 service
			ctx.service(service.conf.page).done();
			app.refresh();
		}

		// 编辑
		function toEdit(item: any) {
			router.push({
				path: "/conf/component",
				query: {
					id: item.id
				}
			});
		}

		return {
			refs,
			setRefs,
			table,
			upsert,
			onLoad,
			toEdit
		};
	}
});
</script>
