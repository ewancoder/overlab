1. Create backend/ project: Web API without anything, Solution.Api project name
2. Cleanup project, remove extra stuff. Create /diag endpoint returning current date
3. Copy .gitignore, .editorconfig, Directory.Build.props, Directory.Packages.props from another project, clean them up if needed
- Also update launchSettings.json like in other projects
- Add .editorconfig, Directory.*, README to Solution Items folder
- Review them, tweak csproj file
- Remove Container package from csproj, remove Docker profile from launchSetting. I don't need it for now
4. Add EF Core packages:
- npgsql.entityframeworkcore.postgresql
- EFCore.NamingConventions
5. Create DbContext:
- Name DbSets as Singular properties
- AddDbContextPool<DbContext>(options => UseSnakeCaseNamingConvention, UseNpgSql)
- Add my MigrateDatabaseStartupFilter (from other projects) for migration on startup
- [!!!] Look at examples of other DbContexts in other projects
6. Install Microsoft.EntityFrameworkCore.Design to Api/Startup project
7. cd into Api project and dotnet user-secrets init && dotnet user-secrets set DbConnectionString $connectionString
8. Create migration: dotnet ef migrations add Initial --project Solution.Api --startup-project Solution.Api
9. Add .github/workflows/deploy.yml (like in other projects, but without any tests for now) and set up all needed secrets on GitHub repo
10. Add basic docker-compose.yml (like in other projects) with postgresql
