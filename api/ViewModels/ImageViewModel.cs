using systemOut.Models;

namespace systemOut.ViewModels
{
  public class ImageViewModel
  {
    public IEnumerable<Image> Images;

    public string? CurrentViewName;

    public ImageViewModel(IEnumerable<Image> images, string? currentViewName)
    {
      Images = images;
      CurrentViewName = currentViewName;
    }
  }
}