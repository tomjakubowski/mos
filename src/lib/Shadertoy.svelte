<script lang="ts">
	import { onMount } from 'svelte';
	import reglInit from 'regl';
	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		let gl = canvas.getContext('webgl')!;
		let regl = reglInit({
			gl
		});
		const drawTriangle = regl({
			frag: `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }`,

			vert: `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0, 1);
  }`,

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

<div class="container" bind:this={container}>
	<canvas class="canvas" bind:this={canvas} />
</div>

<style>
	.container {
		height: 100%;
	}
</style>
