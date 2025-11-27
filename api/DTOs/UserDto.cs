using System.ComponentModel.DataAnnotations;

namespace systemOut.DTOs;

public class UserDto
{
  public int UserId { get; set; }

  [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,70}", ErrorMessage = @"Name must be between 2 and 20 characters and only contain letters, numbers, 
    spaces, periods, hyphens, and underscores.")]
  [Display(Name = "User name")]
  public string Name { get; set; } = String.Empty;

  public string? ImageUrl { get; set; }
}