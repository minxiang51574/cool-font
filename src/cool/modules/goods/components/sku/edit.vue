<template>
	<div class="sku-edit">
		<!-- 批量设置 -->
		<template v-if="selection.length > 0">
			<div class="sku-edit__set">
				<el-divider content-position="left">批量设置</el-divider>

				<el-table size="mini" border :data="batch">
					<el-table-column
						v-for="(item, index) in columns"
						:key="index"
						:label="item.label"
						:prop="item.prop"
						:min-width="item.width"
						align="center"
					>
						<template #default="scope">
							<el-row type="flex" justify="center">
								<component
									:is="item.component.name"
									v-model="scope.row[item.prop]"
									v-bind="item.component.props"
								/>
							</el-row>
						</template>
					</el-table-column>

					<el-table-column label="操作" align="center" width="200" fixed="right">
						<template #default>
							<el-button size="mini" type="primary" @click="batchUpdate()"
								>批量修改</el-button
							>
							<el-button size="mini" type="danger" @click="batchClear()"
								>清空</el-button
							>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</template>

		<!-- 操作按钮 -->
		<div class="sku-edit__op" v-if="!multiple">
			<el-button size="mini" @click="add">添加规格</el-button>
			<el-button type="danger" size="mini" @click="clear">清空</el-button>
		</div>

		<!-- 商品属性列表 -->
		<div class="sku-edit__list">
			<el-divider content-position="left">商品属性</el-divider>

			<el-table
				size="mini"
				border
				:data="form.specs.list"
				max-height="500px"
				@selection-change="onSelectionChange"
			>
				<el-table-column fixed="left" type="selection" width="60" align="center" />

				<template v-if="multiple">
					<!-- 规格自定义属性 -->
					<el-table-column
						v-for="(item, index) in spec"
						:key="index"
						:label="item.label"
						:prop="item.prop"
						align="center"
						min-width="100"
						show-overflow-tooltip
					/>
				</template>

				<!-- 规格默认属性 -->
				<el-table-column
					v-for="(item, index) in columns"
					:key="index"
					:label="item.label"
					:prop="item.prop"
					:min-width="item.width"
					align="center"
				>
					<template #default="scope">
						<el-form-item
							:show-message="false"
							:prop="`specs.list.${scope.$index}.${item.prop}`"
							:rules="item.rules"
						>
							<el-row type="flex" justify="center">
								<component
									:is="item.component.name"
									v-model="scope.row[item.prop]"
									v-bind="item.component.props"
								/>
							</el-row>
						</el-form-item>
					</template>
				</el-table-column>

				<el-table-column label="操作" align="center" width="100" fixed="right">
					<template #default="scope">
						<el-button size="mini" type="danger" @click="remove(scope.$index)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from "vue";
import { useCrud } from "cl-admin-crud-vue3";
import { isEmpty, isArray } from "/@/core/utils";
import { calcDescartes } from "../../utils";

export default defineComponent({
	name: "sku-edit",

	props: {
		// 是否多规格
		multiple: Boolean
	},

	setup() {
		const { onUpsertOpened } = useCrud();

		const form = inject<any>("form");

		// 规格
		const spec = computed(() => {
			let d = [];

			for (const i in form.specs.sku) {
				d.push({
					label: i,
					prop: `spec_${i}`
				});
			}

			return d;
		});

		// 配置列
		const columns = ref<any[]>([
			{
				label: "图片",
				prop: "pic",
				width: 80,
				value: "",
				component: {
					name: "cl-upload",
					props: {
						size: 60,
						text: ""
					}
				},
				rules: {
					required: false
				}
			},
			{
				label: "名称",
				prop: "name",
				value: "",
				width: 150,
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入名称",
						clearable: true
					}
				},
				rules: {
					required: true
				}
			},
			{
				label: "售价",
				prop: "price",
				value: 0.1,
				width: 150,
				component: {
					name: "cl-input-price"
				},
				rules: {
					required: true
				}
			},
			{
				label: "成本价",
				prop: "costPrice",
				value: 0.1,
				width: 150,
				component: {
					name: "cl-input-price"
				},
				rules: {
					required: true
				}
			},
			{
				label: "原价",
				prop: "originalPrice",
				value: 0.1,
				width: 150,
				component: {
					name: "cl-input-price"
				},
				rules: {
					required: true
				}
			},
			{
				label: "库存",
				prop: "inventory",
				value: 100,
				width: 150,
				component: {
					name: "el-input-number",
					props: {
						step: 10,
						min: 0,
						max: 1000000
					}
				},
				rules: {
					required: true
				}
			},
			{
				label: "编码",
				prop: "num",
				value: "",
				width: 200,
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入编码"
					}
				},
				rules: {
					required: false
				}
			}
		]);

		// 批量设置的数据
		const batch = ref<any[]>([]);

		// 选中的数据
		const selection = ref<any[]>([]);

		// 添加航
		function add() {
			form.specs.list.push(create());
		}

		// 删除行
		function remove(i: number) {
			form.specs.list.splice(i, 1);
		}

		// 清空
		function clear() {
			form.specs.list = [];
		}

		// 清空批量设置的内容
		function batchClear() {
			batch.value = [create()];
		}

		// 批量设置
		function batchUpdate() {
			selection.value.map((e: any) => {
				for (const i in batch.value[0]) {
					e[i] = batch.value[0][i];
				}
			});
		}

		// 已选择的行
		function onSelectionChange(list: any[]) {
			selection.value = list;
		}

		// 输入校验，数据获取的唯一方法
		function validate() {
			return form.specs.list.length === 0 ? false : form.specs.list;
		}

		// 创建行
		function create(b: any = {}) {
			let a: any = {};

			columns.value.forEach((e) => {
				a[e.prop] = e.value;
			});

			// name 默认以规格拼接
			let n = "";

			for (const i in b) {
				if (i.includes("spec_")) {
					n += " " + b[i];
				}
			}

			return Object.assign(a, b, {
				name: n
			});
		}

		// 生成 sku 列表
		function generate() {
			const sku = calcDescartes(Object.values(form.specs.sku));

			let arr: any = [];

			sku.forEach((s: any) => {
				const d: any = {};

				if (!isArray(s)) {
					s = [s];
				}

				// 设置 spec_ 值
				s.forEach((sn: string, si: number) => {
					d[spec.value[si].prop] = sn;
				});

				// 规格是否存在
				const item = form.specs.list.find((e: any) => {
					let f = true;

					// 根据 spec_ 判断规格
					for (const i in d) {
						if (e[i] != d[i]) {
							f = false;
						}
					}

					// 根据 keyId 判断规格
					if (e.keyId) {
						if (e.keyId.join(",") == s.join(",")) {
							f = true;
						}
					}

					return f;
				});

				arr.push(
					create({
						...item,
						...d
					})
				);
			});

			form.specs.list = arr;
		}

		// 打开后
		onUpsertOpened(({ isEdit }: any) => {
			if (isEmpty(form.specs.sku)) {
				form.specs.sku = {};
			}

			// 默认规格
			if (form.specsType == 0) {
				if (isEmpty(form.specs.list)) {
					form.specs.list = [create()];
				}
			} else {
				form.specs.list.map((e: any) => {
					e.keyId.forEach((k: any) => {
						for (const i in form.specs.sku) {
							if (form.specs.sku[i].includes(k)) {
								e[`spec_${i}`] = k;
							}
						}
					});
				});
			}
		});

		// 默认值
		batch.value = [create()];

		return {
			form,
			spec,
			columns,
			batch,
			selection,
			create,
			generate,
			add,
			remove,
			clear,
			batchClear,
			batchUpdate,
			onSelectionChange,
			validate
		};
	}
});
</script>

<style lang="scss" scoped>
.sku-edit {
	&__set {
		margin: 10px 0;
	}

	&__list {
		margin-top: 30px;
	}

	&__list,
	&__set {
		.el-divider {
			background-color: $color-primary;

			&__text {
				font-size: 12px;
				color: $color-primary;
			}
		}
	}

	.el-form-item--small {
		margin-bottom: 0;
	}
}
</style>
