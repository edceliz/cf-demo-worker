export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const { pathname } = url;

		// ================================================================
		// ROUTE 1: Home Page (matches "/secure" or "/secure/")
		// ================================================================
		if (pathname === '/secure' || pathname === '/secure/') {
			const email = request.headers.get('Cf-Access-Authenticated-User-Email') || 'No Access Header Found';
			const country = request.cf?.country || 'PH'; // Default to PH
			const timestamp = new Date().toISOString();

			const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Worker Request Details</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
            .card { border: 1px solid #e6e6e6; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 5px rgba(0,0,0,0.06); text-align: left; background: #fff; }
            h1 { color: #f6821f; }
            .item { margin-bottom: 1rem; }
            .label { font-weight: bold; color: #555; display: block; margin-bottom: 0.25rem; }
            .value { font-size: 1.2rem; }
            a.value { color: #0070f3; text-decoration: none; border-bottom: 1px dashed #0070f3; }
            a.value:hover { border-bottom-style: solid; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Request Details</h1>

            <div class="item">
              <span class="label">User Email:</span>
              <span class="value">${email}</span>
            </div>

            <div class="item">
              <span class="label">Country:</span>
              <a href="/secure/${country}" class="value">${country}</a>
            </div>

            <div class="item">
              <span class="label">Timestamp:</span>
              <span class="value">${timestamp}</span>
            </div>
          </div>
        </body>
        </html>
      `;

			return new Response(html, {
				headers: { 'content-type': 'text/html;charset=UTF-8' },
			});
		}

		// ================================================================
		// ROUTE 2: Flag Page (matches "/secure/XYZ")
		// ================================================================
		if (pathname.startsWith('/secure/')) {
			// Remove '/secure/' from the path to get just the country code
			const countryCode = pathname.replace('/secure/', '') || 'XX';

			// Use flagcdn (needs lowercase code)
			const flagUrl = `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

			const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Secure Country</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
            .card { border: 1px solid #e6e6e6; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 5px rgba(0,0,0,0.06); text-align: center; background: #fff; }
            h1 { color: #f6821f; font-size: 2.5rem; margin: 0 0 0.5rem 0; }
            .flag { width: 220px; height: auto; margin: 1rem 0; border-radius: 6px; border: 1px solid #eaeaea; }
            .meta { color: #555; margin-top: 0.5rem; }
            .back-link { display: inline-block; margin-top: 1rem; color: #0070f3; text-decoration: none; border-bottom: 1px dashed #0070f3; padding-bottom: 2px; }
            .back-link:hover { border-bottom-style: solid; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${countryCode}</h1>
            <img class="flag" src="${flagUrl}" alt="Flag of ${countryCode}"/>
            <div class="meta">Country code: <strong>${countryCode}</strong></div>
            <a href="/secure" class="back-link">← Back to Details</a>
          </div>
        </body>
        </html>
      `;

			return new Response(html, {
				headers: { 'content-type': 'text/html;charset=UTF-8' },
			});
		}

		return new Response('Page not found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
