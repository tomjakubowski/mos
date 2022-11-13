<script lang="ts">
	let content = 'hello world';
</script>

<!-- wizards aint need their spells checked -->
<textarea bind:value={content} spellcheck="false" />

<style>
	textarea {
		width: 100%;
		height: calc(100% - 2px);

		font-family: 'Courier', monospace;
		font-size: 12px;
		color: black;

		resize: none;

		white-space: pre;
		overflow-wrap: normal;
		overflow-x: auto;
	}
</style>
