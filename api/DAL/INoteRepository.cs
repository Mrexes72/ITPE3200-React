using systemOut.Models;

namespace systemOut.DAL;

public interface INoteRepository
{
  Task<IEnumerable<Note>?> GetAll();
  Task<Note?> GetNoteById(int id);
  Task<bool> Create(Note note);
  Task<bool> Update(Note note);
  Task<bool> Delete(int id);
}