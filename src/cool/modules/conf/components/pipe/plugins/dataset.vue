<template>
	<div v-if="visible">
		<conf-plugin name="dataset" label="参数配置" left="calc(100% - 420px)" top="20px">
			<div class="plugin-dataset">
				<cl-form v-model="form" :ref="setRefs('form')" inner />
			</div>
		</conf-plugin>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, inject, Ref } from "vue";
import { dataset } from "/$/conf/utils";
import { useCool } from "/@/core";

export default defineComponent({
	setup() {
		const { refs, setRefs } = useCool();

		// 布局列表
		const list = inject("list") as Ref<any[]>;

		// 表单值
		const form = ref<any>({});

		// 是否可见
		const visible = ref<boolean>(false);

		// 序号
		const index = ref<number>(0);

		// 编辑
		function edit(item: any, i: number) {
			form.value = {};

			if (item && item.dataset) {
				visible.value = true;
				index.value = i;

				// 设置默认值
				item.dataset
					.filter((e: any) => e.key)
					.forEach((e: any) => {
						e.prop = e.key.replace(/\[/g, ".").replace(/\]/g, "");
						e.value = dataset(item, e.key, undefined);
					});

				nextTick(() => {
					refs.value.form.open({
						items: item.dataset,
						op: {
							hidden: true
						}
					});
				});
			} else {
				visible.value = false;
			}
		}

		// 监听值变化
		watch(
			() => form.value,
			(val: any) => {
				for (const i in val) {
					// 查找对应的 key
					const d = list.value[index.value].dataset.find(
						(e: any) => e.prop == i.replace(/-/g, ".")
					);

					if (d) {
						dataset(list.value[index.value], d.key, val[i]);
					}
				}
			},
			{
				deep: true
			}
		);

		return {
			refs,
			setRefs,
			form,
			visible,
			edit,
			list
		};
	}
});
</script>

<style lang="scss" scoped>
.plugin-dataset {
	background-color: #fff;
	padding: 0 10px;
	box-sizing: border-box;
	width: 400px;
}
</style>
