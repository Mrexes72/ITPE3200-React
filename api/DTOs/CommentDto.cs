using System.ComponentModel.DataAnnotations;

namespace systemOut.DTOs;

public class CommentDto
{
  public int CommentId { get; set; }
  public string Body { get; set; } = String.Empty;
  public int UserId { get; set; }
  public int? ImageId { get; set; }

  public int? NoteId { get; set; }
}