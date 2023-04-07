<script lang="ts">
	import MappingRuleForms from '$lib/components/MappingRuleForms.svelte';
	import MappingRulesList from '$lib/components/MappingRulesList.svelte';
	import ProjectsList from '$lib/components/ProjectsList.svelte';
</script>

<div class="flex min-h-screen flex-row items-stretch">
	<div class="flex w-48 flex-col border-r border-r-slate-900/10">
		<ProjectsList />
	</div>

	<div class="flex w-64 flex-col border-r border-r-slate-900/10">
		<MappingRulesList />
	</div>

	<div class="flex flex-1 flex-col bg-white">
		<MappingRuleForms />
	</div>
</div>
