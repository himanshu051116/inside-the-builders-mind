# AWS deployment: Inside the Builder's Mind

This deployment branch contains the verified V25.5 portfolio, including the original video and three résumés.

## Hosting choice

**AWS Amplify Hosting** is recommended for this dependency-free static site. It deploys the `dist/` artifact and serves it over HTTPS. The root `amplify.yml` runs `npm run verify` before publishing, so the build fails if tests or metadata audits fail.

### Required authorization

The AWS connector currently reports an explicit AWS Organizations **service control policy (SCP) deny** for `amplify:ListApps` in `ap-south-1` and `us-east-1`, and for `s3:CreateBucket`. These organization-level denies cannot be overridden by an ordinary IAM permission change.

To deploy, use an AWS account where AWS Amplify is allowed, or ask the organization's administrator to permit Amplify Hosting (and required supporting operations). Do not weaken organization-wide controls without review.

## Deploy directly from GitHub (recommended)

1. Sign in to an AWS account with Amplify Hosting permissions.
2. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/home).
3. Choose **Create new app** → **GitHub** and authorize the repository.
4. Select `himanshu051116/inside-the-builders-mind`.
5. Select branch `deploy/aws-amplify-ready`.
6. Confirm that Amplify detects the checked-in `amplify.yml`:
   - Build command: `npm run verify`
   - Output directory: `dist`
   - Artifact files: `**/*`
7. Review the build configuration and choose **Save and deploy**.
8. After the green build, open the Amplify-generated `https://<branch>.<app-id>.amplifyapp.com` URL and verify the homepage video, three résumé PDFs, complete archive, deep links, mobile layout and contact actions.

Amplify charges based on usage. Review its pricing and your account's billing alerts before publication.

## Alternative: manual static ZIP deployment

For a one-off deployment without connecting GitHub:

1. Clone this branch locally and run `npm run verify`.
2. Zip **the contents inside `dist/`**, not the `dist` directory itself. The ZIP root must contain `index.html` and `portfolio.css`.
3. In the Amplify Console choose **Create new app → Deploy without Git → Drag and drop**, upload the ZIP, and select **Save and deploy**.

Manual uploads do not automatically deploy future GitHub commits.

### Local Windows PowerShell example

```powershell
git clone --branch deploy/aws-amplify-ready --single-branch https://github.com/himanshu051116/inside-the-builders-mind.git
cd inside-the-builders-mind
npm run verify
Compress-Archive -Path (Join-Path (Get-Location) 'dist\*') -DestinationPath (Join-Path (Get-Location) 'portfolio-amplify.zip') -Force
```

## Release verification

Confirm:
- All project views, résumé links, original video playback and screenshots function.
- Archives remain click-to-open and natural-scroll, with the compact V25.5 close chip.
- `/#v20Archive`, a project deep link, and the original contact section resolve.
- No missing media requests or 404s in browser developer tools.
- No duplicate or stale hosting canonical URL configuration (check metadata before pointing a custom domain).

**No resources have been deployed by this repository preparation alone.**

AWS guidance:
- https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html
- https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html
- https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html
