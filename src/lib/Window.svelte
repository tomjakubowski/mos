<script lang="ts">
	/* import '98.css/style.css'; */

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title: string = '???';
	export let winId: string;
	export let active: boolean = false;

	function handleClose() {
		dispatch('close', {
			id: winId
		});
	}

	function handleTitleDown() {
		dispatch('grab', { id: winId, kind: 'move' });
	}

	function handleTitleUp() {
		dispatch('ungrab', { id: winId });
	}

	function handleWindowDown() {
		dispatch('raise', { id: winId });
	}

	function startResize() {
		dispatch('grab', { id: winId, kind: 'resize' });
	}
	function endResize() {
		dispatch('ungrab', { id: winId });
	}
</script>

<div class="window" on:mousedown={handleWindowDown}>
	<div
		class="title-bar {active ? '' : 'inactive'}"
		on:mousedown={handleTitleDown}
		on:mouseup={handleTitleUp}
	>
		<div class="title-bar-text">
			{title}
		</div>
		<div class="title-bar-controls">
			<button on:mousedown={(e) => e.stopPropagation()} on:click={handleClose} aria-label="Close" />
		</div>
	</div>
	<div class="window-body">
		<slot />
	</div>
	<div class="resize-corner se" on:mousedown={startResize} on:mouseup={endResize} />
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
		overflow: hidden;
		box-sizing: border-box;
		z-index: var(--z);
	}

	.title-bar {
		cursor: move;
	}

	.resize-corner {
		position: absolute;
		width: 4px;
		height: 4px;
		background-color: red;
	}

	.window-body {
		overflow: auto;
		max-height: calc(var(--height) - 40px);
	}

	.se {
		right: 0;
		bottom: 0;
		cursor: nwse-resize;
	}
</style>
