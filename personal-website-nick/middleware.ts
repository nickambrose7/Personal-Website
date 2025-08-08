import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Site Temporarily Closed</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body { display: flex; align-items: center; justify-content: center; background: #0b0f19; color: #e5e7eb; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      .card { text-align: center; padding: 32px 28px; border: 1px solid #1f2937; background: #111827; border-radius: 12px; max-width: 560px; box-shadow: 0 10px 25px rgba(0,0,0,.35); }
      h1 { font-size: 28px; margin: 0 0 8px; }
      p { margin: 8px 0 0; line-height: 1.5; color: #9ca3af; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>We’ll be back soon</h1>
      <p>The site is temporarily closed for maintenance. Please check back later.</p>
    </main>
  </body>
</html>`;

  return new Response(html, {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'retry-after': '3600'
    }
  });
}

export const config = {
  matcher: '/:path*'
};


