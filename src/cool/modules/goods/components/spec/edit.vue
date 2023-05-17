<template>
	<div class="spec-edit">
		<div
			class="spec-edit__item"
			v-for="(item, index) in vlist"
			:key="index"
			:class="{
				'is-error': item.error
			}"
		>
			<div class="spec-edit__item-label">
				<el-input
					size="mini"
					v-model="item.label"
					clearable
					maxlength="20"
					placeholder="规格名称（颜色）"
				/>
			</div>

			<div class="spec-edit__item-list">
				<el-tag
					v-for="(child, cIndex) in item.children"
					:key="cIndex"
					size="small"
					effect="dark"
					closable
					@close="itemRemove(item, cIndex)"
					>{{ child }}</el-tag
				>

				<div class="spec-edit__item-add">
					<el-input
						size="mini"
						v-model="item.text"
						placeholder="规格属性（白色）"
						@keydown.enter="itemAdd(item)"
					/>
					<el-button
						size="mini"
						type="success"
						:disabled="!item.text"
						@click="itemAdd(item)"
						>添加</el-button
					>
				</div>
			</div>

			<i class="el-icon-error" @click="remove(index)"></i>
		</div>

		<div class="spec-edit__append">
			<el-button size="mini" @click="add">添加规格</el-button>
			<el-button
				v-if="createBtn"
				:disabled="list.length == 0"
				size="mini"
				type="success"
				@click="onCreate"
				>立即生成</el-button
			>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { cloneDeep, isString } from "/@/core/utils";

export default defineComponent({
	name: "spec-edit",

	props: {
		createBtn: Boolean,
		modelValue: [Object, String]
	},

	emits: ["update:modelValue", "create"],

	setup(props, { emit }) {
		const list = ref<any>([]);

		// 监听值变化
		watch(
			() => props.modelValue,
			(val: any) => {
				if (val) {
					list.value = cloneDeep(isString(val) ? JSON.parse(val) : val);
				} else {
					list.value = [];
				}
			},
			{
				immediate: true
			}
		);

		// 过滤异常数据
		const vlist = computed(() => {
			return list.value.map((e: any) => {
				e.error = e.error === null ? null : !e.label || e.children.length === 0;
				return e;
			});
		});

		// 添加规格属性
		function itemAdd(item: any) {
			if (!item.children.includes(item.text)) {
				item.children.push(item.text);
				item.text = "";
			} else {
				ElMessage.warning("属性已存在");
			}
		}

		// 移除规格下属性
		function itemRemove(item: any, index: number | string) {
			item.children.splice(index, 1);
		}

		// 移除规格
		function remove(index: number | string) {
			ElMessageBox.confirm("确认要移除该条规格吗？", "提示", {
				type: "warning"
			})
				.then(() => {
					list.value.splice(index, 1);
				})
				.catch(() => null);
		}

		// 追加数据
		function add() {
			list.value.push({
				label: "",
				value: "",
				text: "",
				children: [],
				error: null
			});
		}

		// 清空数据
		function clear() {
			list.value = [];
		}

		// 输入校验，数据获取的唯一方法
		function validate() {
			let pass = true;

			list.value.map((e: any) => {
				e.error = !e.label || e.children.length === 0;

				if (e.error) {
					pass = false;
				}
			});

			return pass
				? list.value.map((e: any, i: number) => {
						return {
							label: e.label,
							value: `spec_${i}`,
							children: e.children
						};
				  })
				: null;
		}

		// 内容按钮创建事件
		function onCreate() {
			const d = validate();

			if (d) {
				ElMessage.success("生成成功");
				emit("create", d);
			} else {
				ElMessage.warning("请填写完整");
			}
		}

		return {
			list,
			vlist,
			itemAdd,
			itemRemove,
			add,
			remove,
			clear,
			validate,
			onCreate
		};
	}
});
</script>

<style lang="scss" scoped>
.spec-edit {
	&__item {
		display: inline-block;
		border: 1px solid #eee;
		padding: 5px 10px;
		margin: 0 10px 10px 0;
		border-radius: 3px;
		position: relative;

		&-label {
			.el-input {
				width: 150px;
			}
		}

		&-list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-top: 5px;

			.el-tag {
				margin: 5px 10px 5px 0;
			}
		}

		&-add {
			.el-input {
				width: 160px;
			}

			.el-button {
				margin-left: 5px;
			}
		}

		.el-icon-error {
			display: none;
			position: absolute;
			right: 5px;
			top: 5px;
			font-size: 18px;
			color: #f56c6c;
			cursor: pointer;
		}

		&:hover {
			.el-icon-error {
				display: inline;
			}
		}

		&.is-append {
			border-style: dashed;
		}

		&.is-error {
			border-color: #f56c6c;
		}
	}
}
</style>
