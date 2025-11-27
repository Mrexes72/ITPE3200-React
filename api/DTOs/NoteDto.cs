using System.ComponentModel.DataAnnotations;

namespace systemOut.DTOs;

public class NoteDto
{
  public int NoteId { get; set; }
  [StringLength(70)]
  public string Title { get; set; } = String.Empty;
  [StringLength(1000)]
  public string Body { get; set; } = String.Empty;
  [Required]
  public int UserId { get; set; }
}