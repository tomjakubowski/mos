<script lang="ts">
	import Window from './Window.svelte';

	let winId = 0;

	// keyed by winId
	let windows = new Map();

	function generateId() {
		return winId++;
	}

	function createWindow({ title }: { title: string }) {
		let id = generateId();
		windows.set(id, {
			id: id,
			title: title
		});
	}

	createWindow({ title: 'Meowza!' });
</script>

{#each [...windows] as [_id, window]}
	<Window title={window.title} />
{/each}
