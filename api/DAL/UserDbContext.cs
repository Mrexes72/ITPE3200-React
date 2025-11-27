using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using systemOut.Models;

namespace systemOut.DAL
{
  public class UserDbContext : IdentityDbContext
  {
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
    {
      // Database.EnsureCreated();
    }


    public new DbSet<User> Users { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      optionsBuilder.UseLazyLoadingProxies();
    }
  }
}