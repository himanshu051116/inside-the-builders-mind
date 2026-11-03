# Run this from the extracted inside-the-builders-mind directory.
# Safely publishes V9 into the already-created repository, which currently has an initial README.
$ErrorActionPreference = 'Stop'
$source = $PSScriptRoot
$repo = 'https://github.com/himanshu051116/inside-the-builders-mind.git'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git for Windows is required. Install it and sign in to your GitHub account.' }
if (-not (Test-Path (Join-Path $source 'package.json'))) { throw 'The project source is missing; extract the entire ZIP first.' }
$temporary = Join-Path ([IO.Path]::GetTempPath()) ('inside-builders-mind-publish-' + [Guid]::NewGuid().ToString('N'))
try {
  git clone --branch main --single-branch $repo $temporary
  if ($LASTEXITCODE -ne 0) { throw 'Git clone failed. Check your GitHub login and repository access.' }
  $existing = @(Get-ChildItem -Force -LiteralPath $temporary | Where-Object { $_.Name -notin @('.git', 'README.md') })
  if ($existing.Count -gt 0) { throw 'Repository contains more than the initial README. Stopped to avoid overwriting work. Review it before publishing.' }
  foreach ($file in Get-ChildItem -Force -LiteralPath $source) {
    if ($file.Name -in @('.git','dist','node_modules','.env','.vercel','.vscode')) { continue }
    if ($file.Name -like '.env.*' -or $file.Name -like '*.log') { continue }
    Copy-Item -LiteralPath $file.FullName -Destination $temporary -Recurse -Force
  }
  git -C $temporary add --all
  if ($LASTEXITCODE -ne 0) { throw 'Staging failed.' }
  git -C $temporary diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { Write-Host 'GitHub already has the same source.'; exit 0 }
  git -C $temporary commit -m 'Publish Inside the Builders Mind V9 portfolio'
  if ($LASTEXITCODE -ne 0) { throw 'Git commit failed. Configure Git user.name and user.email.' }
  git -C $temporary push origin main
  if ($LASTEXITCODE -ne 0) { throw 'Push failed. The remote may have changed; no force push was attempted.' }
  Write-Host 'Successfully published V9 to https://github.com/himanshu051116/inside-the-builders-mind' -ForegroundColor Green
}
finally {
  if (Test-Path $temporary) { Remove-Item $temporary -Recurse -Force }
}
