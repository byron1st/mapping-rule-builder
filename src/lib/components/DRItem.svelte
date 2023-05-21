<script lang="ts">
	import classnames from 'classnames';
	import type { DependencyRelation } from '$lib/model';

	export let relation: DependencyRelation;
	export let onSelect: ((e: MouseEvent) => void) | undefined = undefined;
	export let selectedRelations: DependencyRelation[] = [];
	$: selected = selectedRelations.find((r) => r._id === relation._id) !== undefined;
</script>

<button
	class={classnames(
		'flex w-full flex-col rounded border border-slate-200 p-2 shadow active:bg-slate-100',
		{ 'bg-slate-100': selected }
	)}
	on:click={onSelect}
>
	<div class="flex flex-row items-center gap-1">
		<div
			class="flex h-4 shrink-0 flex-row items-center rounded bg-blue-500 px-2 font-mono text-xs text-white"
		>
			EL
		</div>

		<h1 class="break-all text-left font-mono text-sm font-bold">
			{relation.target}
		</h1>
	</div>

	<div class="flex flex-row items-center gap-1">
		<div
			class="flex h-4 shrink-0 flex-row items-center rounded bg-gray-500 px-2 font-mono text-xs text-white"
		>
			SC
		</div>

		<p class="break-all text-left font-mono text-xs">{relation.source}</p>
	</div>
</button>
