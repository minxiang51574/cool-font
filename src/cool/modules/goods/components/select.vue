<template>
	<cl-dialog
		v-model="visible"
		title="商品选择"
		width="1200px"
		:props="{
			'append-to-body': true
		}"
	>
		<cl-crud @load="onLoad" :on-refresh="onCrudRefresh">
			<el-row type="flex">
				<cl-refresh-btn />
				<el-button
					size="mini"
					type="primary"
					:disabled="selection.length == 0"
					v-if="multiple"
					@click="multiSelect"
					>选择</el-button
				>
				<cl-flex1 />
				<cl-search-key />
			</el-row>

			<el-row>
				<cl-table
					:ref="setRefs('table')"
					v-bind="table"
					@selection-change="onSelectionChange"
				>
					<!-- 轮播图 -->
					<template #column-pics="{ scope }">
						<cl-image :size="80" :src="scope.row.pics" />
					</template>

					<!-- 选择按钮 -->
					<template #slot-select-btn="{ scope }">
						<el-button round type="primary" size="mini" @click="select(scope.row)"
							>选择</el-button
						>
					</template>
				</cl-table>
			</el-row>

			<el-row type="flex">
				<cl-flex1 />
				<cl-pagination />
			</el-row>
		</cl-crud>
	</cl-dialog>
</template>

<script lang="ts">
import { Table, CrudLoad } from "cl-admin-crud-vue3/types";
import { defineComponent, ref } from "vue";
import { useCool } from "/@/core";

export default defineComponent({
	name: "goods-select",

	props: {
		multiple: Boolean,
		detail: Boolean,
		onRefresh: Function,
		list: {
			type: Array,
			default: () => []
		}
	},

	emits: ["select"],

	setup(props, { emit }) {
		const { service, refs, setRefs } = useCool();

		// 是否可见
		const visible = ref<boolean>(false);

		// 表格配置
		const table = ref<Table>({
			props: {
				"max-height": "500px"
			},
			columns: [
				{
					type: "selection",
					width: 60,
					hidden: !props.multiple
				},
				{
					label: "商品图",
					prop: "pics",
					minWidth: 100
				},
				{
					label: "商品名称",
					prop: "title",
					minWidth: 160,
					showOverflowTooltip: true
				},
				{
					label: "商品售价",
					prop: "price",
					sortable: "custom",
					minWidth: 120,
					formatter(row: any) {
						return (row.minPrice || 0) + " - " + (row.maxPrice || 0);
					}
				},
				{
					label: "销量",
					prop: "sales",
					sortable: "custom",
					minWidth: 100
				},
				{
					label: "库存",
					prop: "inventory",
					sortable: "custom",
					minWidth: 100
				},
				{
					label: "状态",
					prop: "status",
					dict: [
						{
							label: "上架",
							value: 1,
							type: "success"
						},
						{
							label: "下架",
							value: 0,
							type: "danger"
						}
					],
					minWidth: 100
				},
				{
					type: "op",
					width: 100,
					buttons: ["slot-select-btn"]
				}
			]
		});

		// 参数
		const params = ref<any>({
			size: 20,
			page: 1
		});

		// 已选列表
		const selection = ref<any[]>([]);

		// 打开
		function open(data: any) {
			params.value = data;
			selection.value = [];
			visible.value = true;
		}

		// 关闭
		function close() {
			visible.value = false;
		}

		// 选择
		async function select(row: any) {
			let info: any = row;

			if (props.detail) {
				info = await service.goods.info.info({
					id: row.id
				});
			}

			emit("select", info);
			close();
		}

		// 批量选择
		function multiSelect() {
			emit("select", ...selection.value);
			close();
		}

		// crud
		function onLoad({ ctx, app }: CrudLoad) {
			if (props.onRefresh) {
				props.onRefresh({ ctx, app });
			} else {
				ctx.service(service.goods.info).done();
				app.refresh(params.value);
			}
		}

		// 监听刷新
		async function onCrudRefresh(params: any, { next }: any) {
			const { list } = await next(params);

			// 回填数据
			list.forEach((e: any) => {
				if (props.list.find((a: any) => a.id == e.id)) {
					refs.value.table.toggleRowSelection(e);
				}
			});
		}

		// 监听选择
		function onSelectionChange(list: any[]) {
			selection.value = list;
		}

		return {
			refs,
			setRefs,
			visible,
			table,
			params,
			selection,
			open,
			close,
			select,
			multiSelect,
			onLoad,
			onCrudRefresh,
			onSelectionChange
		};
	}
});
</script>
