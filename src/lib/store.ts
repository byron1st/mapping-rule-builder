import { writable } from 'svelte/store';
import type { Project } from '$lib/model';

export const dbUrl = writable<string | null>(null);
export const dbUrlStorageKey = 'dbUrl';

export const project = writable<Project | null>(null);
