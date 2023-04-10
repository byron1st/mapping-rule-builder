import type { Document } from 'mongodb';

export type Project = {
	name: string;
	created_at: Date;
} & Document;
