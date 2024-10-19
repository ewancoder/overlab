using Microsoft.EntityFrameworkCore;

namespace OverLab.Api;

sealed file class MigrateDatabaseStartupFilter : IStartupFilter
{
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return async builder =>
        {
            await using var scope = builder.ApplicationServices.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<OverLabDbContext>();
            await dbContext.Database.MigrateAsync();
        };
    }
}

public static class RegistrationExtensions
{
    public static IServiceCollection AddOverLabDbContext(
        this IServiceCollection services, string connectionString)
    {
        services.AddDbContextPool<OverLabDbContext>(options =>
        {
            options.UseSnakeCaseNamingConvention();
            options.UseNpgsql(connectionString);
        }).AddTransient<IStartupFilter, MigrateDatabaseStartupFilter>();

        return services;
    }
}

public sealed class OverLabDbContext(DbContextOptions<OverLabDbContext> options) : DbContext(options)
{
    public required DbSet<Workout> Workout { get; set; }
}

public sealed class Workout
{
    public string Id { get; set; } = null!;
}
