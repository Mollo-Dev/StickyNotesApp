namespace StickyNotes.API.Models.Entities
{
    public class StickyNote
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsVisible {  get; set; }
    }
}
