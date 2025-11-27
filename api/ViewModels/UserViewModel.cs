using systemOut.Models;

namespace systemOut.ViewModels
{
  public class UserViewModel
  {
    public IEnumerable<User> Users;

    public string? CurrentViewName;

    public UserViewModel(IEnumerable<User> users, string? currentViewName)
    {
      Users = users;
      CurrentViewName = currentViewName;
    }

  }

}