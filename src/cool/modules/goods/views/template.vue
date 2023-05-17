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
			<cl-table :ref="setRefs('table')" v-bind="table" />
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</el-row>

		<!-- 新增、编辑 -->
		<cl-upsert :ref="setRefs('upsert')" v-bind="upsert" :on-submit="onUpsertSubmit">
			<template #slot-data="{ scope }">
				<spec-edit :ref="setRefs('spec-edit')" :modelValue="scope.data" />
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, reactive } from "vue";
import { CrudLoad, Upsert, Table } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import SpecEdit from "../components/spec/edit.vue";

export default defineComponent({
	components: {
		SpecEdit
	},

	setup() {
		const { refs, setRefs, service } = useCool();

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			dialog: {
				props: {
					width: "920px"
				}
			},
			items: [
				{
					label: "模板名称",
					prop: "name",
					component: {
						name: "el-input",
						attrs: {
							placeholder: "请输入模板名称"
						}
					},
					rules: {
						required: true,
						message: "模板名称不能为空"
					}
				},
				{
					label: "模板规格",
					prop: "data",
					hook: {
						bind: (val: any) => {
							return val ? JSON.parse(val) : [];
						}
					},
					component: {
						name: "slot-data"
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
					label: "模板名称",
					prop: "name",
					align: "center",
					minWidth: 200
				},
				// {
				// 	label: "计费方式",
				// 	prop: "type",
				// 	align: "center",
				// 	dict: [
				// 		{
				// 			label: "按件数",
				// 			value: 0
				// 		},
				// 		{
				// 			label: "按重量",
				// 			value: 1
				// 		},
				// 		{
				// 			label: "按体积",
				// 			value: 2
				// 		}
				// 	],
				// 	minWidth: 100
				// },
				// {
				// 	label: "指定包邮",
				// 	prop: "isFree",
				// 	align: "center",
				// 	dict: [
				// 		{
				// 			label: "关闭",
				// 			value: 0,
				// 			type: "danger"
				// 		},
				// 		{
				// 			label: "开启",
				// 			value: 1,
				// 			type: "primary"
				// 		}
				// 	],
				// 	minWidth: 100
				// },
				// {
				// 	label: "排序",
				// 	prop: "orderNum",
				// 	align: "center",
				// 	sortable: "custom",
				// 	minWidth: 100
				// },
				{
					label: "创建时间",
					prop: "createTime",
					align: "center",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "操作",
					type: "op"
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.goods.spec.template).done();
			app.refresh();
		}

		// 提交事件
		function onUpsertSubmit(_: boolean, data: any, { next, done }: any) {
			const spec = refs.value["spec-edit"].validate();

			if (spec) {
				next({
					...data,
					data: spec
				});
			} else {
				ElMessage.warning("请填写模版规格");
				done();
			}
		}

		return {
			refs,
			setRefs,
			upsert,
			table,
			onLoad,
			onUpsertSubmit
		};
	}
});
</script>
