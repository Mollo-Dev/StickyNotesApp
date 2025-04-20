using Microsoft.EntityFrameworkCore;
using StickyNotes.API.Models.Entities;

namespace StickyNotes.API.Data
{
    public class StickyNotesDbContext : DbContext
    {
        public StickyNotesDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<StickyNote> StickyNotes { get; set; }
    }
}
