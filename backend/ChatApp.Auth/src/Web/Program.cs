
using Domain.Common.Constants;
using Infrastructure;
using Application;
using Microsoft.AspNetCore.Identity;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    if (!await roleManager.RoleExistsAsync(RoleConstants.Admin))
        await roleManager.CreateAsync(new IdentityRole(RoleConstants.Admin));

    if (!await roleManager.RoleExistsAsync(RoleConstants.User))
        await roleManager.CreateAsync(new IdentityRole(RoleConstants.User));
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();