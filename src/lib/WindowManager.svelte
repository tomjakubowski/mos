<script lang="ts">
	import Window from './Window.svelte';

	type WindowId = number;
	let winId: WindowId = 0;

	function generateId() {
		return winId++;
	}

	interface WindowProps {
		title: string;
		width?: number;
		height?: number;
		x?: number;
		y?: number;
	}

	interface WindowState {
		id: WindowId;
		title: string;
		width: number;
		height: number;
		x: number;
		y: number;
	}

	// keyed by winId
	let windows = new Map<WindowId, WindowState>();

	function createWindow(props: WindowProps) {
		let width = props.width || 640;
		let height = props.height || 480;
		let [x, y] = [props.x || 0, props.y || 0];
		let id = generateId();
		windows.set(id, {
			title: props.title,
			id,
			width,
			height,
			x,
			y
		});
	}

	function closeWindow(event: { detail: { id: number } }) {
		windows.delete(event.detail.id);
		// Reassignment makes it reactive
		windows = windows;
	}

	createWindow({ title: 'Meowza!', x: 100, y: 500 });
	createWindow({ title: 'Meowza2!', x: 260, y: 40, width: 400 });
</script>

<div class="desktop">
	{#each [...windows] as [id, window]}
		<Window
			winId={id}
			title={window.title}
			on:close={closeWindow}
			--width="{window.width}px"
			--height="{window.height}px"
			--x="{window.x}px"
			--y="{window.y}px"
		>
			<img src="http://placekitten.com/300/300" alt="good kitty" />
		</Window>
	{/each}
</div>

<style>
	.desktop {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #008080;
	}
</style>
