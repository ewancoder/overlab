using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OverLab.Api.Migrations;

/// <inheritdoc />
public partial class TweakModel3 : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "description",
            table: "exercise_plans",
            type: "text",
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<string>(
            name: "name",
            table: "exercise_plans",
            type: "text",
            nullable: false,
            defaultValue: "");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "description",
            table: "exercise_plans");

        migrationBuilder.DropColumn(
            name: "name",
            table: "exercise_plans");
    }
}
