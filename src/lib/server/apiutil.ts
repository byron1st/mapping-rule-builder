import { error, type HttpError } from '@sveltejs/kit';

export function logAndThrowError(msg: string, err: unknown): HttpError {
	console.error(err);
	return error(500, `${msg}: ${err instanceof Error ? err.message : err}`);
}
