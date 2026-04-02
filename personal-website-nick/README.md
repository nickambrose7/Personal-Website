# Portfolio Starter Kit

This portfolio is built with **Next.js** and a library called [Nextra](https://nextra.vercel.app/). Things included:

- Automatically configured to handle Markdown/MDX
- Generates an RSS feed based on your posts
- A beautiful theme included out of the box
- Easily categorize posts with tags
- Fast, optimized web font loading

https://demo.vercel.blog

## Configuration

1. Update your name in `theme.config.js` or change the footer.
1. Update your name and site URL for the RSS feed in `scripts/gen-rss.js`.
1. Update the meta tags in `pages/_document.tsx`.
1. Update the posts inside `pages/posts/*.md` with your own content.

## Run in Development
```bash
npm run dev
```

## Blog comments setup

This project now includes a first-party comments system built with:

- Next.js App Router route handlers
- Neon Postgres
- A lightweight password-protected admin page at `/admin/comments`

### 1. Create your environment file

Copy `.env.example` to `.env.local` and set:

- `DATABASE_URL`
- `COMMENTS_COOKIE_SECRET`
- `COMMENTS_ADMIN_PASSWORD` or `COMMENTS_ADMIN_PASSWORD_HASH`

### 2. Apply the schema in Neon

Run the SQL in `db/schema.sql` against your Neon database.

## Work inquiry leads setup

This project also includes a reusable lead-capture modal for work inquiries.

Set these environment variables before using it:

- `MAILERSEND_API_KEY`
- `LEADS_NOTIFICATION_TO_EMAIL`
- `LEADS_NOTIFICATION_FROM_EMAIL`
- `LEADS_NOTIFICATION_FROM_NAME`
- Optional: `LEADS_HASH_SECRET`

Lead submissions are stored in the `lead_submissions` table created by `db/schema.sql`.

### 3. Start the app

```bash
npm run dev
```

Public comments will appear on `/posts/*` pages. The admin UI lives at `/admin/comments`.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/blog)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/blog&project-name=portfolio&repository-name=portfolio)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example blog my-blog
# or
yarn create next-app --example blog my-blog
# or
pnpm create next-app --example blog my-blog
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
