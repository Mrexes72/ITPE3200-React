using Microsoft.EntityFrameworkCore;
using systemOut.Models;

namespace systemOut.DAL;

public class ImageRepository : IImageRepository
{
  private readonly UserDbContext _db;
  private readonly ILogger<ImageRepository> _logger;

  public ImageRepository(UserDbContext db, ILogger<ImageRepository> logger)
  {
    _db = db;
    _logger = logger;
  }

  public async Task<IEnumerable<Image>?> GetAll()
  {
    try
    {
      return await _db.Images.ToListAsync();
    }
    catch (Exception e)
    {
      _logger.LogError("[ImageRepository] images ToListAsync failed when GetAll(), error message:{e}", e.Message);
      return null;
    }
  }

  public async Task<Image?> GetImageById(int id)
  {
    try
    {
      return await _db.Images.FindAsync(id);
    }
    catch (Exception e)
    {
      _logger.LogError("[ImageRepository] images FindAsync(id) failed when GetImageById() for ImageId {ImageId:0000}, error message:{e}", id, e.Message);
      return null;
    }
  }

  public async Task<bool> Create(Image image)
  {
    try
    {
      await _db.Images.AddAsync(image);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[ImageRepository] image creation failed for image {@image}, error message: {e}", image, e.Message);
      return false;
    }
  }

  public async Task<bool> Update(Image image)
  {
    try
    {
      _db.Images.Update(image);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[ImageRepository] image update failed for image {@image}, error message: {e}", image, e.Message);
      return false;
    }
  }

  public async Task<bool> Delete(int id)
  {
    try
    {
      var image = await _db.Images
      .Include(i => i.Comments)
      .FirstOrDefaultAsync(i => i.ImageId == id);
      if (image == null)
      {
        _logger.LogError("[ImageRepository] image not found when deleting the ImageId {ImageId:0000}", id);
        return false;
      }
      if (image.Comments != null)
      {
        _db.Comments.RemoveRange(image.Comments);
      }
      _db.Images.Remove(image);
      await _db.SaveChangesAsync();
      return true;
    }
    catch (Exception e)
    {
      _logger.LogError("[ImageRepository] image deletion failed for image {@image}, error message: {e}", id, e.Message);
      return false;
    }

  }
}