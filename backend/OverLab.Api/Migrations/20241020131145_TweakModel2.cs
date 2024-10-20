using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace OverLab.Api.Migrations;

/// <inheritdoc />
public partial class TweakModel2 : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "fk_exercise_exercise_plan_exercise_plan_exercise_plans_id",
            table: "exercise_exercise_plan");

        migrationBuilder.DropForeignKey(
            name: "fk_workout_exercise_exercise_plan_exercise_plan_id",
            table: "workout_exercise");

        migrationBuilder.DropPrimaryKey(
            name: "pk_exercise_plan",
            table: "exercise_plan");

        migrationBuilder.DropColumn(
            name: "order_position",
            table: "exercise_plan");

        migrationBuilder.RenameTable(
            name: "exercise_plan",
            newName: "exercise_plans");

        migrationBuilder.AlterColumn<string>(
            name: "exercise_plan_id",
            table: "workout_exercise",
            type: "text",
            nullable: false,
            oldClrType: typeof(long),
            oldType: "bigint");

        migrationBuilder.AddColumn<DateTime>(
            name: "started_at_utc",
            table: "workout",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

        migrationBuilder.AlterColumn<string>(
            name: "exercise_plans_id",
            table: "exercise_exercise_plan",
            type: "text",
            nullable: false,
            oldClrType: typeof(long),
            oldType: "bigint");

        migrationBuilder.AlterColumn<string>(
            name: "id",
            table: "exercise_plans",
            type: "text",
            nullable: false,
            oldClrType: typeof(long),
            oldType: "bigint")
            .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

        migrationBuilder.AddPrimaryKey(
            name: "pk_exercise_plans",
            table: "exercise_plans",
            column: "id");

        migrationBuilder.AddForeignKey(
            name: "fk_exercise_exercise_plan_exercise_plans_exercise_plans_id",
            table: "exercise_exercise_plan",
            column: "exercise_plans_id",
            principalTable: "exercise_plans",
            principalColumn: "id",
            onDelete: ReferentialAction.Cascade);

        migrationBuilder.AddForeignKey(
            name: "fk_workout_exercise_exercise_plans_exercise_plan_id",
            table: "workout_exercise",
            column: "exercise_plan_id",
            principalTable: "exercise_plans",
            principalColumn: "id",
            onDelete: ReferentialAction.Cascade);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "fk_exercise_exercise_plan_exercise_plans_exercise_plans_id",
            table: "exercise_exercise_plan");

        migrationBuilder.DropForeignKey(
            name: "fk_workout_exercise_exercise_plans_exercise_plan_id",
            table: "workout_exercise");

        migrationBuilder.DropPrimaryKey(
            name: "pk_exercise_plans",
            table: "exercise_plans");

        migrationBuilder.DropColumn(
            name: "started_at_utc",
            table: "workout");

        migrationBuilder.RenameTable(
            name: "exercise_plans",
            newName: "exercise_plan");

        migrationBuilder.AlterColumn<long>(
            name: "exercise_plan_id",
            table: "workout_exercise",
            type: "bigint",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "text");

        migrationBuilder.AlterColumn<long>(
            name: "exercise_plans_id",
            table: "exercise_exercise_plan",
            type: "bigint",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "text");

        migrationBuilder.AlterColumn<long>(
            name: "id",
            table: "exercise_plan",
            type: "bigint",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "text")
            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

        migrationBuilder.AddColumn<int>(
            name: "order_position",
            table: "exercise_plan",
            type: "integer",
            nullable: false,
            defaultValue: 0);

        migrationBuilder.AddPrimaryKey(
            name: "pk_exercise_plan",
            table: "exercise_plan",
            column: "id");

        migrationBuilder.AddForeignKey(
            name: "fk_exercise_exercise_plan_exercise_plan_exercise_plans_id",
            table: "exercise_exercise_plan",
            column: "exercise_plans_id",
            principalTable: "exercise_plan",
            principalColumn: "id",
            onDelete: ReferentialAction.Cascade);

        migrationBuilder.AddForeignKey(
            name: "fk_workout_exercise_exercise_plan_exercise_plan_id",
            table: "workout_exercise",
            column: "exercise_plan_id",
            principalTable: "exercise_plan",
            principalColumn: "id",
            onDelete: ReferentialAction.Cascade);
    }
}
