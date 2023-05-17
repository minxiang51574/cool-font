<template>
	<div class="conf-form-label">
		<el-divider content-position="left">{{ content }}</el-divider>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "conf-form-label",

	cool: {
		global: true
	},

	props: {
		content: String
	}
});
</script>
