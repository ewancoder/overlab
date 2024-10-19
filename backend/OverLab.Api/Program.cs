using OverLab.Api;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(o =>
{
    o.AddPolicy(name: "cors", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .WithHeaders("Authorization", "Content-Type");
    });
});

var connectionString = builder.Configuration["DbConnectionString"]
    ?? throw new InvalidOperationException("Could not get connection string for the database.");
builder.Services.AddOverLabDbContext(connectionString);

var app = builder.Build();
app.UseCors("cors");

DateTime? startedAt = null;
DateTime? lastExcerciseFinishedAt = null;
List<Set> sets = [];
Excercise? currentExcercise = null;

app.MapGet("/diag", () => DateTime.UtcNow);

app.MapGet("/api/workout/plan", () =>
{
    startedAt ??= DateTime.UtcNow;

    return new WorkoutPlan(
        "full-body-3",
        startedAt,
        lastExcerciseFinishedAt,
        [
            new("1", [ "deadlift" ]),
            new("2", [ "high-to-low-cable-fly" ]),
            new("3", [
                "chest-supported-row",
                "unilateral-db-row",
                "unilateral-cable-row",
                "machine-row",
                "lat-prayer"
            ], "machine-row"),
            new("4", [
                "skull-crusher",
                "unilateral-upright-cable-tricep-kickback",
                "overhead-cable-tricep-extension"
            ]),
            new("5", [
                "chest-supported-row",
                "unilateral-db-row",
                "unilateral-cable-row",
                "machine-row",
                "lat-prayer"
            ]),
            new("6", [ "incline-db-biceps-curl", "standing-db-biceps-curl" ])
        ]);
});

app.MapPost("/api/workout/sets", (AddSet addSet) =>
{
    if (startedAt is null || currentExcercise is null)
        return Results.BadRequest();

    sets.Add(new(DateTime.UtcNow, addSet.Weight, addSet.Reps));

    return Results.Ok(sets);
});

app.MapPost("/api/workout/excercise", (StartExcercise startExcercise) =>
{
    currentExcercise ??= new Excercise(
        "deadlift", "Deadlift", "Big ol' deadlift", "back", [
            new("back-muscle", MuscleGroupImpact.Primary),
            new("legs", MuscleGroupImpact.Primary),
            new("forearm", MuscleGroupImpact.Secondary),
            new("toes", MuscleGroupImpact.Minimal)
        ], [
            new(DateTime.UtcNow, 100, [ new(DateTime.UtcNow, 100, "5*+3")]),
            new(DateTime.UtcNow, 100, [ new(DateTime.UtcNow, 100, "5*+3")]),
            new(DateTime.UtcNow, 100, [ new(DateTime.UtcNow, 100, "5*+3")])
        ], ExcerciseType.BigCompound);

    return currentExcercise;
});

app.MapPost("/api/workout/excercise/finish", () =>
{
    currentExcercise = null;
    lastExcerciseFinishedAt = DateTime.UtcNow;
});

await app.RunAsync();

public sealed record WorkoutPlan(
    string Id,
    DateTime? StartedAt,
    DateTime? LastExcerciseFinishedAt,
    IEnumerable<WorkoutPlanExcercise> Excercises);

public sealed record WorkoutPlanExcercise(
    string Id,
    IEnumerable<string> ExcerciseIds,
    string? PerformedExcerciseId = null);

public sealed record AddSet(decimal Weight, string Reps);
public sealed record Set(DateTime Date, decimal Weight, string Reps);
public sealed record StartExcercise(string WorkoutExcerciseIndex, string ExcerciseId);
public sealed record Excercise(
    string Id,
    string Name,
    string Description,
    string Category,
    IEnumerable<MuscleGroup> MuscleGroups,
    IEnumerable<ExcerciseProgress> ProgressHistory,
    ExcerciseType Type);
public enum ExcerciseType
{
    Unset = 0,
    BigCompound = 1,
    Compound = 2,
    Isolation = 3
}
public sealed record MuscleGroup(
    string TypeId, MuscleGroupImpact Impact);
public enum MuscleGroupImpact
{
    Unknown = 0,
    Primary = 1,
    Secondary = 2,
    Minimal = 3
}
public sealed record ExcerciseProgress(
    DateTime Date,
    decimal Weight,
    IEnumerable<Set> Sets);
