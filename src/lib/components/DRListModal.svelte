<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { createQuery } from '@tanstack/svelte-query';
	import { dbUrl } from '$lib/store';
	import type { DependencyRelation, Project } from '$lib/model';
	import DRItem from '$lib/components/DRItem.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import XMark from '$lib/icons/XMark.svelte';

	export let project: Project | null = null;
	export let show: boolean;
	export let onSelect: (relation: DependencyRelation) => void;

	function closeModal() {
		show = false;
	}

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
		on:click={closeModal}
		on:keydown|preventDefault
	/>

	<div
		id="modal"
		class="fixed right-0 top-12 flex flex-col gap-2 overflow-y-auto bg-white p-2"
		transition:slide={{ duration: 200 }}
	>
		<div class="flex flex-row items-center justify-between">
			<h1 class="text-lg font-bold">Dependency Relations from SC to EL</h1>

			<IconButton icon={XMark} onClick={closeModal} />
		</div>

		{#if $relationsQuery.isSuccess}
			{#if $relationsQuery.data.length === 0}
				<div class="flex h-full flex-col items-center justify-center">
					<h1 class="text-sm text-gray-500">No dependency relations</h1>
				</div>
			{:else}
				{#each $relationsQuery.data as relation}
					<DRItem {relation} onSelect={() => onSelect(relation)} />
				{/each}
			{/if}
		{/if}
	</div>
{/if}

<style>
	#modal {
		height: calc(100vh - 3rem);
		max-width: calc(100vw - 192px - 256px);
	}
</style>
