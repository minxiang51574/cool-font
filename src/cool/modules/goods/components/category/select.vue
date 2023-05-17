<template>
	<div class="category-select">
		<el-popover
			v-model:visible="visible"
			placement="bottom-start"
			width="500px"
			popper-class="category-select__popper"
		>
			<el-input v-model="keyword" size="small">
				<template #prefix>
					<i class="el-input__icon el-icon-search"></i>
				</template>
			</el-input>

			<el-tree
				ref="treeRef"
				node-key="menuId"
				:data="treeList"
				:props="{
					label: 'name',
					children: 'children'
				}"
				:highlight-current="true"
				:expand-on-click-node="false"
				:default-expanded-keys="expandedKeys"
				:filter-node-method="filterNode"
				@current-change="onCurrentChange"
			/>

			<template #reference>
				<el-input
					@click="open"
					:disabled="disabled"
					v-model="name"
					readonly
					placeholder="请选择"
				/>
			</template>
		</el-popover>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useCool } from "/@/core";
import { deepTree } from "/@/core/utils";

export default defineComponent({
	name: "category-select",

	cool: {
		global: true
	},

	props: {
		modelValue: [Number, String],
		disabled: Boolean
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		const visible = ref<boolean>(false);

		// 请求服务
		const { service } = useCool();

		// 关键字
		const keyword = ref<string>("");

		// 树形列表
		const list = ref<any[]>([]);

		// 展开值
		const expandedKeys = ref<any[]>([]);

		// el-tree 组件
		const treeRef = ref<any>({});

		// 打开
		function open() {
			visible.value = true;
		}

		// 关闭
		function close() {
			visible.value = false;
		}

		// 绑定值回调
		function onCurrentChange(item: any) {
			if (item.parentId) {
				emit("update:modelValue", item.id);
				close();
			}
		}

		// 刷新列表
		function refresh() {
			service.goods.category.list().then((res: any) => {
				list.value = res;
			});
		}

		// 过滤节点
		function filterNode(value: string, data: any) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		}

		// 节点名称
		const name = computed(() => {
			const item = list.value.find((e) => e.id == props.modelValue);
			return item ? item.name : "请选择类型";
		});

		// 树形列表
		const treeList = computed(() => deepTree(list.value));

		// 监听关键字过滤
		watch(keyword, (val: string) => {
			treeRef.value.filter(val);
		});

		onMounted(() => {
			refresh();
		});

		return {
			visible,
			keyword,
			list,
			expandedKeys,
			treeRef,
			name,
			treeList,
			refresh,
			filterNode,
			onCurrentChange,
			open,
			close
		};
	}
});
</script>

<style lang="scss">
.category-select__popper {
	box-sizing: border-box;

	.el-input {
		margin-bottom: 10px;
	}
}
</style>
