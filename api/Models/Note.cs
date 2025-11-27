using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace systemOut.Models
{
  public class Note
  {
    public int NoteId { get; set; }
    [StringLength(100)]
    public string Title { get; set; } = String.Empty;
    [StringLength(1000)]
    public string Body { get; set; } = String.Empty;
    [Required]
    public int UserId { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = default!;

    // Navigation properties
    public virtual List<Comment>? Comments { get; set; }
  }
}