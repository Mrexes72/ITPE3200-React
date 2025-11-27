using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using systemOut.Models;

namespace systemOut.DAL;

public class UserRepository : IUserRepository
{
  private readonly UserDbContext _db;
  private readonly ILogger<UserRepository> _logger;

  public UserRepository(UserDbContext db, ILogger<UserRepository> logger)
  {
    _db = db;
    _logger = logger;
  }

  public async Task<IEnumerable<User>?> GetAll()
  {
    try
    {
      return await _db.Users.ToListAsync();
    }
    catch (Exception e)
    {
      _logger.LogError("[UserRepository] users ToListAsync failed when GetAll(), error message:{e}", e.Message);
      return null;
    }
  }

  public async Task<User?> GetUserById(int id)
  {
    try
    {
      return await _db.Users.FindAsync(id);
    }
    catch (Exception e)
    {
      _logger.LogError("[UserRepository] users FindAsync(id) failed when GetUserById() for UserId {UserId:0000}, error message:{e}", id, e.Message);
      return null;
    }
  }

  public async Task<bool> Create(User user)
  {
    try
    {
      await _db.Users.AddAsync(user);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[UserRepository] user creation failed for user {@user}, error message: {e}", user, e.Message);
      return false;
    }
  }

  public async Task<bool> Update(User user)
  {
    try
    {
      _db.Users.Update(user);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[UserRepository] uses FindAsync(id) failed when updating the UserId {UserId:0000}, error message: {e}", user, e.Message);
      return false;
    }
  }

  public async Task<bool> Delete(int id)
  {
    try
    {
      var user = await _db.Users.FindAsync(id);
      if (user == null)
      {
        _logger.LogError("[UserRepository] user not found for the UserId {UserId:0000}", id);
        return false;
      }
      _db.Users.Remove(user);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[UserRepository] users deletion failed for the UserId {UserId:0000}, error message: {e}", id, e.Message);
      return false;
    }
  }

  public async Task<int> GetMaxUserId()
  {
    return await _db.Users.MaxAsync(u => u.UserId);
  }
}