<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { createQuery } from '@tanstack/svelte-query';
	import { dbUrl } from '$lib/store';
	import type { DependencyRelation, Project } from '$lib/model';
	import DrItem from '$lib/components/DRItem.svelte';

	export let project: Project | null = null;
	export let show: boolean;
	export let onSelect: (relation: DependencyRelation) => void;

	$: relationsQuery = createQuery<DependencyRelation[], Error>({
		queryKey: [$dbUrl, project?._id, 'projects'],
		queryFn: async () => {
			const rawResponse = await fetch(`/api/relations?projectId=${project?._id ?? ''}`, {
				headers: { dbUrl: $dbUrl ?? '' }
			});
			const response = await rawResponse.json();
			if (!rawResponse.ok) throw new Error(response.message);

			return response;
		},
		enabled: Boolean($dbUrl && project)
	});
</script>

{#if show}
	<div
		class="fixed top-0 h-full w-full bg-slate-800/10"
		transition:fade={{ duration: 200 }}
		on:click={() => (show = false)}
		on:keydown|preventDefault
	/>

	<div
		id="modal"
		class="fixed bottom-0 flex h-80 flex-col gap-2 overflow-y-auto bg-white p-2"
		transition:slide={{ duration: 200 }}
	>
		<h1 class="text-lg font-bold">Dependency Relations from SC to EL</h1>

		{#if $relationsQuery.isSuccess}
			{#if $relationsQuery.data.length === 0}
				<div class="flex h-full flex-col items-center justify-center">
					<h1 class="text-sm text-gray-500">No dependency relations</h1>
				</div>
			{:else}
				{#each $relationsQuery.data as relation}
					<DrItem {relation} onSelect={() => onSelect(relation)} />
				{/each}
			{/if}
		{/if}
	</div>
{/if}

<style>
	#modal {
		width: calc(100vw - 28rem);
	}
</style>
