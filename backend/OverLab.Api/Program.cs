using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

var plans = new[]
{
    new
    {
        Id = "full-body-3-3",
        Name = "3 day full body, day 3",
        Description = "The third day of a 3 day full body workout plan.",
        ExercisePlans = new[] { "deadlift", "chest", "all" }
    },
    new
    {
        Id = "full-body-3-1",
        Name = "3 day full body, day 1",
        Description = "The first day of a 3 day full body workout plan.",
        ExercisePlans = new[] { "chest", "all" }
    }
};

app.MapGet("/diag", () => DateTime.UtcNow);

app.MapGet("/api/exercises", async ([FromServices] OverLabDbContext context) => await context.Exercise.ToListAsync());
app.MapGet("/api/exercise-plans", async ([FromServices] OverLabDbContext context) => await context.ExercisePlans.Include(ep => ep.PossibleExercises).ToListAsync());

app.MapGet("/api/workout/current", async ([FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .Include(w => w.WorkoutExercises)
        .ThenInclude(we => we.Sets)
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout == null)
        return Results.NotFound("Workout is not started yet.");

    return Results.Ok(currentWorkout);
});

app.MapGet("/api/workout-plans", () => plans);
app.MapGet("/api/workout-plans/today", () => plans.FirstOrDefault(x => x.Id == "full-body-3-3"));
app.MapPost("/api/workout-plans/{planId}/start", async (string planId, [FromServices]OverLabDbContext context) =>
{
    var plan = plans.FirstOrDefault(p => p.Id == planId);
    if (plan == null)
        return Results.NotFound("Plan with such Id does not exist.");

    var currentWorkout = await context.Workout
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout != null)
        return Results.BadRequest("Workout is already in progress.");

    var workout = new Workout
    {
        Id = Guid.NewGuid().ToString(),
        IsCanceled = false,
        Notes = null,
        StartedAtUtc = DateTime.UtcNow
    };

    var plannedPlans = plan.ExercisePlans;

    foreach (var pi in plannedPlans)
    {
        // TODO: Do not create new Exercise plan here, get them by ExercisePlanId from the Plans.
        // And store unique list of ExercisePlans.
        var localPlan = await context.ExercisePlans
            .FirstOrDefaultAsync(p => p.Id == pi);

        if (localPlan == null)
            return Results.BadRequest("Did not find such exercise plan.");

        workout.WorkoutExercises.Add(new WorkoutExercise
        {
            Id = Guid.NewGuid().ToString(),
            ExercisePlan = localPlan,
            ExercisePlanId = pi,
            IsFinished = false,
            Workout = workout,
            WorkoutId = workout.Id
        });
    }

    await context.Workout.AddAsync(workout);
    await context.SaveChangesAsync();

    return Results.Ok(workout);
});

app.MapPost("/api/workout/cancel", async ([FromServices]OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout == null)
        return Results.BadRequest("No workout in progress.");

    currentWorkout.IsCanceled = true;
    await context.SaveChangesAsync();

    return Results.Ok(currentWorkout);
});

app.MapGet("/api/workout/exercises/current", async ([FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .Include(w => w.WorkoutExercises)
        .ThenInclude(we => we.Sets)
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout == null)
        return Results.BadRequest("No workout in progress.");

    var alreadyStartedExercise = currentWorkout.WorkoutExercises.SingleOrDefault(e => e.ExerciseId != null && !e.IsFinished);
    if (alreadyStartedExercise == null)
        return Results.NotFound("There is no already started exercise.");

    return Results.Ok(alreadyStartedExercise);
});

app.MapPost("/api/workout/exercises/{workoutExerciseId}/start/{exerciseId}", async (string workoutExerciseId, string exerciseId, [FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .Include(w => w.WorkoutExercises)
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout == null)
        return Results.BadRequest("No workout in progress.");

    var alreadyStartedExercise = currentWorkout.WorkoutExercises.SingleOrDefault(e => e.ExerciseId != null && !e.IsFinished);
    if (alreadyStartedExercise != null)
        return Results.BadRequest("There is already a started exercise.");

    var currentExercise = currentWorkout.WorkoutExercises.SingleOrDefault(e => e.Id == workoutExerciseId && !e.IsFinished);
    if (currentExercise == null)
        return Results.BadRequest("No exercise found in this plan, or it has already been finished.");

    var excercise = await context.Exercise.FindAsync(exerciseId);
    if (excercise == null)
        return Results.BadRequest("No such exercise.");

    currentExercise.Exercise = excercise;
    await context.SaveChangesAsync();

    return Results.Ok(currentExercise);
});

app.MapPost("/api/workout/sets", async (AddSet addSet, [FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .Include(w => w.WorkoutExercises)
        .ThenInclude(we => we.Sets)
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout == null)
        return Results.BadRequest("No workout in progress.");

    var currentExercise = currentWorkout.WorkoutExercises.SingleOrDefault(e => e.ExerciseId != null && !e.IsFinished);
    if (currentExercise == null)
        return Results.BadRequest("No exercise in progress.");

    currentExercise.Sets.Add(new WorkoutExerciseSet
    {
        Id = 0,
        RecordedAtUtc = DateTime.UtcNow,
        Reps = addSet.Reps,
        Weight = addSet.Weight,
        Notes = addSet.Notes,
        WorkoutExercise = currentExercise,
        WorkoutExerciseId = currentExercise.Id
    });

    await context.SaveChangesAsync();

    return Results.Ok(currentExercise);
});

app.MapPost("/api/workout/exercises/finish", async ([FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .Include(w => w.WorkoutExercises)
        .ThenInclude(we => we.Sets)
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout == null)
        return Results.BadRequest("No workout in progress.");

    var currentExercise = currentWorkout.WorkoutExercises.SingleOrDefault(e => e.ExerciseId != null && !e.IsFinished);
    if (currentExercise == null)
        return Results.BadRequest("No exercise in progress.");

    if (currentExercise.Sets.Count == 0)
        return Results.BadRequest("No sets were recorded yet. Cancel instead of finishing.");

    currentExercise.IsFinished = true;
    await context.SaveChangesAsync();
    return Results.Ok(currentExercise);
});

app.MapPost("/api/workout/exercises/cancel", async ([FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout == null)
        return Results.BadRequest("No workout in progress.");

    var currentExercise = currentWorkout.WorkoutExercises.SingleOrDefault(e => e.ExerciseId != null && !e.IsFinished);
    if (currentExercise == null)
        return Results.BadRequest("No exercise in progress.");

    if (currentExercise.Sets.Count > 0)
        return Results.BadRequest("Cannot cancel once you started lifting. Finish instead.");

    currentExercise.Exercise = null;
    await context.SaveChangesAsync();
    return Results.Ok(currentExercise);
});

app.MapPost("/api/workout/exercises/{exercisePlanId}", async (string exercisePlanId, [FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout is null)
        return Results.BadRequest("No workout in progress.");

    var exercisePlan = await context.ExercisePlans.FindAsync(exercisePlanId);
    if (exercisePlan is null)
        return Results.BadRequest("No such exercise plan found.");

    var newExercise = new WorkoutExercise
    {
        Id = Guid.NewGuid().ToString(),
        ExercisePlan = exercisePlan,
        ExercisePlanId = exercisePlan.Id,
        IsFinished = false,
        Workout = currentWorkout,
        WorkoutId = currentWorkout.Id
    };
    currentWorkout.WorkoutExercises.Add(newExercise);

    await context.SaveChangesAsync();
    return Results.Ok(newExercise);
});

app.MapDelete("/api/workout/exercises/{workoutExerciseId}", async (string workoutExerciseId, [FromServices] OverLabDbContext context) =>
{
    var currentWorkout = await context.Workout
        .FirstOrDefaultAsync(w => !w.IsCanceled && w.StartedAtUtc.Date == DateTime.UtcNow.Date);

    if (currentWorkout is null)
        return Results.BadRequest("No workout in progress.");

    var workoutExercise = currentWorkout.WorkoutExercises.FirstOrDefault(x => x.Id == workoutExerciseId);
    if (workoutExercise is null)
        return Results.BadRequest("Could not find this workout exercise.");

    if (workoutExercise.Sets.Count > 0)
        return Results.BadRequest("Cannot remove an exercise from workout that already has been performed.");

    currentWorkout.WorkoutExercises.Remove(workoutExercise);
    await context.SaveChangesAsync();
    return Results.Ok(workoutExercise);
});

app.MapPut("/api/workout/exercises/{workoutExerciseId}", async (string workoutExerciseId, UpdateWorkoutExercise update, [FromServices] OverLabDbContext context) =>
{
    var workoutExercise = await context.WorkoutExercise.FindAsync(workoutExerciseId);
    if (workoutExercise == null)
        return Results.NotFound("No such workout exercise.");

    workoutExercise.Notes = update.Notes;
    return Results.Ok(workoutExercise);
});

app.MapPut("/api/workout/{workoutId}", async (string workoutId, UpdateWorkout update, [FromServices] OverLabDbContext context) =>
{
    var workout = await context.Workout.FindAsync(workoutId);
    if (workout == null)
        return Results.NotFound("No such workout.");

    workout.Notes = update.Notes;
    return Results.Ok(workout);
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

public sealed record AddSet(decimal Weight, string Reps, string? Notes);
public sealed record Set(DateTime Date, decimal Weight, string Reps);
public sealed record StartExcercise(string WorkoutExerciseId, string ExcerciseId);
/*public sealed record Excercise(
    string Id,
    string Name,
    string Description,
    string Category,
    IEnumerable<MuscleGroup> MuscleGroups,
    IEnumerable<ExcerciseProgress> ProgressHistory,
    ExcerciseType Type);*/
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
public sealed record UpdateWorkoutExercise(string Notes);
public sealed record UpdateWorkout(string Notes);
public sealed record AddExercise(string ExercisePlanId);
