<template>
	<div class="cl-input-price">
		<el-input-number
			v-model="value"
			:min="min"
			:max="max"
			:step="step"
			:step-strictly="stepStrictly"
			:precision="precision"
			:size="size"
			:disabled="disabled"
			:controls="controls"
			:controls-postion="controlsPostion"
			:placeholder="placeholder"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
	name: "cl-input-price",

	props: {
		modelValue: [String, Number],
		min: {
			type: Number,
			default: 0.1
		},
		max: {
			type: Number,
			default: 10000000
		},
		step: Number,
		stepStrictly: Boolean,
		precision: {
			type: Number,
			default: 2
		},
		size: String,
		disabled: Boolean,
		controls: {
			type: Boolean,
			default: true
		},
		controlsPostion: String,
		placeholder: {
			type: String,
			default: "请填写"
		}
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		const value = ref<number | string>(0);

		watch(
			() => props.modelValue,
			(val: any) => {
				value.value = val ? Number(val) : 0;
			},
			{
				immediate: true
			}
		);

		watch(
			() => value.value,
			(val: any) => {
				emit("update:modelValue", val);
			}
		);

		return {
			value
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-input-price {
	width: 100%;

	.el-input-number {
		width: 100%;
	}
}
</style>
