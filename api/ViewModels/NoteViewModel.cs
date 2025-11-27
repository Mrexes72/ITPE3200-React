using systemOut.Models;

namespace systemOut.ViewModels
{
  public class NoteViewModel
  {
    public IEnumerable<Note> Notes;
    public string? CurrentViewName;

    public NoteViewModel(IEnumerable<Note> notes, string? currentViewName)
    {
      Notes = notes;
      CurrentViewName = currentViewName;
    }
  }
}