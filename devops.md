# New project guide

Instructions for creating a new pet project.

$folderName = overlab
$solutionName = OverLab
$apiProjectName = OverLab.Api
$frontendProjectName = overlab
$angularPrefix = olab

## Backend

- Create folder $folderName, cd to it
- Create new solution, with the name $solutionName, project $apiProjectName, type WebAPI
- Rename folder to "backend"
- Create this devops.md file if updated instructions are in order
- Save solution as slnx, remove sln
- Add README and LICENSE (basic descriptions, and MIT) [to root folder]
- Add .gitignore to root folder
- Add .gitignore, .editorconfig, Directory.Build.props, Directory.Packages.props [to backend folder]
- Remove everything from csproj, add needed packages
- Add TYR HostExtensions.cs, modify Program.cs
- Delete appsettings, tweak launchsettings
- Tweak .http file
- Add dockerfile (using ide, with .dockerignore), remove EXPOSE, add copying props files, use chiseled images, add healthcheck (check example)
- Add docker-compose to root for dev and for prod (swarm and not), see example, also copy and modify .env files
- Add .github actions (and rename everything for this project)
- Set up repo secrets
- Save as SLN (and re-save when projects are added) - we need SLN for backward compatibility with Stryker unfortunately

## DB

- Also create initial migration:
  - dbmate new initial
  - CREATE TABLE initial();DROP TABLE initial();

## Frontend

Need to do this straight away for deployments to work.

- Install Prettier & ESLint to VS Code / Rider (already isntalled in Rider), turn on Automatic prettier in Rider + Run on save, Automatic ESLint + Fix on save
- `ng new $frontendProjectName --prefix $angularPrefix --directory frontend --skip-tests --experimental-zoneless --style scss --defaults true`
- Remove zone.js from package.json, remove node_modules & package-lock, run pnpm i (use pnpm)
- `pnpm i --save-dev prettier`
- Copy .prettierrc.json, test that it works
- `ng add @angular-eslint/schematics --skip-confirmation`
- Change indent to 4 characters for *.ts in editorconfig, leave 2 for everything else
- Update favicon
- Use OnPush in `app.component.ts`, remove title field, adjust title in `index.html`
- Create Dockerfile (copy from example), copy Nginx config file
- Copy src/config.ts (and dev config), docker build won't work without it
- Copy/install shared Framework files (auth module / http) if needed (still WIP, copy parts that are needed when needed)
- `ng generate config karma`, `pnpm i --save-dev karma-sabarivka-reporter`, configure coverage as in the example (karma.conf.json file)
- Go through all files, re-save them, remove extra comments or unneeded data
- Create simple test file for .NET project, simple test file for Angular project (for CI to work)
- Install these manually (needed because of pnpm): with save-dev: @stryker-mutator/core, @stryker-mutator/karma-runner
- Copy and edit sonar-properties file
- Copy stryker.config.json (do not init it, we need to also alter it so easier to copy)

- Set up sonarcloud monorepo for these 2 projects
- After pushing from main, add develop as long-lived branch to both projects

- Add badges to README (use example)

## Repo secrets

- GIST_SECRET: profile, settings, developer settings, PAT tokens (classic), infinite token with gist permission
- HOST, USERNAME, PASSWORD, KEY, PORT
- HOST_DEV, USERNAME_DEV, PASSWORD_DEV, KEY_DEV, PORT_DEV
- API_SONAR_TOKEN, WEB_SONAR_TOKEN

## How to change package scope for ghcr package (super unintuitive and frustrating hence the guide)

1. Go to "Your profile" after clicking personal photo in github top right corner
2. Click "Packages" tab
3. Search for package, click settings on the bottom right
4. Just delete the package at the bottom lol faster and easier
4.1. OR - add repository (button on the right, prior to the list of repositories)

- Also don't forget to copy data on server & add new Seq API keys.

