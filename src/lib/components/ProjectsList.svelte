<script lang="ts">
	import { get } from 'svelte/store';
	import { createQuery } from '@tanstack/svelte-query';
	import { projectStore, dbUrlStore, dbUrlStorageKey } from '$lib/store';
	import type { Project } from '$lib/model';
	import CircleStack from '$lib/icons/CircleStack.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ProjectsListItem from '$lib/components/ProjectsListItem.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';

	let selectedProject: Project | null = null;
	$: projectStore.set(selectedProject);

	$: dbUrl = get(dbUrlStore);
	$: projectsQuery = createQuery<Project[], Error>({
		queryKey: [dbUrl, 'projects'],
		queryFn: async () => {
			const rawResponse = await fetch('/api/projects', { headers: { dbUrl: dbUrl ?? '' } });
			const response = await rawResponse.json();
			if (!rawResponse.ok) throw new Error(response.message);

			return response;
		},
		enabled: Boolean(dbUrl)
	});

	function openDBConfig() {
		const dbUrl = prompt('Type DB url');
		if (dbUrl) {
			dbUrlStore.set(dbUrl);
			localStorage.setItem(dbUrlStorageKey, dbUrl);
		}
	}
</script>

<Sidebar>
	<div slot="toolbar" class="flex w-full flex-row items-center justify-between px-2">
		<h1 class="text-sm font-bold">Projects</h1>
		<IconButton onClick={openDBConfig} icon={CircleStack} />
	</div>

	<div>
		{#if $projectsQuery.isLoading}
			<Loading />
		{:else if $projectsQuery.isError}
			<Error error={$projectsQuery.error.message} />
		{:else if $projectsQuery.isSuccess}
			{#each $projectsQuery.data as project}
				<ProjectsListItem
					{project}
					selected={selectedProject?._id === project._id}
					onClick={() => (selectedProject = project)}
				/>
			{/each}
		{/if}
	</div>
</Sidebar>
