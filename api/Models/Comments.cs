using System;

namespace systemOut.Models
{
  public class Comment
  {
    public int CommentId { get; set; }
    public string Body { get; set; } = String.Empty;
    public int UserId { get; set; }
    public int? ImageId { get; set; }

    public int? NoteId { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = default!;

    // Navigation properties
    public virtual Image? Image { get; set; }
    // Navigation properties
    public virtual Note? Note { get; set; }
  }
}