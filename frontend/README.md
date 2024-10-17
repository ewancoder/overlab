This documentation contains a full list of actions for creating this project.

1. `ng new overlab`
2. Change `prefix` in `angular.json` to `olab`, change prefix in templates: `app.component.ts`, `index.html`
3. Copy `prettierrc.json` from other projects (install Prettier VS Code extension if not installed and configure formatter to use it by default)
4. Install Prettier: `npm install prettier -D` // I need this, otherwise it doesn't recognize angular templates.
5. Go through all files in `src`, remove content from thml, rename css to scss & update ts to point to it, remove spec test file
6. Enable zoneless change detection (follow Angular guide)
- `npm uninstall zone.js`
- Remove zone pollyfills from `angular.json`
7. Go through files outside of `src` and remove comments
8. Place correct favicon.ico to `public` folder
9. Go through components (app.component.ts) and use ChangeDetectionStrategy.OnPush (do this for future components always)
10. Remove `title` field from app.component.ts
11. Adjust Title in index.html if needed
12. Add `withComponentInputBinding()` to router
13. Add eslint: `ng add @angular-eslint/schematics --skip-confirmation`
14. Add `provideHttpClient()` to providers
