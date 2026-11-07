# Static-site deployment

The site is built with Node.js but **runs as static HTML, JavaScript, CSS, images, PDFs and recordings**. No database or server process is necessary to serve the portfolio itself.

## Local production build

```bash
npm run verify
npm run preview
```

The generated `dist/` directory contains `index.html` at its root. Only this output should be published—not `node_modules/`, source notes, local credentials or build logs.

## AWS Amplify

[Read the complete AWS deployment guide](../../AWS_DEPLOYMENT.md).

The checked-in `amplify.yml` builds with `npm run verify` and publishes `dist/**/*`. This does **not** mean the site is already running on AWS. The currently linked AWS account explicitly denies relevant Amplify and S3 resource actions through an organization policy. Hosting must use an appropriately authorized account or an administrator-approved policy change.

## Vercel

`vercel.json` uses build command `npm run build` and output `dist`. A [verified V25.5 preview](https://inside-the-builders-mind-fvahtlv7c.vercel.app/) is available for comparison; it must not be described as AWS deployment or assumed to be identical to the main production domain.

## Domain and search metadata

The current `index.html`, `public/robots.txt`, `public/sitemap.xml`, social preview files and metadata audit target `https://inside-the-builders-mind.vercel.app/`.

**Do not replace these URLs in anticipation.** Only after the new AWS host is actually accessible should you choose the canonical domain, update social URLs, sitemap and JSON-LD, rerun the audit, and validate both direct and shared routes.

## Release process

1. Work on a new branch based on a verified release candidate.
2. Run static and browser checks.
3. Review a live preview and the artifact content.
4. Explicitly approve promotion to the intended environment.
5. Verify the public host, TLS, media, PDFs, canonical metadata and recovery path.

This documentation change alone does not create billable AWS resources or deploy production.
