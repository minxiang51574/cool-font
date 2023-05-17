<template>
	<div class="activity-butie-config">
		<base-conf :conf="conf" />
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import BaseConf from "../base/config.vue";

export default defineComponent({
	name: "activity-butie-config",

	components: {
		BaseConf
	},

	setup() {
		const conf = reactive<any>({
			items: [
				{
					label: "补贴金",
					prop: "money",
					component: {
						name: "cl-input-price"
					}
				}
			]
		});

		return {
			conf
		};
	}
});
</script>
