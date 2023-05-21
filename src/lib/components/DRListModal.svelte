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
	export let onSelect: (relations: DependencyRelation[]) => void;
	export let multiSelect = false;
	export let showSelectButton = false;

	let selectedRelations: DependencyRelation[] = [];

	function closeModal() {
		show = false;
	}

	function onSelectItem(relation: DependencyRelation): (e: MouseEvent) => void {
		return (e) => {
			if (multiSelect && e.shiftKey) {
				if (!showSelectButton) showSelectButton = true;
				selectedRelations = !selected(relation)
					? [...selectedRelations, relation]
					: [...selectedRelations.filter((r) => r._id !== relation._id)];
			} else {
				onSelect([relation]);
			}
		};
	}

	function onSelectMultipleRelations() {
		onSelect(selectedRelations);
	}

	function selected(relation: DependencyRelation): boolean {
		return selectedRelations.find((r) => r._id === relation._id) !== undefined;
	}

	function cancelSelect() {
		selectedRelations = [];
		showSelectButton = false;
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
		class="fixed right-0 top-12 flex flex-col gap-2 bg-white p-2"
		transition:slide={{ duration: 200 }}
	>
		<div class="flex flex-row items-center justify-between">
			<h1 class="text-lg font-bold">Dependency Relations from SC to EL</h1>

			<IconButton icon={XMark} onClick={closeModal} />
		</div>

		<div class="flex flex-row justify-end gap-2">
			{#if showSelectButton}
				<button
					class="h-6 rounded bg-gray-500 px-2 text-white active:bg-gray-700"
					on:click={cancelSelect}
					transition:fade={{ duration: 200 }}
				>
					Cancel
				</button>
				<button
					class="h-6 rounded bg-blue-500 px-2 text-white active:bg-blue-700"
					on:click={onSelectMultipleRelations}
					transition:fade={{ duration: 200 }}
				>
					Create
				</button>
			{:else}
				<div class="h-6" />
			{/if}
		</div>

		<div id="list" class="overflow-y-auto">
			{#if $relationsQuery.isSuccess}
				{#if $relationsQuery.data.length === 0}
					<div class="flex h-full flex-col items-center justify-center">
						<h1 class="text-sm text-gray-500">No dependency relations</h1>
					</div>
				{:else}
					{#each $relationsQuery.data as relation}
						<DRItem {relation} onSelect={onSelectItem(relation)} {selectedRelations} />
					{/each}
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	#modal {
		height: calc(100vh - 3rem);
		max-width: calc(100vw - 192px - 256px);
	}
	#list {
		height: calc(100vh - 1rem - 1.75rem - 1.5rem - 0.5rem);
	}
</style>
