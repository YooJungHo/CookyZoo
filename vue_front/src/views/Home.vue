<template>
	<div class="home">
		<Gamemain />
		<div></div>
	</div>
</template>

<script>
// @ is an alias to /src
import Gamemain from "@/components/Gamemain.vue";

export default {
	name: "Home",
	components: {
		Gamemain,
	},
};
</script>
