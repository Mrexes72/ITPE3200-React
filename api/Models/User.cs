using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace systemOut.Models
{
  public class User
  {
    public int UserId { get; set; }
    [RegularExpression(@"[a-zA-ZæøåÆØÅ. \-]{2,70}", ErrorMessage = @"Name must be between 2 and 20 characters and only contain letters, 
    spaces, periods, hyphens, and underscores.")]
    [Display(Name = "User name")]
    public string Name { get; set; } = String.Empty;

    public string? ImageUrl { get; set; }

    // Navigation property

    public virtual List<Image>? Images { get; set; }

    // Navigation property
    public virtual List<Note>? Notes { get; set; }

    // Navigation property
    public virtual List<Comment>? Comments { get; set; }


  }
}