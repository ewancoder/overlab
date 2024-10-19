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
    public required DbSet<Exercise> Exercise { get; set; }
}

[Index(nameof(IsCanceled))]
public sealed class Workout
{
    public required string Id { get; set; }

    public ICollection<WorkoutExercise> WorkoutExercises { get; } = [];

    public required bool IsCanceled { get; set; }

    public string? Notes { get; set; }
}

public sealed class ExercisePlan
{
    public required long Id { get; set; }

    public required int OrderPosition { get; set; }

    // Navigation property for many-to-many relationship.
    public ICollection<Exercise> PossibleExercises { get; } = [];
}

[Index(nameof(IsFinished))]
public sealed class WorkoutExercise
{
    public required string Id { get; set; }

    public required ExercisePlan ExercisePlan { get; set; }
    public required long ExercisePlanId { get; set; }

    public string? Notes { get; set; }

    public ICollection<WorkoutExerciseSet> Sets { get; } = [];

    public required bool IsFinished { get; set; }

    public required Exercise Exercise { get; set; }
    public required string ExerciseId { get; set; }

    public required Workout Workout { get; set; }
    public required string WorkoutId { get; set; }
}

[Index(nameof(RecordedAtUtc))]
public sealed class WorkoutExerciseSet
{
    public required long Id { get; set; }

    public string? Notes { get; set; }

    public required decimal Weight { get; set; }

    public required string Reps { get; set; }

    public required DateTime RecordedAtUtc { get; set; }

    // Navigation property to make sure it's required.
    public required WorkoutExercise WorkoutExercise { get; set; }
    public required string WorkoutExerciseId { get; set; }
}

public sealed class Exercise
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }

    // Navigation property for many-to-many relationship.
    public ICollection<ExercisePlan> ExercisePlans { get; } = [];
}
