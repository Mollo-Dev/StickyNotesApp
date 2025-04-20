(() => {
  const saveButton = document.querySelector('#btnSave');
  const deleteButton = document.querySelector('#btnDelete');
  const titleInput = document.querySelector('#title');
  const descriptionInput = document.querySelector('#description');
  const notesContainer = document.querySelector('#notes__container');

  const showMessage = (msg, type = 'success') => {
    const msgBox = document.createElement('div');
    msgBox.textContent = msg;
    msgBox.className = `message ${type}`; 
    msgBox.style.cssText = 'background:#d1fae5; color:#065f46; padding:10px; margin:10px 0; border-radius:5px; font-weight:bold;';
    document.body.prepend(msgBox);
    setTimeout(() => msgBox.remove(), 3000); 
  };

  // the function to reset the form after every action
  function clearForm() {
    titleInput.value = '';
    descriptionInput.value = '';
    deleteButton.classList.add('hidden');
    saveButton.removeAttribute('data-id');
    deleteButton.removeAttribute('data-id');
  }

  function displayStickyNoteInForm(stickyNote) {
    titleInput.value = stickyNote.title;
    descriptionInput.value = stickyNote.description;
    deleteButton.classList.remove('hidden');
    deleteButton.setAttribute('data-id', stickyNote.id);
    saveButton.setAttribute('data-id', stickyNote.id);
  }

  async function getStickyNoteById(id) {
    try {
      const res = await fetch(`https://localhost:7266/api/StickyNotes/${id}`);
      const data = await res.json();
      displayStickyNoteInForm(data);
    } catch (err) {
      console.error("Failed to get note:", err);
      showMessage("Failed to load note.", "error");
    }
  }

  function populateForm(id) {
    getStickyNoteById(id);
  }

  async function addStickyNote(title, description) {
    const body = {
      title: title,
      description: description,
      isVisible: true
    };

    try {
      const res = await fetch('https://localhost:7266/api/stickyNotes', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Add failed");

      await res.json();
      clearForm();
      await getAllStickyNotes();
      showMessage("Sticky note added successfully!");
    } catch (err) {
      console.error("Add error:", err);
      showMessage("Failed to add sticky note.", "error");
    }
  }

  async function displayStickyNotes(stickyNotes) {
    let allNotes = '';

    stickyNotes.forEach(stickyNote => {
      const noteElement = `
        <div class="stickyNote" data-id="${stickyNote.id}">
          <h3>${stickyNote.title}</h3>
          <p>${stickyNote.description}</p>
        </div>
      `;
      allNotes += noteElement;
    });

    notesContainer.innerHTML = allNotes;

    document.querySelectorAll('.stickyNote').forEach(note => {
      note.addEventListener('click', () => {
        populateForm(note.dataset.id);
      });
    });
  }

  async function getAllStickyNotes() {
    try {
      const res = await fetch('https://localhost:7266/api/StickyNotes');
      const data = await res.json();
      displayStickyNotes(data);
    } catch (err) {
      console.error("Fetch all notes error:", err);
      showMessage("Failed to load notes.", "error");
    }
  }

  async function updateStickyNote(id, title, description) {
    const body = {
      title: title,
      description: description,
      isVisible: true
    };

    try {
      const res = await fetch(`https://localhost:7266/api/StickyNotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Update failed");

      await res.json();
      clearForm();
      await getAllStickyNotes();
      showMessage("Sticky note updated.");
    } catch (err) {
      console.error("Update error:", err);
      showMessage("Failed to update note.", "error");
    }
  }

  async function deleteStickyNote(id) {
    try {
      const res = await fetch(`https://localhost:7266/api/StickyNotes/${id}`, {
        method: 'DELETE',
        headers: {
          "content-type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Delete failed");

      clearForm();
      await getAllStickyNotes();
      showMessage("Sticky note deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      showMessage("Failed to delete note.", "error");
    }
  }

  // adding event listener for the save button with two functions
  saveButton.addEventListener('click', () => {
    const id = saveButton.dataset.id;
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !description) {
      showMessage("Title and description required!!", "error");
      return;
    }

    if (id) {
      updateStickyNote(id, title, description);
    } else {
      addStickyNote(title, description);
    }
  });

  deleteButton.addEventListener('click', () => {
    const id = deleteButton.dataset.id;
    if (id)
    {
      deleteStickyNote(id);
    } 
  });

  getAllStickyNotes();

  document.querySelector('#darkModeToggle').addEventListener('change', (e) => {
    document.body.classList.toggle('dark', e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
  });
  
  window.addEventListener('DOMContentLoaded', () => {
    const isDark = JSON.parse(localStorage.getItem('darkMode'));
    document.body.classList.toggle('dark', isDark);
    document.querySelector('#darkModeToggle').checked = isDark;
  });
  
  // Auto-save to localStorage
  function autoSaveDraft() {
    const draft = {
      title: titleInput.value,
      description: descriptionInput.value
    };
    localStorage.setItem('draftNote', JSON.stringify(draft));
  }

  // Load saved draft if any
  function loadDraftNote() {
    const draft = JSON.parse(localStorage.getItem('draftNote'));
    if (draft) {
      titleInput.value = draft.title;
      descriptionInput.value = draft.description;
    }
  }

  // Trigger auto-save on input
  titleInput.addEventListener('input', autoSaveDraft);
  descriptionInput.addEventListener('input', autoSaveDraft);

  // Load draft on page load
  loadDraftNote();

})();
