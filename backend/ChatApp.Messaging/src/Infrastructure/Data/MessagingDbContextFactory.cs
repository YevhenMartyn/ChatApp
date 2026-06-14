using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace ChatApp.Messaging.Infrastructure.Data;

public class MessagingDbContextFactory : IDesignTimeDbContextFactory<MessagingDbContext>
{
    public MessagingDbContext CreateDbContext(string[] args)
    {
    IConfigurationRoot configuration = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "../Web/appsettings.json"), optional: true, reloadOnChange: true)
        .AddEnvironmentVariables()
        .Build();

    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("The connection string 'DefaultConnection' was not found in appsettings.json or environment variables.");
    }

    var optionsBuilder = new DbContextOptionsBuilder<MessagingDbContext>();
    optionsBuilder.UseSqlServer(connectionString);

    return new MessagingDbContext(optionsBuilder.Options);
}
}