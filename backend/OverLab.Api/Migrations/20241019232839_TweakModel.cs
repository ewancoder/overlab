using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OverLab.Api.Migrations;

/// <inheritdoc />
public partial class TweakModel : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "fk_workout_exercise_exercise_exercise_id",
            table: "workout_exercise");

        migrationBuilder.AlterColumn<string>(
            name: "exercise_id",
            table: "workout_exercise",
            type: "text",
            nullable: true,
            oldClrType: typeof(string),
            oldType: "text");

        migrationBuilder.AddForeignKey(
            name: "fk_workout_exercise_exercise_exercise_id",
            table: "workout_exercise",
            column: "exercise_id",
            principalTable: "exercise",
            principalColumn: "id");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "fk_workout_exercise_exercise_exercise_id",
            table: "workout_exercise");

        migrationBuilder.AlterColumn<string>(
            name: "exercise_id",
            table: "workout_exercise",
            type: "text",
            nullable: false,
            defaultValue: "",
            oldClrType: typeof(string),
            oldType: "text",
            oldNullable: true);

        migrationBuilder.AddForeignKey(
            name: "fk_workout_exercise_exercise_exercise_id",
            table: "workout_exercise",
            column: "exercise_id",
            principalTable: "exercise",
            principalColumn: "id",
            onDelete: ReferentialAction.Cascade);
    }
}
