using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace systemOut.Models
{
  public class Image
  {
    public int ImageId { get; set; }
    [StringLength(100)]
    public string Title { get; set; } = String.Empty;
    public string Url { get; set; } = String.Empty;
    [StringLength(300)]
    public string Description { get; set; } = String.Empty;

    [NotMapped]
    public IFormFile? ImageFile { get; set; }
    [Required]
    public int UserId { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = default!;

    // Navigation properties
    public virtual List<Comment>? Comments { get; set; }
  }
}