<script lang="ts">
	import MappingRulesListItem from '$lib/components/MappingRulesListItem.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { MappingRule } from '$lib/model';

	// TODO: Read mapping rules from the server
	const testMappingRule: MappingRule[] = [
		{
			_id: 'test-id1',
			procedure: 'com.example.Test.test1',
			sourceComponentIdentifierSchema: ['Host', 'Port'],
			targetComponentIdentifierSchema: ['Host', 'Port']
		},
		{
			_id: 'test-id2',
			procedure: 'com.example.package.anotherpackage.Test.test2',
			sourceComponentIdentifierSchema: ['Host', 'Port'],
			targetComponentIdentifierSchema: []
		},
		{
			_id: 'test-id3',
			procedure: 'com.example.Test.test2',
			sourceComponentIdentifierSchema: ['Host', 'Port'],
			targetComponentIdentifierSchema: ['Host', 'Port']
		}
	];

	let selectedMappingRule: MappingRule | null = null;
</script>

<Sidebar>
	<div class="px-2" slot="toolbar">
		<h1 class="text-sm font-bold">Mapping Rules</h1>
	</div>

	<div>
		{#each testMappingRule as mappingRule}
			<MappingRulesListItem
				{mappingRule}
				onClick={() => (selectedMappingRule = mappingRule)}
				selected={selectedMappingRule?._id === mappingRule._id}
			/>
		{/each}
	</div>
</Sidebar>
