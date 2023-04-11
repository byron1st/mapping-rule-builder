import type { Document } from 'mongodb';

export type Project = {
	name: string;
	created_at: Date;
} & Document;

export type MappingRule = {
	procedure: string;
	sourceComponentIdentifierSchema: string[];
	targetComponentIdentifierSchema: string[];
} & Document;

export type DependencyRelation = {
	source: string;
	target: string;
} & Document;
