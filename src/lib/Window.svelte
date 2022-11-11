<script lang="ts">
	import '98.css/style.css';

	export let title: string = '???';

	function handleClose() {
		window.alert('close me please');
	}
</script>

<div class="window">
	<div class="title-bar">
		<div class="title-bar-text">{title}</div>
		<div class="title-bar-controls">
			<button on:click={handleClose} aria-label="Close" />
		</div>
	</div>
	<div class="window-body">
		<img src="http://placekitten.com/300/300" alt="good kitty" />
	</div>
</div>

<style>
	.window {
		width: var(--width, 300px);
	}

	.window-body {
		overflow: scroll;
	}
</style>
