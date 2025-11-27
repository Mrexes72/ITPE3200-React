using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using systemOut.Models;
using systemOut.DAL;
using systemOut.DTOs;

namespace systemOut.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentAPIController : Controller
{
    private readonly ICommentRepository _commentRepostiory;
    private readonly ILogger<CommentController> _logger;

    public CommentAPIController(ICommentRepository commentRepository, ILogger<CommentController> logger)
    {
        _commentRepostiory = commentRepository;
        _logger = logger;
    }

    [HttpGet("getComments")]
    public async Task<IActionResult> GetComments()
    {
        var comments = await _commentRepostiory.GetAll();
        if (comments == null)
        {
            _logger.LogError("[CommentAPIController] Comments not found whil executing _commentRepository.GetAll()");
            return NotFound("Comments not found");
        }

        var commentDtos = comments.Select(comment => new CommentDto
        {
            CommentId = comment.CommentId,
            Body = comment.Body,
            UserId = comment.UserId,
            NoteId = comment.NoteId,
            ImageId = comment.ImageId
        });
        return Ok(commentDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCommentById(int id)
    {
        var comment = await _commentRepostiory.GetCommentById(id);
        if (comment == null)
        {
            _logger.LogError("[CommentAPIController] Comment not found for the CommentId {CommentId:0000}", id);
            return NotFound("Comment not found for the CommentId");
        }
        return Ok(comment);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CommentDto commentDto)
    {
        if (commentDto == null)
        {
            return BadRequest("Comment cannot be null");
        }

        var newComment = new Comment
        {
            Body = commentDto.Body,
            UserId = commentDto.UserId,
            ImageId = commentDto?.ImageId,
            NoteId = commentDto?.NoteId
        };

        bool returnOk = await _commentRepostiory.Create(newComment);
        if (returnOk)
        {
            return NoContent();
        }
        _logger.LogWarning("[CommentAPIController] Comment creation failed {@comment}", newComment);
        return StatusCode(500, "Internal server error");
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CommentDto commentDto)
    {
        if (commentDto == null)
        {
            return BadRequest("Comment data cannot be null");
        }

        var existingComment = await _commentRepostiory.GetCommentById(id);
        if (existingComment == null)
        {
            return NotFound("Comment not found");
        }

        existingComment.Body = commentDto.Body;

        // Save the changes
        bool updateSccessful = await _commentRepostiory.Update(existingComment);
        if (updateSccessful)
        {
            return Ok(existingComment);
        }
        _logger.LogWarning("[CommentAPIController] Comment update failed for {@comment}", existingComment);
        return StatusCode(500, "Internal server error");
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _commentRepostiory.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[CommentAPIController] Comment deletion failed for the CommentId {CommentId:0000}", id);
        }
        return NoContent();
    }
}

public class CommentController : Controller
{
    private readonly IUserRepository _UserRepository;
    private readonly IImageRepository _ImageRepository;
    private readonly INoteRepository _NoteRepository;
    private readonly ICommentRepository _commentRepository;
    private readonly ILogger<CommentController> _logger;

    public CommentController(ICommentRepository commentRepository,
    IUserRepository UserDbcontext, IImageRepository ImageRepository,
    INoteRepository NoteRepository, ILogger<CommentController> logger)
    {
        _UserRepository = UserDbcontext;
        _ImageRepository = ImageRepository;
        _NoteRepository = NoteRepository;
        _commentRepository = commentRepository;
        _logger = logger;
    }
}