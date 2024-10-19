using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace OverLab.Api.Migrations;

/// <inheritdoc />
public partial class Initial : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "exercise",
            columns: table => new
            {
                id = table.Column<string>(type: "text", nullable: false),
                name = table.Column<string>(type: "text", nullable: false),
                description = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_exercise", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "exercise_plan",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                order_position = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_exercise_plan", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "workout",
            columns: table => new
            {
                id = table.Column<string>(type: "text", nullable: false),
                is_canceled = table.Column<bool>(type: "boolean", nullable: false),
                notes = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_workout", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "exercise_exercise_plan",
            columns: table => new
            {
                exercise_plans_id = table.Column<long>(type: "bigint", nullable: false),
                possible_exercises_id = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_exercise_exercise_plan", x => new { x.exercise_plans_id, x.possible_exercises_id });
                table.ForeignKey(
                    name: "fk_exercise_exercise_plan_exercise_plan_exercise_plans_id",
                    column: x => x.exercise_plans_id,
                    principalTable: "exercise_plan",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "fk_exercise_exercise_plan_exercise_possible_exercises_id",
                    column: x => x.possible_exercises_id,
                    principalTable: "exercise",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "workout_exercise",
            columns: table => new
            {
                id = table.Column<string>(type: "text", nullable: false),
                exercise_plan_id = table.Column<long>(type: "bigint", nullable: false),
                notes = table.Column<string>(type: "text", nullable: true),
                is_finished = table.Column<bool>(type: "boolean", nullable: false),
                exercise_id = table.Column<string>(type: "text", nullable: false),
                workout_id = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_workout_exercise", x => x.id);
                table.ForeignKey(
                    name: "fk_workout_exercise_exercise_exercise_id",
                    column: x => x.exercise_id,
                    principalTable: "exercise",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "fk_workout_exercise_exercise_plan_exercise_plan_id",
                    column: x => x.exercise_plan_id,
                    principalTable: "exercise_plan",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "fk_workout_exercise_workout_workout_id",
                    column: x => x.workout_id,
                    principalTable: "workout",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "workout_exercise_set",
            columns: table => new
            {
                id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                notes = table.Column<string>(type: "text", nullable: true),
                weight = table.Column<decimal>(type: "numeric", nullable: false),
                reps = table.Column<string>(type: "text", nullable: false),
                recorded_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                workout_exercise_id = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_workout_exercise_set", x => x.id);
                table.ForeignKey(
                    name: "fk_workout_exercise_set_workout_exercise_workout_exercise_id",
                    column: x => x.workout_exercise_id,
                    principalTable: "workout_exercise",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "ix_exercise_exercise_plan_possible_exercises_id",
            table: "exercise_exercise_plan",
            column: "possible_exercises_id");

        migrationBuilder.CreateIndex(
            name: "ix_workout_is_canceled",
            table: "workout",
            column: "is_canceled");

        migrationBuilder.CreateIndex(
            name: "ix_workout_exercise_exercise_id",
            table: "workout_exercise",
            column: "exercise_id");

        migrationBuilder.CreateIndex(
            name: "ix_workout_exercise_exercise_plan_id",
            table: "workout_exercise",
            column: "exercise_plan_id");

        migrationBuilder.CreateIndex(
            name: "ix_workout_exercise_is_finished",
            table: "workout_exercise",
            column: "is_finished");

        migrationBuilder.CreateIndex(
            name: "ix_workout_exercise_workout_id",
            table: "workout_exercise",
            column: "workout_id");

        migrationBuilder.CreateIndex(
            name: "ix_workout_exercise_set_recorded_at_utc",
            table: "workout_exercise_set",
            column: "recorded_at_utc");

        migrationBuilder.CreateIndex(
            name: "ix_workout_exercise_set_workout_exercise_id",
            table: "workout_exercise_set",
            column: "workout_exercise_id");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "exercise_exercise_plan");

        migrationBuilder.DropTable(
            name: "workout_exercise_set");

        migrationBuilder.DropTable(
            name: "workout_exercise");

        migrationBuilder.DropTable(
            name: "exercise");

        migrationBuilder.DropTable(
            name: "exercise_plan");

        migrationBuilder.DropTable(
            name: "workout");
    }
}
