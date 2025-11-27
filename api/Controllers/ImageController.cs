using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using systemOut.Models;
using systemOut.ViewModels;
using systemOut.DAL;
using systemOut.DTOs;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;

namespace systemOut.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ImageAPIController : Controller
{
  private readonly IImageRepository _imageRepository;
  private readonly IUserRepository _userRepository;
  private readonly ILogger<ImageController> _logger;

  public ImageAPIController(IImageRepository imageRepository,
  IUserRepository userRepository, ILogger<ImageController> logger)
  {
    _imageRepository = imageRepository;
    _userRepository = userRepository;
    _logger = logger;
  }

  [HttpGet("getimages")]
  public async Task<IActionResult> GetImages()
  {
    var images = await _imageRepository.GetAll();
    if (images == null)
    {
      _logger.LogError("[ImageAPIController] Images not found whil executing _imageRepository.GetAll()");
      return NotFound("Images not found");
    }
    var imageDtos = images.Select(image => new ImageDto
    {
      ImageId = image.ImageId,
      Title = image.Title,
      Url = image.Url,
      Description = image.Description,
      UserId = image.UserId
    });
    return Ok(imageDtos);
  }

  [HttpGet("get-all-image-urls")]
  public IActionResult GetAllImageUrls()
  {
    var imagesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
    var imageUrls = new List<string>();

    // Hent alle filer fra bilder-mappen og undermapper
    var files = Directory.GetFiles(imagesDirectory, "*.*", SearchOption.AllDirectories);

    foreach (var file in files)
    {
      var relativePath = Path.GetRelativePath(Directory.GetCurrentDirectory(), file);
      var url = $"/{relativePath.Replace("\\", "/")}";  // Konverter backslashes til forward slashes
      imageUrls.Add(url);
    }

    return Ok(imageUrls);
  }

  [HttpPost("create")]
  public async Task<IActionResult> Create([FromBody] ImageDto imageDto)
  {
    if (imageDto == null)
    {
      return BadRequest("Image cannot be null");
    }

    var newImage = new Image
    {
      Title = imageDto.Title,
      Description = imageDto.Description,
      Url = imageDto.Url,
      UserId = imageDto.UserId
    };

    bool returnOk = await _imageRepository.Create(newImage);
    if (returnOk)
    {
      return CreatedAtAction(nameof(GetImages), new { id = newImage.ImageId }, newImage);
    }
    _logger.LogWarning("[ImageAPIController] Image creation failed {@image}", newImage);
    return StatusCode(500, "Internal server error");
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetImage(int id)
  {
    var image = await _imageRepository.GetImageById(id);
    if (image == null)
    {
      _logger.LogError("[ImageAPIController] Image not found for the ImageId {ImageId:0000}", id);
      return NotFound("Image not found for the ImageId");
    }
    return Ok(image);
  }

  [HttpPut("update/{id}")]
  public async Task<IActionResult> Update(int id, [FromBody] ImageDto imageDto)
  {
    if (imageDto == null)
    {
      return BadRequest("Image data cannot be null");
    }

    // Find the Image in the database
    var existingImage = await _imageRepository.GetImageById(id);
    if (existingImage == null)
    {
      return NotFound("Image not found");
    }

    // Update the image properties
    existingImage.Title = imageDto.Title;
    existingImage.Description = imageDto.Description;
    existingImage.Url = imageDto.Url;

    // Save the changes
    bool updateSccessful = await _imageRepository.Update(existingImage);
    if (updateSccessful)
    {
      return Ok(existingImage);
    }

    _logger.LogWarning("[ImageAPIController] Image update failed for {@image}", existingImage);
    return StatusCode(500, "Internal server error");
  }

  [HttpDelete("delete/{id}")]
  public async Task<IActionResult> DeleteConfirmed(int id)
  {
    bool returnOk = await _imageRepository.Delete(id);
    if (!returnOk)
    {
      _logger.LogError("[ImageAPIController] Image deletion failed for the ImageId {ImageId:0000}", id);
    }
    return NoContent();
  }

}
public class ImageController : Controller
{

  private readonly IImageRepository _imageRepository;
  private readonly IUserRepository _userRepository;
  private readonly ILogger<ImageController> _logger;


  public ImageController(IImageRepository imageRepository, ILogger<ImageController> logger,
  IUserRepository userRepository)
  {
    _imageRepository = imageRepository;
    _logger = logger;
    _userRepository = userRepository;
  }


}

