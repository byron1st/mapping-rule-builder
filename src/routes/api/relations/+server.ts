import { error, json } from '@sveltejs/kit';
import { convertId, getCol } from '$lib/server/dbutil';
import type { Project } from '$lib/model';
import type { RequestHandler } from './$types';
import { logAndThrowError } from '$lib/server/apiutil';

export const GET = (async ({ request }) => {
	const dbUrl = request.headers.get('dbUrl');
	if (!dbUrl) throw error(400, 'Missing dbUrl header');

	try {
		const drsCol = await getCol<Project>(dbUrl, 'drs');
		const drs = (await drsCol.find({}).sort({ target: 1 }).toArray()).map(convertId);

		return json(drs);
	} catch (err) {
		throw logAndThrowError('Failed to get dependency relations', err);
	}
}) satisfies RequestHandler;
