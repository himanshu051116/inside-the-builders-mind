# GitHub → Vercel deployment checklist (V9)

## Status

- Source: complete and tested locally.
- GitHub: not yet published. New repository creation is required.
- Vercel: not yet deployed. No project was created or modified.
- AWS: intentionally untouched.

## One GitHub website action needed

1. Sign in as `himanshu051116` at https://github.com/new
2. Repository name: `inside-the-builders-mind`
3. Set visibility to **Public** (the challenge requires a linked repository).
4. Leave **Add a README file**, `.gitignore`, and license **unchecked**. Create an EMPTY repository so the first push is straightforward.
5. Click **Create repository**.
6. Extract the provided source ZIP and run the included `publish-to-github.ps1` script in PowerShell (or use its documented Git commands). It uses normal GitHub login; do not paste access tokens into ChatGPT.
7. Share the created repository URL here. I can then connect it to your already-linked Vercel account and verify the deployment.

## Intended Vercel settings

- GitHub repository: `himanshu051116/inside-the-builders-mind`
- Vercel team: `himanshusubh1510-3246s-projects`
- Vercel project: `inside-the-builders-mind`
- Framework: **Other** / static
- Project root: repository root
- Build: `npm run build`
- Output: `dist`
- Production branch: `main`

This source includes a `vercel.json` with the build/output settings.

## Verification after Vercel deployment

- Home returns HTTP 200 over HTTPS without authentication.
- `/?view=fullstack`, `/?view=software`, `/?view=ml` each initialize correctly.
- Three public résumé PDFs load as PDFs and lack a phone number.
- Site images, CSS and module scripts load successfully.
- Three project experiences and Evidence Workbench behave correctly.
- Responsive checks at 320, 390, 768 and 1440 px.
- External GitHub, LinkedIn, OHS and project links open to intended destinations.
- No browser console errors / no unexpected exposure of secrets.
- Once verified, publish a separate AWS Amplify build for the challenge before its deadline.

## Known caution

The V9 visual demos are conceptual/synthetic, not live integrations with the user's other projects. The Evidence Workbench is a local simulation. A real Vercel URL is not available until Vercel has successfully deployed.
