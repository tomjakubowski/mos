<script lang="ts">
	import Window from './Window.svelte';
	import Cat from './Cat.svelte';
	import Notepad from './Notepad.svelte';
	import Shadertoy from './Shadertoy.svelte';
	import { files } from './filestore';

	type WindowId = string;
	let lastId: number = 0;

	function generateId(): WindowId {
		return `${lastId++}`;
	}

	interface WindowProps {
		title: string;
		content: any;
		contentprops?: any;
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
		content: any;
		contentprops: any;
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
		let content = props.content;
		let contentprops = props.contentprops || {};
		let [x, y] = [props.x || 0, props.y || 0];
		let id = generateId();
		windows[id] = {
			title: props.title,
			id,
			width,
			height,
			x,
			y,
			content,
			contentprops
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

	createWindow({
		title: 'Meowza!',
		x: 100,
		y: 500,
		content: Cat,
		contentprops: { cat: 15, width: 640, height: 480 }
	});
	createWindow({
		title: 'Meeoowzaa!',
		x: 260,
		y: 40,
		width: 400,
		content: Cat,
		contentprops: { cat: 10, width: 800, height: 600 }
	});
	createWindow({
		title: 'triangle',
		x: 460,
		y: 300,
		width: 400,
		content: Shadertoy
	});
	createWindow({
		title: 'vert.glsl - Notepad',
		x: 300,
		y: 150,
		width: 400,
		height: 150,
		content: Notepad,
		contentprops: { file: 'vert.glsl' }
	});
	createWindow({
		title: 'frag.glsl - Notepad',
		x: 100,
		y: 100,
		width: 400,
		height: 150,
		content: Notepad,
		contentprops: { file: 'frag.glsl' }
	});
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
			<svelte:component this={window.content} {...window.contentprops} />
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
