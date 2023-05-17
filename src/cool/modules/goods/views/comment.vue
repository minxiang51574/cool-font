<template>
	<cl-crud :ref="setRefs('crud')" @load="onLoad">
		<el-row type="flex" align="middle">
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<!-- <cl-add-btn /> -->
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table :ref="setRefs('table')" v-bind="table">
				<!-- 商品信息 -->
				<template #column-info="{ scope }">
					<goods-info
						:value="{
							title: scope.row.title,
							pic: scope.row.pic,
							price: scope.row.price
						}"
					/>
				</template>

				<!-- 评分 -->
				<template #column-starCount="{ scope }">
					<el-rate v-model="scope.row.starCount" disabled />
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</el-row>
	</cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Table } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import GoodsInfo from "../components/info.vue";

export default defineComponent({
	components: {
		GoodsInfo
	},

	setup() {
		const { refs, setRefs, service } = useCool();

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "createTime",
					order: "descending"
				}
			},
			"context-menu": ["refresh"],
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					label: "商品信息",
					prop: "info",
					minWidth: 300
				},
				{
					label: "用户名称",
					prop: "nickname",
					minWidth: 120
				},
				{
					label: "评论内容",
					prop: "content",
					minWidth: 150
				},
				{
					label: "评分",
					prop: "starCount",
					sortable: true,
					minWidth: 150
				},
				{
					label: "评论时间",
					prop: "createTime",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "操作",
					type: "op",
					width: 100,
					buttons: ["delete"]
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.goods.comment).done();
			app.refresh();
		}

		return {
			refs,
			setRefs,
			table,
			onLoad
		};
	}
});
</script>
