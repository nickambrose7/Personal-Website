# Application Structure

This site is a small Next.js App Router application that uses Nextra 4 to render most pages from Markdown/MDX content.

## Mental Model

- `app/` contains the actual Next.js routes.
- `content/` contains the page and post content that Nextra turns into pages.
- `components/` contains reusable React components used inside MDX files.
- `public/` contains static assets like images, fonts, and the resume PDF.
- `styles/` contains site-wide CSS.

## Routing

The main routing entry points are:

- [app/layout.tsx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/layout.tsx)
  This is the root layout for the whole site. It sets global metadata, loads global styles, renders the navbar/footer, and applies the Nextra blog layout.

- [app/[[...mdxPath]]/page.tsx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/[[...mdxPath]]/page.tsx)
  This is the catch-all route for content-driven pages. It asks Nextra to load the matching file from `content/` and render it.

- [app/posts/page.tsx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/posts/page.tsx)
  This is the custom posts index page. It lists blog posts and shows tag links.

- [app/tags/[tag]/page.tsx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/tags/[tag]/page.tsx)
  This renders a page for a single tag and filters posts to that tag.

- [app/feed.xml/route.ts](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/feed.xml/route.ts)
  This generates the RSS feed dynamically at `/feed.xml`.

## Content

Most visible site pages are just files in `content/`:

- [content/index.mdx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/index.mdx)
  Home page.

- [content/education.mdx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/education.mdx)
- [content/skills.mdx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/skills.mdx)
- [content/projects.mdx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/projects.mdx)
- [content/resume.mdx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/resume.mdx)

Blog posts live in:

- [content/posts/](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/posts)

The `_meta.js` files tell Nextra how to label and order sections in navigation:

- [content/_meta.js](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/_meta.js)
- [content/posts/_meta.js](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/content/posts/_meta.js)

## Blog/Post Data

- [app/posts/get-posts.ts](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/posts/get-posts.ts)
  This is the helper that reads the post tree from Nextra, normalizes post metadata, sorts posts by date, and extracts tags.

If you change post front matter, this file is the main place that controls how posts are collected for the posts page, tags page, and RSS feed.

## MDX Integration

- [mdx-components.tsx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/mdx-components.tsx)
  This exports the Nextra blog theme’s MDX component mapping. It controls how standard Markdown/MDX elements are rendered.

- [components/Project.js](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/components/Project.js)
- [components/SkillCard.js](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/components/SkillCard.js)
  These are custom React components used directly inside MDX content.

## Config and Styling

- [next.config.mjs](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/next.config.mjs)
  Enables Nextra for the Next.js app.

- [package.json](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/package.json)
  Defines the main development/build commands and top-level dependencies.

- [styles/main.css](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/styles/main.css)
  Global styling for typography and page-specific classes used in MDX.

## Typical Changes

- To edit page copy: change a file in `content/`.
- To add a new blog post: add a Markdown or MDX file in `content/posts/` and update post metadata as needed.
- To change navigation labels/order: edit a `_meta.js` file in `content/`.
- To change the overall site shell: edit [app/layout.tsx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/layout.tsx).
- To change how posts are listed, tagged, or syndicated: edit [app/posts/get-posts.ts](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/posts/get-posts.ts), [app/posts/page.tsx](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/posts/page.tsx), or [app/feed.xml/route.ts](/Users/nickambrose/Documents/Personal-Website/personal-website-nick/app/feed.xml/route.ts).
