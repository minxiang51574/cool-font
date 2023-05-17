<template>
	<div class="spec-select">
		<!-- 规格模式 -->
		<div class="spec-select__mode">
			<el-radio-group v-model="form.specsType" @change="onTypeChange">
				<el-radio :label="0">单规格</el-radio>
				<el-radio :label="1">多规格</el-radio>
			</el-radio-group>
		</div>

		<!-- 单规格 -->
		<div class="spec-select--default" v-if="form.specsType == 0">
			<!-- 属性表格 -->
			<sku-edit :ref="setRefs('sku-edit')" />
		</div>

		<!-- 多规格 -->
		<div class="spec-select--multiple" v-else-if="form.specsType == 1">
			<!-- 选择规格模板 -->
			<div class="spec-select__tmpl">
				<el-select size="mini" :modelValue="tmpl.data" @change="onTmplChange">
					<el-option
						v-for="(item, index) in tmpl.list"
						:key="index"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>

				<el-button size="mini" type="primary" style="margin-left: 10px">确认</el-button>
			</div>

			<!-- 分割线 -->
			<el-divider content-position="left">{{ tmplLabel }}</el-divider>

			<!-- 规格设置 -->
			<div class="spec-select__upsert">
				<!-- 规格编辑 -->
				<spec-edit create-btn :modelValue="tmpl.value" @create="createSku" />
				<!-- SKU编辑 -->
				<sku-edit :ref="setRefs('sku-edit')" multiple />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { useCool } from "/@/core";
import SkuEdit from "../sku/edit.vue";
import SpecEdit from "../spec/edit.vue";
import { useCrud } from "cl-admin-crud-vue3";

export default defineComponent({
	name: "spec-select",

	components: {
		SkuEdit,
		SpecEdit
	},

	setup() {
		const { refs, setRefs, service } = useCool();
		const { onUpsertOpened } = useCrud();

		// 表单值
		const form = inject<any>("form");

		// 模版
		const tmpl = reactive<any>({
			list: [],
			value: "",
			data: ""
		});

		// 已选模版文案
		const tmplLabel = computed(() => {
			const item: any = tmpl.list.find((e: any) => e.value == tmpl.value);
			return item ? item.label : "自定义规格";
		});

		// 刷新规格模板
		function refreshTmpl() {
			service.goods.spec.template.list().then((res: any[]) => {
				res.unshift({
					name: "自定义规格",
					data: ""
				});

				tmpl.list = res.map((e) => {
					return {
						label: e.name,
						value: e.data
					};
				});
			});
		}

		// 监听模版选择
		function onTmplChange(item: any) {
			ElMessageBox.confirm("切换规格模板将覆盖之前的数据，是否继续？", "提示", {
				type: "warning"
			})
				.then(() => {
					tmpl.data = tmpl.value = item;
				})
				.catch(() => null);
		}

		// 生成sku
		function createSku(spec: any) {
			form.specs.sku = {};

			spec.forEach((e: any) => {
				form.specs.sku[e.label] = e.children;
			});

			refs.value["sku-edit"].generate();
		}

		// 切换规格，清空数据
		function onTypeChange() {
			form.specs.sku = {};
			form.specs.list = [];
		}

		onMounted(() => {
			refreshTmpl();
		});

		onUpsertOpened(() => {
			if (form.specsType == 1) {
				let d = [];
				let n = 0;

				for (const i in form.specs.sku) {
					d.push({
						label: i,
						value: `spec_${n}`,
						children: form.specs.sku[i]
					});

					n++;
				}

				tmpl.value = JSON.stringify(d);
			}
		});

		return {
			refs,
			setRefs,
			form,
			tmpl,
			tmplLabel,
			onTmplChange,
			createSku,
			onTypeChange
		};
	}
});
</script>

<style lang="scss" scoped>
.spec-select {
	width: 100%;

	&__mode {
		margin-bottom: 10px;
	}

	.el-divider {
		background-color: $color-primary;

		&__text {
			font-size: 12px;
			color: $color-primary;
		}
	}
}
</style>
