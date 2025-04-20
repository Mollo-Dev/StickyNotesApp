using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StickyNotes.API.Data;
using StickyNotes.API.Models.Entities;

namespace StickyNotes.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StickyNotesController : Controller
    {
        private readonly StickyNotesDbContext stickyNotesDbContext;

        public StickyNotesController(StickyNotesDbContext stickyNotesDbContext)
        {
            this.stickyNotesDbContext = stickyNotesDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStickyNotes()
        {
            return Ok(await stickyNotesDbContext.StickyNotes.ToListAsync());
        }

        [HttpGet]
        [Route("{id:guid}")]
        [ActionName("GetStickyNoteById")]
        public async Task<IActionResult> GetStickyNoteById([FromRoute] Guid id)
        {
            var  stickyNote = await stickyNotesDbContext.StickyNotes.FindAsync(id);

            if (stickyNote == null) 
            {
                return NotFound();
            }
            
            return Ok(stickyNote);
        }

        [HttpPost]
        public async Task<IActionResult> AddStickyNote(StickyNote stickyNote)
        {
            stickyNote.Id = Guid.NewGuid();

            await stickyNotesDbContext.StickyNotes.AddAsync(stickyNote);
            await stickyNotesDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStickyNoteById), new { id = stickyNote.Id }, stickyNote);

        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateStickyNote([FromRoute] Guid id, [FromBody] StickyNote updatedStickyNote)
        {
            var existingNote = await stickyNotesDbContext.StickyNotes.FindAsync(id);

            if(existingNote == null)
            {
                return NotFound();
            }

            existingNote.Title = updatedStickyNote.Title;
            existingNote.Description = updatedStickyNote.Description;
            existingNote.IsVisible = updatedStickyNote.IsVisible;

            await stickyNotesDbContext.SaveChangesAsync();

            return Ok(existingNote);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteStickyNote([FromRoute] Guid id)
        {
            var stickyNote = await stickyNotesDbContext.StickyNotes.FindAsync(id);

            if(stickyNote == null)
            {
                return NotFound();
            }

            stickyNotesDbContext.StickyNotes.Remove(stickyNote);
            await stickyNotesDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
