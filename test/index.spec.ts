import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('Worker Request Details (unit)', () => {
	it('returns HTML with request details', async () => {
		const request = new Request('http://example.com/secure');
		// call fetch directly; cast to any to avoid needing full Env/Context types
		const response = await (worker as any).fetch(request, {} as any, {} as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toMatch(/text\/html/);

		const body = await response.text();
		expect(body).toContain('Request Details');
		expect(body).toContain('User Email:');
		expect(body).toContain('No Access Header Found');
		expect(body).toContain('/secure/PH');
		// ISO timestamp (simple check)
		expect(body).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
	});

	it('returns HTML with flag', async () => {
		const request = new Request('http://example.com/secure/PH');
		// call fetch directly; cast to any to avoid needing full Env/Context types
		const response = await (worker as any).fetch(request, {} as any, {} as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toMatch(/text\/html/);

		const body = await response.text();
		expect(body).toContain('PH');
	});

	it('returns HTML with flag', async () => {
		const request = new Request('http://example.com/secure/PH-r2');
		// call fetch directly; cast to any to avoid needing full Env/Context types
		const response = await (worker as any).fetch(request, {} as any, {} as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toMatch(/text\/html/);

		const body = await response.text();
		expect(body).toContain('PH');
	});
});
