<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { dbUrlStore, dbUrlStorageKey } from '$lib/store';
	import '../app.css';
	import { browser } from '$app/environment';

	const queryClient = new QueryClient();

	$: {
		if (browser) {
			const dbUrl = localStorage.getItem(dbUrlStorageKey);
			if (dbUrl) dbUrlStore.set(dbUrl);
		}
	}
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
