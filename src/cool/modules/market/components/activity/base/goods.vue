<template>
	<div class="-base-goods">
		<cl-crud :ref="setRefs('crud')" @load="onLoad">
			<el-row type="flex" align="middle">
				<!-- 刷新按钮 -->
				<cl-refresh-btn />
				<!-- 新增按钮 -->
				<el-button size="mini" type="primary" @click="toAdd">添加商品</el-button>
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
				:ref="setRefs('upsert')"
				v-bind="upsert"
				:on-info="onUpsertInfo"
				:on-submit="onUpsertSubmit"
			>
				<!-- 商品类型 -->
				<template #slot-category="{ scope }">
					<category-select disabled v-model="scope.categoryId" />
				</template>

				<!-- 商品规格 -->
				<template #slot-specification>
					<spec-select :ref="setRefs('spec-select')" />
				</template>

				<!-- 上传视频 -->
				<template #slot-upload__btn="{ scope }">
					<cl-upload-space accept="video/*" v-model="scope.video" />
				</template>

				<!-- 继承插槽 -->
				<template #[item] v-for="item in slotsName">
					<slot :name="item"></slot>
				</template>
			</cl-upsert>
		</cl-crud>

		<!-- 选择商品 -->
		<goods-select
			:ref="setRefs('goods-select')"
			detail
			:on-refresh="onGoodsSelectRefresh"
			@select="onGoodsSelect"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Upsert, Table } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import GoodsSelect from "/$/goods/components/select.vue";
import SpecSelect from "/$/goods/components/spec/select.vue";

export default defineComponent({
	name: "activity-base-goods",

	components: {
		GoodsSelect,
		SpecSelect
	},

	props: {
		conf: {
			type: Object,
			default: () => {
				return {
					form: [],
					table: []
				};
			}
		}
	},

	setup(props, { slots }) {
		// 功能
		const { refs, setRefs, service, route } = useCool();

		// 地址参数
		const { id, type } = route.query;

		// 继承插槽
		const slotsName = Object.keys(slots);

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			props: {
				labelWidth: "150px"
			},

			dialog: {
				props: {
					width: "1000px"
				}
			},

			items: [
				{
					type: "tabs",
					props: {
						// 以 [name]-[prop] 方式拼接
						mergeProp: true,
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
								label: "活动配置",
								value: "activity",
								name: "activity"
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
					hook: {
						bind: ["split"],
						submit: ["join"]
					},
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
					hidden: !props.conf.spec,
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
				// 不同活动的配置
				...props.conf.form.map((e: any) => {
					return {
						...e,
						group: "activity"
					};
				}),
				{
					group: "activity",
					label: "排序",
					prop: "sortNum",
					value: 0,
					flex: false,
					component: {
						name: "el-input-number",
						props: {
							min: 0,
							max: 1000
						}
					}
				},
				{
					group: "activity",
					label: "状态",
					prop: "status",
					flex: false,
					value: 1,
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
					minWidth: 120
				},
				{
					label: "补贴金",
					prop: "subsidyMoney",
					sortable: "custom",
					minWidth: 100
				},
				{
					label: "活动销量",
					prop: "salesCount",
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
					prop: "sortNum",
					sortable: "custom",
					minWidth: 100
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

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			// 绑定 service
			ctx.service(service.market.activity.goods).done();
			// 请求
			app.refresh({
				activityId: id,
				activityType: type
			});
		}

		// 详情事件
		async function onUpsertInfo(params: any, { next, done }: any) {
			const d: any = await next(params);

			for (const i in d.goods) {
				d[i] = d.goods[i];
			}

			// 活动参数扁平化
			for (const i in d.activity) {
				d[`activity-${i}`] = d.activity[i];
			}

			done(d);
		}

		// 提交事件
		function onUpsertSubmit(_: boolean, data: any, { next }: any) {
			const d: any = {
				activity: {
					...data.activity,
					activityId: id
				},
				goods: {
					specs: {
						sku: {},
						list: []
					}
				}
			};

			// 合并数据
			for (const i in data) {
				if (!["goods", "activity"].includes(i)) {
					d.goods[i] = data[i];
				}
			}

			// 设置 keyId
			d.goods.specs.list.map((e: any) => {
				e.keyId = [];

				if (d.goods.specsType == 0) {
					e.keyId = [e.name];
				} else {
					for (const i in e) {
						if (i.includes("spec_")) {
							e.keyId.push(e[i]);
						}
					}
				}
			});

			next(d);
		}

		// 添加商品
		function toAdd() {
			refs.value["goods-select"].open();
		}

		// 商品选择
		function onGoodsSelect(item: any) {
			refs.value.upsert.append({
				...item,
				"activity-status": 1
			});
		}

		// 商品选择接口
		function onGoodsSelectRefresh({ ctx, app }: CrudLoad) {
			ctx.service(service.market.activity.goods)
				.set("dict", {
					api: {
						page: "selectGoods"
					}
				})
				.done();

			app.refresh({
				activityId: id
			});
		}

		return {
			slotsName,
			refs,
			setRefs,
			upsert,
			table,
			onLoad,
			onUpsertInfo,
			onUpsertSubmit,
			toAdd,
			onGoodsSelect,
			onGoodsSelectRefresh
		};
	}
});
</script>

<style lang="scss" scoped>
.-base-goods {
	height: 100%;
}
</style>
