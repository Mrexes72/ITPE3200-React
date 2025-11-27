using System.ComponentModel.DataAnnotations;

namespace systemOut.DTOs;

public class ImageDto
{
  public int ImageId { get; set; }
  [StringLength(70)]
  public string Title { get; set; } = String.Empty;
  public string Url { get; set; } = String.Empty;
  [StringLength(200)]
  public string Description { get; set; } = String.Empty;


  public IFormFile? ImageFile { get; set; }
  [Required]
  public int UserId { get; set; }
}