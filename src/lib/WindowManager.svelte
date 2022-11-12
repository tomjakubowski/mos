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

	interface WmState {
		grabbed: WindowId | null;
	}

	let state: WmState = {
		grabbed: null
	};

	// keyed by winId
	// TODO: consider making this an object, keyed by stringified ID
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

	function grabWindow(event: { detail: { id: WindowId } }) {
		state.grabbed = event.detail.id;
	}

	function releaseWindow(event: { detail: { id: WindowId } }) {
		state.ungrab = event.detail.id;
	}

	function desktopMouseUp() {
		state.grabbed = null;
	}

	function desktopMouseMove(event: MouseEvent) {
		let winId = state.grabbed;
		if (winId != null) {
			let deltaX = event.movementX;
			let deltaY = event.movementY;
			moveWindow({
				id: winId,
				x: deltaX,
				y: deltaY
			});
		}
	}

	function moveWindow({ id, x, y }: { id: WindowId; x: number; y: number }) {
		let win = windows.get(id);
		if (!win) {
			throw new Error(`window ${id} not found`);
		}
		console.log(`${win.x} -> ${x}`);
		win.x += x;
		win.y += y;
		windows.set(id, win);
		windows = windows;
	}

	createWindow({ title: 'Meowza!', x: 100, y: 500 });
	createWindow({ title: 'Meowza2!', x: 260, y: 40, width: 400 });
</script>

<div class="desktop" on:mousemove={desktopMouseMove} on:mouseup={desktopMouseUp}>
	{#each [...windows] as [id, window]}
		<Window
			winId={id}
			title={window.title}
			on:close={closeWindow}
			on:grab={grabWindow}
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
