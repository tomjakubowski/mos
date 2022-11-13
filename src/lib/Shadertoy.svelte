<script lang="ts">
	import { onMount } from 'svelte';
	import { files } from './filestore';
	import reglInit from 'regl';
	let canvas: HTMLCanvasElement;
	let regl: any;

	function reload() {
		const drawTriangle = regl({
			frag: $files['frag.glsl'],
			vert: $files['vert.glsl'],

			attributes: {
				position: [
					[0, -1],
					[-1, 0],
					[1, 1]
				]
			},

			uniforms: {
				iTime: regl.prop('time')
			},

			count: 3
		});

		regl.frame(({ time }: { time: any }) => {
			regl.clear({
				color: [0, 0, 0, 0],
				depth: 1
			});
			drawTriangle({
				time: time
			});
		});
	}

	onMount(() => {
		let gl = canvas.getContext('webgl')!;
		regl = reglInit({
			gl
		});
		reload();
	});
</script>

<div class="container" on:dblclick={reload}>
	<canvas class="canvas" bind:this={canvas} />
</div>

<style>
	.container {
		height: 100%;
	}
</style>
