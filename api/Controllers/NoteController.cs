using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using systemOut.Models;
using systemOut.ViewModels;
using systemOut.DAL;
using systemOut.DTOs;

namespace systemOut.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NoteAPICOntroller : Controller
{
  private readonly INoteRepository _noteRepository;
  private readonly IUserRepository _userRepository;
  private readonly ILogger<NoteController> _logger;

  public NoteAPICOntroller(INoteRepository noteRepository,
  IUserRepository userRepository, ILogger<NoteController> logger)
  {
    _noteRepository = noteRepository;
    _userRepository = userRepository;
    _logger = logger;
  }

  [HttpGet("getNotes")]
  public async Task<IActionResult> GetNotes()
  {
    var notes = await _noteRepository.GetAll();
    if (notes == null)
    {
      _logger.LogError("[NoteAPIController] Notes not found whil executing _noteRepository.GetAll()");
      return NotFound("Notes not found");
    }

    var noteDtos = notes.Select(note => new NoteDto
    {
      NoteId = note.NoteId,
      Title = note.Title,
      Body = note.Body,
      UserId = note.UserId
    });
    return Ok(noteDtos);
  }

  [HttpPost("create")]
  public async Task<IActionResult> Create([FromBody] NoteDto noteDto)
  {
    if (noteDto == null)
    {
      return BadRequest("Note cannot be null");
    }

    var newNote = new Note
    {
      Title = noteDto.Title,
      Body = noteDto.Body,
      UserId = noteDto.UserId
    };

    bool returnOk = await _noteRepository.Create(newNote);
    if (returnOk)
    {
      return CreatedAtAction(nameof(GetNotes), new { id = newNote.NoteId }, newNote);
    }
    _logger.LogWarning("[NoteAPIController] Note creation failed {@note}", newNote);
    return StatusCode(500, "Internal server error");
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetNoteById(int id)
  {
    var note = await _noteRepository.GetNoteById(id);
    if (note == null)
    {
      _logger.LogError("[NoteAPIController] Note not found for the NoteId {NoteId:0000}", id);
      return NotFound("Note not found for the NoteId");
    }
    return Ok(note);
  }

  [HttpPut("update/{id}")]
  public async Task<IActionResult> Update(int id, [FromBody] NoteDto noteDto)
  {
    if (noteDto == null)
    {
      return BadRequest("Note data cannot be null");
    }

    var existingNote = await _noteRepository.GetNoteById(id);
    if (existingNote == null)
    {
      return NotFound("Note not found");
    }

    existingNote.Title = noteDto.Title;
    existingNote.Body = noteDto.Body;

    // Save the changes
    bool updateSccessful = await _noteRepository.Update(existingNote);
    if (updateSccessful)
    {
      return Ok(existingNote);
    }

    _logger.LogWarning("[NoteAPIController] Note update failed for {@note}", existingNote);
    return StatusCode(500, "Internal server error");
  }

  [HttpDelete("delete/{id}")]
  public async Task<IActionResult> DeleteConfirmed(int id)
  {
    bool returnOk = await _noteRepository.Delete(id);
    if (!returnOk)
    {
      _logger.LogError("[NoteAPIController] Note deletion failed for the NoteId {NoteId:0000}", id);
    }
    return NoContent();
  }
}
public class NoteController : Controller
{
  private readonly INoteRepository _noteRepository;
  private readonly IUserRepository _userRepository;
  private readonly ILogger<NoteController> _logger;

  public NoteController(INoteRepository noteRepository, ILogger<NoteController> logger, IUserRepository userRepository)
  {
    _noteRepository = noteRepository;
    _logger = logger;
    _userRepository = userRepository;
  }
}
