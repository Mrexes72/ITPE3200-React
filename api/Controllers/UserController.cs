using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using systemOut.Models;
using systemOut.ViewModels;
using systemOut.DAL;
using systemOut.DTOs;

namespace systemOut.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserAPIController : Controller
{
  private readonly IUserRepository _userRepository;
  private readonly ILogger<UserController> _logger;

  public UserAPIController(IUserRepository userRepository, ILogger<UserController> logger)
  {
    _userRepository = userRepository;
    _logger = logger;
  }

  [HttpGet("userlist")]
  public async Task<IActionResult> UserList()
  {
    var users = await _userRepository.GetAll();
    if (users == null)
    {
      _logger.LogError("[UserAPIController] User list not found while exectuing _userRepositoy.GetAll()");
      return NotFound("User list not found");
    }
    var userDtos = users.Select(user => new UserDto
    {
      UserId = user.UserId,
      Name = user.Name,
      ImageUrl = user.ImageUrl
    });
    return Ok(userDtos);
  }

  [HttpPost("create")]
  public async Task<IActionResult> Create([FromBody] UserDto userDto)
  {
    if (userDto == null)
    {
      return BadRequest("User cannot be null");
    }

    var newUser = new User
    {
      Name = userDto.Name,
      ImageUrl = userDto.ImageUrl
    };

    bool returnOk = await _userRepository.Create(newUser);
    if (returnOk)
    {
      return CreatedAtAction(nameof(UserList), new { id = newUser.UserId }, newUser);
    }
    _logger.LogWarning("[UserAPIController] User creation failed {@user}", newUser);
    return StatusCode(500, "Internal server error");
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetUser(int id)
  {
    var user = await _userRepository.GetUserById(id);
    if (user == null)
    {
      _logger.LogError("[UserAPIController] User not found fo the UserId {UserId:0000}", id);
      return NotFound("User not found for the UserId");
    }
    return Ok(user);
  }

  [HttpPut("update/{id}")]
  public async Task<IActionResult> Update(int id, [FromBody] UserDto userDto)
  {
    if (userDto == null)
    {
      return BadRequest("User data cannot be null");
    }

    // Find the User in the database
    var existingUser = await _userRepository.GetUserById(id);
    if (existingUser == null)
    {
      return NotFound("User not found");
    }

    // Update the user properties
    existingUser.Name = userDto.Name;
    existingUser.ImageUrl = userDto.ImageUrl;

    // Save the changes
    bool updateSccessful = await _userRepository.Update(existingUser);
    if (updateSccessful)
    {
      return Ok(existingUser);
    }

    _logger.LogWarning("[UserAPIController] User update failed {@user}", existingUser);
    return StatusCode(500, "Internal server error");
  }

  [HttpDelete("delete/{id}")]
  public async Task<IActionResult> DeleteConfirmed(int id)
  {
    bool returnOk = await _userRepository.Delete(id);
    if (!returnOk)
    {
      _logger.LogError("[UserAPIController] User deletion failed for the UserId {UserId:0000}", id);
    }
    return NoContent(); // 200 Ok is commonly used when the server returns a repsonse body with additional information about the result of the request.
    // For a DELETE operation, there's generally no need to return additional data, making 204 NoContent a better fit.
  }
}
public class UserController : Controller
{

  private readonly IUserRepository _userRepository;
  private readonly ILogger<UserController> _logger;

  public UserController(IUserRepository userRepository, ILogger<UserController> logger)
  {
    _userRepository = userRepository;
    _logger = logger;
  }
}


