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

	interface Windows {
		[id: WindowId]: WindowState;
	}

	let windows: Windows = {};
	let stack: WindowId[] = [];
	let grabbed: WindowId | null = null;

	function createWindow(props: WindowProps) {
		let width = props.width || 640;
		let height = props.height || 480;
		let [x, y] = [props.x || 0, props.y || 0];
		let id = generateId();
		windows[id] = {
			title: props.title,
			id,
			width,
			height,
			x,
			y
		};
		stack.push(id);
		stack = stack;
	}

	function closeWindow(event: { detail: { id: number } }) {
		delete windows[event.detail.id];
		windows = windows;
	}

	function grabWindow(event: { detail: { id: WindowId } }) {
		grabbed = event.detail.id;
	}

	function raiseWindow(event: { detail: { id: WindowId } }) {
		let id = event.detail.id;
		let index = stack.indexOf(id);
		if (index > -1) {
			stack.splice(index, 1);
		}
		stack.push(id);
		stack = stack;
	}

	function desktopMouseUp() {
		grabbed = null;
	}

	function desktopMouseMove(event: MouseEvent) {
		let winId = grabbed;
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
		let win = windows[id];
		if (!win) {
			throw new Error(`window ${id} not found`);
		}
		win.x += x;
		win.y += y;
		windows[id] = windows[id];
	}

	createWindow({ title: 'Meowza!', x: 100, y: 500 });
	createWindow({ title: 'Meowza2!', x: 260, y: 40, width: 400 });
</script>

<div class="desktop" on:mousemove={desktopMouseMove} on:mouseup={desktopMouseUp}>
	{#each stack as id, z}};
		{@const window = windows[id]}
		<Window
			winId={`${id}`}
			title={window.title}
			on:close={closeWindow}
			on:grab={grabWindow}
			on:raise={raiseWindow}
			--width="{window.width}px"
			--height="{window.height}px"
			--x="{window.x}px"
			--y="{window.y}px"
			--z={z}
		>
			<img src="http://placekitten.com/{window.width - 50}/{window.height - 50}" alt="good kitty" />
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
