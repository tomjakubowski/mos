<script lang="ts">
	import { onMount } from 'svelte';
	import { files } from './filestore';
	import reglInit from 'regl';
	let canvas: HTMLCanvasElement;

	onMount(() => {
		let gl = canvas.getContext('webgl')!;
		let regl = reglInit({
			gl
		});
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

			count: 3
		});

		drawTriangle();
	});
</script>

<div class="container">
	<canvas class="canvas" bind:this={canvas} />
</div>

<style>
	.container {
		height: 100%;
	}
</style>
