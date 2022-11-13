<script lang="ts">
	import Window from './Window.svelte';

	type WindowId = string;
	let lastId: number = 0;

	function generateId(): WindowId {
		return `${lastId++}`;
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
	let grabkind: 'resize' | 'move' | null = null;

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

	function closeWindow(event: { detail: { id: WindowId } }) {
		let id = event.detail.id;
		let index = stack.indexOf(id);
		if (index > -1) {
			stack.splice(index, 1);
		}
		delete windows[id];
		stack = stack;
		windows = windows;
	}

	function grabWindow(event: { detail: { id: WindowId; kind: 'move' | 'resize' } }) {
		grabbed = event.detail.id;
		grabkind = event.detail.kind;
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
		grabkind = null;
	}

	function desktopMouseMove(event: MouseEvent) {
		let winId = grabbed;
		if (winId == null) {
			return;
		}
		let deltaX = event.movementX;
		let deltaY = event.movementY;
		if (grabkind == 'move') {
			moveWindow({
				id: winId,
				x: deltaX,
				y: deltaY
			});
		} else if (grabkind == 'resize') {
			resizeWindow({
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

	function resizeWindow({ id, x, y }: { id: WindowId; x: number; y: number }) {
		let win = windows[id];
		if (!win) {
			throw new Error(`window ${id} not found`);
		}
		win.width += x;
		win.height += y;
		windows[id] = windows[id];
	}

	createWindow({ title: 'Meowza!', x: 100, y: 500 });
	createWindow({ title: 'Meowza2!', x: 260, y: 40, width: 400 });
</script>

<div class="desktop" on:mousemove={desktopMouseMove} on:mouseup={desktopMouseUp}>
	{#each Object.entries(windows) as [id, window]}
		{@const z = stack.indexOf(id)}
		<Window
			winId={`${id}`}
			title={window.title}
			active={z == stack.length - 1}
			on:close={closeWindow}
			on:grab={grabWindow}
			on:raise={raiseWindow}
			--width="{window.width}px"
			--height="{window.height}px"
			--x="{window.x}px"
			--y="{window.y}px"
			--z={z}
		>
			<img
				style="display: block"
				src="http://placekitten.com/600/600?image={id}"
				alt="good kitty"
			/>
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
