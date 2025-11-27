using Microsoft.EntityFrameworkCore;
using systemOut.Models;

namespace systemOut.DAL;

public class NoteRepository : INoteRepository
{
  private readonly UserDbContext _db;
  private readonly ILogger<NoteRepository> _logger;

  public NoteRepository(UserDbContext db, ILogger<NoteRepository> logger)
  {
    _db = db;
    _logger = logger;
  }

  public async Task<IEnumerable<Note>?> GetAll()
  {
    try
    {
      return await _db.Notes.ToListAsync();
    }
    catch (Exception e)
    {
      _logger.LogError("[NoteRepository] notes ToListAsync failed when GetAll(), error message:{e}", e.Message);
      return null;
    }
  }

  public async Task<Note?> GetNoteById(int id)
  {
    try
    {
      return await _db.Notes.FindAsync(id);
    }
    catch (Exception e)
    {
      _logger.LogError("[NoteRepository] notes FindAsync(id) failed when GetNoteById() for ImageId {ImageId:00}, error message:{e}", id, e.Message);
      return null;
    }
  }

  public async Task<bool> Create(Note note)
  {
    try
    {
      _db.Notes.Add(note);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[NoteRepository] note creation failed for note {@note}, error message:{e}", note, e.Message);
      return false;
    }
  }

  public async Task<bool> Update(Note note)
  {
    try
    {
      _db.Notes.Update(note);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[NoteRepository] note update failed for note {@note}, error message:{e}", note, e.Message);
      return false;
    }
  }

  public async Task<bool> Delete(int id)
  {
    try
    {
      var note = await _db.Notes
      .Include(n => n.Comments)
      .FirstOrDefaultAsync(n => n.NoteId == id);
      if (note == null)
      {
        _logger.LogError("[NoteRepository] note deletion failed for noteId {NoteId:0000}", id);
        return false;
      }
      if (note.Comments != null)
      {
        _db.Comments.RemoveRange(note.Comments);
      }
      _db.Notes.Remove(note);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[NoteRepository] note deletion failed for noteId {NoteId:0000}, error message:{e}", id, e.Message);
      return false;
    }
  }
}