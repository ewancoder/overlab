# New Tyr pet project, with complete instructions on bootstrapping it from scratch

For the sake of this example, $PROJECT_NAME=overlab

- mkdir $PROJECT_NAME
- cd $PROJECT_NAME
- git init
- vim README.MD # this file, to start writing this instruction

## Frontend

- install prettier & eslint extensions to VS Code
- `ng new overlab --prefix olab --directory frontend --skip-tests --experimental-zoneless --style scss --defaults true`
- remove zone.js from package.json, remove node_modules, run npm i again
- npm install --save-dev prettier
- copy prettierrc.json from another project, configure vscode
- `ng add @angular-eslint/schematics --skip-confirmation`
- go through all files, re-save them, remove extra comments or unneeded data
- change indent to 4 characters in editorconfig
- update favicon
- use OnPush change detection in app.component.ts, remove title field, adjust Title in Index.html
- add README & LICENSE files to the root of the repo
- rename branch to main, commit initial commit
