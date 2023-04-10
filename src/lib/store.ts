import { writable } from 'svelte/store';
import type { Project } from '$lib/model';

export const dbUrlStore = writable<string | null>(null);
export const dbUrlStorageKey = 'dbUrl';

export const projectStore = writable<Project | null>(null);
