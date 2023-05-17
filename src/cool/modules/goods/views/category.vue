<template>
	<cl-crud :ref="setRefs('crud')" @load="onLoad" :on-refresh="onRefresh">
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
			<cl-table :ref="setRefs('table')" v-bind="table" @row-click="onRowClick">
				<!-- 行新增 -->
				<template #slot-add="{ scope }">
					<el-button type="text" size="mini" @click="upsertAppend(scope.row.id)"
						>新增</el-button
					>
				</template>

				<!-- 封面图片 -->
				<template #column-pic="{ scope }">
					<cl-image
						:size="50"
						fit="contain"
						:lazy="false"
						:src="scope.row.pic"
						v-if="scope.row.pic"
					/>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
		</el-row>

		<!-- 新增、编辑 -->
		<cl-upsert :ref="setRefs('upsert')" v-bind="upsert" />
	</cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Upsert, Table } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import { deepTree } from "/@/core/utils";

export default defineComponent({
	name: "goods-category",

	setup() {
		const { refs, setRefs, service } = useCool();

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: [
				{
					prop: "name",
					label: "分类名称",
					component: {
						name: "el-input",
						props: {
							placeholder: "请输入分类名称",
							autofocus: true
						}
					},
					rules: {
						required: true,
						message: "名称不能为空"
					}
				},
				{
					prop: "parentId",
					label: "上级分类",
					component: {
						name: "category-select"
					}
				},
				{
					prop: "sortNum",
					label: "排序等级",
					value: 0,
					component: {
						name: "el-input-number"
					}
				},
				{
					prop: "pic",
					label: "封面图片",
					component: {
						name: "cl-upload",
						props: {
							text: "选择图片"
						}
					}
				}
			]
		});

		// 表格配置
		const table = reactive<Table>({
			props: {
				"row-key": "id"
			},
			"context-menu": [
				"refresh",
				(row: any) => {
					return {
						label: "新增",
						callback: (_: any, done: Function) => {
							upsertAppend(row.id);
							done();
						}
					};
				},
				"edit",
				"delete"
			],
			columns: [
				{
					prop: "name",
					label: "分类名称",
					align: "left"
				},
				{
					prop: "pic",
					label: "封面图片",
					width: 200
				},
				{
					prop: "sortNum",
					label: "排序等级",
					align: "center",
					width: 80
				},
				{
					label: "操作",
					type: "op",
					buttons: ["slot-add", "edit", "delete"]
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.goods.category).done();
			app.refresh();
		}

		// 行点击展开
		function onRowClick(row: any, column: any) {
			if (column && column.property && row.children) {
				refs.value.table.toggleRowExpansion(row);
			}
		}

		// 子集新增
		function upsertAppend(id: number) {
			refs.value.crud.rowAppend({ parentId: id });
		}

		async function onRefresh(params: any, { render }: any) {
			const list = await service.goods.category.list(params);
			render(deepTree(list));
		}

		return {
			onRefresh,
			refs,
			setRefs,
			upsert,
			table,
			onLoad,
			upsertAppend,
			onRowClick
		};
	}
});
</script>
