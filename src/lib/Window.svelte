<script lang="ts">
	import '98.css/style.css';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title: string = '???';
	export let winId: number;

	function handleClose() {
		dispatch('close', {
			id: winId
		});
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
		<slot />
	</div>
</div>

<style>
	.window {
		width: var(--width, 300px);
		height: var(--height, 300px);
		/* Parent element has relative positioning */
		position: absolute;
		left: var(--x);
		top: var(--y);
		user-select: none;
	}

	.title-bar {
		cursor: move;
	}
</style>
