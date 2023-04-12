<script lang="ts">
	import classnames from 'classnames';
	import { createQuery } from '@tanstack/svelte-query';
	import type { MappingRule, Project } from '$lib/model';
	import { dbUrl } from '$lib/store';
	import MappingRuleForms from '$lib/components/MappingRuleForms.svelte';
	import MappingRulesListItem from '$lib/components/MappingRulesListItem.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';
	import { setContext } from 'svelte';

	export let project: Project | null = null;

	let selectedMappingRule: MappingRule | null = null;

	$: mappingRulesQuery = createQuery<MappingRule[], Error>({
		queryKey: [$dbUrl, project?._id, 'mappingrules'],
		queryFn: async () => {
			const rawResponse = await fetch(`/api/mappingrules?projectId=${project?._id ?? ''}`, {
				headers: { dbUrl: $dbUrl ?? '' }
			});
			const response = await rawResponse.json();
			if (!rawResponse.ok) throw new Error(response.message);

			return response;
		},
		enabled: Boolean($dbUrl && project)
	});
	$: setContext('refetchMappingRules', async () => {
		await $mappingRulesQuery.refetch();
	});
</script>

<div class="flex w-64 flex-col border-r border-r-slate-900/10">
	<Sidebar>
		<div class="px-2" slot="toolbar">
			<h1 class="text-sm font-bold">Mapping Rules</h1>
		</div>

		{#if !$dbUrl || !project}
			<div class="flex h-full flex-col items-center justify-center">
				<h1 class="text-sm text-gray-500">Select a project</h1>
			</div>
		{:else if $mappingRulesQuery.isLoading}
			<Loading />
		{:else if $mappingRulesQuery.isError}
			<Error error={$mappingRulesQuery.error.message} />
		{:else if $mappingRulesQuery.isSuccess}
			{#if $mappingRulesQuery.data.length === 0}
				<div class="flex h-full flex-col items-center justify-center">
					<h1 class="text-sm text-gray-500">No mapping rules</h1>
				</div>
			{:else}
				<div>
					{#each $mappingRulesQuery.data as mappingRule, index}
						{#if index === 0 || $mappingRulesQuery.data[index - 1].connectorType !== mappingRule.connectorType}
							<h1
								class={classnames('text-xs font-bold text-gray-500', {
									'mt-6': index !== 0
								})}
							>
								{mappingRule.connectorType}
							</h1>
						{/if}

						<MappingRulesListItem
							{mappingRule}
							onClick={() => (selectedMappingRule = mappingRule)}
							selected={selectedMappingRule?._id === mappingRule._id}
						/>
					{/each}
				</div>
			{/if}
		{/if}
	</Sidebar>
</div>

<div class="flex flex-1 flex-col bg-white">
	<MappingRuleForms bind:project bind:mappingRule={selectedMappingRule} />
</div>
