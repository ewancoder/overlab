using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace OverLab.Api;

// TODO: This will cause contention if I have multiple instances of the service.
sealed file class MigrateDatabaseStartupFilter : IStartupFilter
{
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return async builder =>
        {
            // HACK: A workaround, otherwise endpoints don't start for some reason.
            next(builder);

            {
                await using var scope = builder.ApplicationServices.CreateAsyncScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<OverLabDbContext>();
                await Task.Delay(10000);
                await dbContext.Database.MigrateAsync();
            }

            {
                await using var scope = builder.ApplicationServices.CreateAsyncScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<OverLabDbContext>();
                await SeedDatabase(dbContext);
            }
        };
    }

    private readonly Exercise[] _exercises = [
        new Exercise
        {
            Id = "deadlift",
            Name = "Deadlift",
            Description = "Deadlift"
        },
        new Exercise
        {
            Id = "low-to-high-cable-fly",
            Name = "Low to High Cable Fly",
            Description = "Low to High Cable Fly"
        }
    ];

    private sealed record ExercisePlanMapping(string Id, string[] ExerciseIds);
    private readonly ExercisePlanMapping[] _exercisePlans = [
        new ExercisePlanMapping("deadlift", ["deadlift"]),
        new ExercisePlanMapping("chest", ["low-to-high-cable-fly"]),
        new ExercisePlanMapping("all", ["low-to-high-cable-fly", "deadlift"])
    ];

    private async ValueTask SeedDatabase(OverLabDbContext context)
    {
        foreach (var exercise in _exercises)
        {
            var existing = await context.Exercise.FirstOrDefaultAsync(e => e.Id == exercise.Id);
            if (existing is null)
                await context.Exercise.AddAsync(exercise);
            else
            {
                existing.Name = exercise.Name;
                existing.Description = exercise.Description;
            }
        }

        await context.SaveChangesAsync();

        foreach (var plan in _exercisePlans)
        {
            var existing = await context.ExercisePlans
                .Include(ep => ep.PossibleExercises)
                .FirstOrDefaultAsync(e => e.Id == plan.Id);
            var exercises = new List<Exercise>();
            foreach (var exerciseId in plan.ExerciseIds)
            {
                var exercise = await context.Exercise.FirstAsync(e => e.Id == exerciseId);
                exercises.Add(exercise);
            }

            if (existing is null)
            {
                var newPlan = new ExercisePlan { Id = plan.Id, Name = plan.Id, Description = plan.Id };
                newPlan.PossibleExercises.AddRange(exercises);

                await context.ExercisePlans.AddAsync(newPlan);
            }
            else
            {
                existing.PossibleExercises.Clear();
                existing.PossibleExercises.AddRange(exercises);
            }
        }

        await context.SaveChangesAsync();
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
    public required DbSet<WorkoutExercise> WorkoutExercise { get; set; }
    public required DbSet<ExercisePlan> ExercisePlans { get; set; }
}

[Index(nameof(IsCanceled))]
public sealed class Workout
{
    public required string Id { get; set; }

    public ICollection<WorkoutExercise> WorkoutExercises { get; } = [];

    public required DateTime StartedAtUtc { get; set; }

    public required bool IsCanceled { get; set; }

    public string? Notes { get; set; }
}

// There can be many exercise plans to pick from. When adding another plan to a workout, you select a plan, not a specific exercise.
// Unless you select a specific exercise. Then first you create a new dynamic plan with just one exercise, and after it you add it to the workout.
public sealed class ExercisePlan
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }

    // Navigation property for many-to-many relationship.
    public List<Exercise> PossibleExercises { get; } = [];
}

[Index(nameof(IsFinished))]
public sealed class WorkoutExercise
{
    public required string Id { get; set; }

    [JsonIgnore]
    public ExercisePlan ExercisePlan { get; set; } = null!;
    public required string ExercisePlanId { get; set; }

    public string? Notes { get; set; }

    public ICollection<WorkoutExerciseSet> Sets { get; } = [];

    public required bool IsFinished { get; set; }

    [JsonIgnore]
    public Exercise? Exercise { get; set; }
    public string? ExerciseId { get; set; }

    [JsonIgnore]
    public Workout Workout { get; set; } = null!;
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
    [JsonIgnore]
    public WorkoutExercise WorkoutExercise { get; set; } = null!;
    public required string WorkoutExerciseId { get; set; }
}

public sealed class Exercise
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }

    // Navigation property for many-to-many relationship.
    [JsonIgnore]
    public ICollection<ExercisePlan> ExercisePlans { get; } = [];
}
