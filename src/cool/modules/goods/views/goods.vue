<template>
	<cl-crud :ref="setRefs('crud')" :on-refresh="onRefresh" @load="onLoad">
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
				<!-- 轮播图 -->
				<template #column-pics="{ scope }">
					<cl-image :size="80" :src="scope.row.pics" />
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</el-row>

		<!-- 新增、编辑 -->
		<cl-upsert
			v-model="form"
			:ref="setRefs('upsert')"
			v-bind="upsert"
			:on-submit="onUpsertSubmit"
		>
			<!-- 商品类型 -->
			<template #slot-category="{ scope }">
				<category-select v-model="scope.categoryId" />
			</template>

			<!-- 商品规格 -->
			<template #slot-specification>
				<spec-select :ref="setRefs('spec-select')" />
			</template>

			<!-- 上传视频 -->
			<template #slot-upload__btn="{ scope }">
				<cl-upload-space accept="video/*" v-model="scope.video" />
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Upsert, Table } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import SpecSelect from "../components/spec/select.vue";

export default defineComponent({
	components: {
		SpecSelect
	},

	setup() {
		const { refs, setRefs, service } = useCool();

		// 默认表单
		const form = reactive<any>({
			specsType: 0,
			specs: {
				sku: {},
				list: []
			}
		});

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			dialog: {
				props: {
					width: "1000px"
				}
			},

			items: [
				{
					type: "tabs",
					props: {
						labels: [
							{
								label: "商品信息",
								value: "base"
							},
							{
								label: "商品详情",
								value: "detail"
							},
							{
								label: "其他设置",
								value: "other"
							}
						]
					}
				},
				{
					group: "base",
					label: "商品分类",
					prop: "categoryId",
					component: {
						name: "slot-category"
					},
					rules: {
						required: true,
						message: "商品分类不能为空"
					}
				},
				{
					group: "base",
					label: "商品标题",
					prop: "title",
					component: {
						name: "el-input",
						props: {
							clearable: true
						},
						attrs: {
							placeholder: "请输入商品标题"
						}
					},
					rules: {
						required: true,
						message: "商品标题不能为空"
					}
				},
				{
					group: "base",
					label: "商品子标题",
					prop: "subTitle",
					span: 12,
					component: {
						name: "el-input",
						props: {
							clearable: true
						},
						attrs: {
							placeholder: "请输入商品子标题"
						}
					}
				},
				{
					group: "base",
					label: "商品关键字",
					prop: "keywords",
					value: "",
					span: 12,
					hook: "splitJoin",
					component: {
						name: "el-select",
						options: [],
						props: {
							filterable: true,
							clearable: true,
							multiple: true,
							"allow-create": true
						},
						attrs: {
							placeholder: "请输入商品关键字"
						}
					}
				},
				{
					group: "base",
					label: "商品简介",
					prop: "introduction",
					component: {
						name: "el-input",
						props: {
							clearable: true,
							type: "textarea"
						},
						attrs: {
							placeholder: "请输入商品简介",
							rows: 4
						}
					}
				},
				{
					group: "base",
					label: "商品轮播图",
					prop: "pics",
					component: {
						name: "cl-upload",
						props: {
							multiple: true,
							limit: 5,
							listType: "picture-card"
						}
					},
					rules: {
						required: true,
						message: "商品轮播图不能为空"
					}
				},
				{
					group: "base",
					label: "主图视频",
					prop: "video",
					component: {
						name: "el-input",
						attrs: {
							placeholder: "请输入视频链接"
						}
					},
					append: {
						name: "slot-upload__btn"
					}
				},
				{
					group: "base",
					label: "商品规格",
					prop: "specs",
					value: {
						sku: {},
						list: []
					},
					component: {
						name: "slot-specification"
					}
				},
				{
					group: "detail",
					props: {
						labelWidth: "0px"
					},
					prop: "detail",
					component: {
						name: "cl-editor-quill",
						props: {
							height: 300
						}
					}
				},
				{
					group: "other",
					label: "商品状态",
					prop: "status",
					span: 8,
					value: 1,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "上架",
								value: 1
							},
							{
								label: "下架",
								value: 0
							}
						]
					}
				},
				{
					group: "other",
					label: "商品排序",
					prop: "orderNum",
					value: 0,
					span: 8,
					component: {
						name: "el-input-number",
						props: {
							min: 0,
							max: 1000
						}
					}
				}
			]
		});

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "createTime",
					order: "descending"
				}
			},

			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					label: "商品ID",
					prop: "id",
					minWidth: 80
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
					prop: "minPrice",
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
					label: "排序",
					prop: "orderNum",
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
					label: "创建时间",
					prop: "createTime",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "操作",
					type: "op"
				}
			]
		});

		// crud加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.goods.info).done();
			app.refresh();
		}

		// 监听刷新
		async function onRefresh(params: any, { next, render }: any) {
			const { list } = await next(params);

			list.map((e: any) => {
				e.picList = (e.pics || "").split(",").filter(Boolean);
				e.cover = e.picList[0];
			});

			render(list);
		}

		// 提交事件
		function onUpsertSubmit(_: boolean, data: any, { next }: any) {
			data.specs.list.map((e: any) => {
				e.keyId = [];

				if (data.specsType == 0) {
					e.keyId = [e.name];
				} else {
					for (const i in e) {
						if (i.includes("spec_")) {
							e.keyId.push(e[i]);
						}
					}
				}
			});

			next(data);
		}

		return {
			refs,
			setRefs,
			upsert,
			form,
			table,
			onLoad,
			onRefresh,
			onUpsertSubmit
		};
	}
});
</script>
