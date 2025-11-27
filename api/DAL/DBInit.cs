using Microsoft.EntityFrameworkCore;
using systemOut.Models;

namespace systemOut.DAL;

public static class DBInit
{
  public static void Seed(IApplicationBuilder app)
  {
    using var serviceScope = app.ApplicationServices.CreateScope();
    UserDbContext context = serviceScope.ServiceProvider.GetRequiredService<UserDbContext>();
    context.Database.EnsureCreated();

    if (!context.Users.Any())
    {
      var users = new List<User>{
        new User {
          Name = "John Doe",
          ImageUrl = "/images/bruker1/bruker1.jpg"
        },
        new User {
          Name = "Jane Doe",
          ImageUrl = "/images/bruker2/bruker2.jpg"
        }
      };
      context.AddRange(users);
      context.SaveChanges();

    }

    if (!context.Images.Any())
    {
      var images = new List<Image>{
        new Image {
          Title = "John Doe",
          Url = "/images/bruker5/bruker5.jpg",
          Description = "A Picture",
          UserId = 1
        },
        new Image {
          Title = "Jane Doe",
          Url = "/images/bruker4/bruker4.jpg",
          Description = "Another Picture",
          UserId = 2
        }
      };
      context.AddRange(images);
      context.SaveChanges();
    }

    if (!context.Notes.Any())
    {
      var notes = new List<Note>(){
        new Note {
          Title = "John Doe",
          Body = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque similique magnam doloremque nulla perspiciatis."+
          "Dolorem totam, voluptates necessitatibus voluptatem architecto mollitia placeat reprehenderit dolores sequi aperiam corporis quae nostrum provident.",
          UserId = 1
        },
        new Note {
          Title = "Jane Doe",
          Body = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque similique magnam doloremque nulla perspiciatis."+
          "Dolorem totam, voluptates necessitatibus voluptatem architecto mollitia placeat reprehenderit dolores sequi aperiam corporis quae nostrum provident.",
          UserId = 2
        }
      };
      context.AddRange(notes);
      context.SaveChanges();
    }

    if (!context.Comments.Any())
    {
      var comments = new List<Comment>{
        new Comment {
          Body = "John Doe",
          UserId = 1,
          ImageId = 1
        },
        new Comment {
          Body = "Jane Doe",
          UserId = 2,
          NoteId = 2
        }
      };
      context.AddRange(comments);
      context.SaveChanges();
    }
    context.SaveChanges();
  }
}
