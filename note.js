const noteContainer = document.querySelector('.note-container')
const modalContainer = document.querySelector('.modal-container')
const form = document.querySelector('form')
const titleInput = document.querySelector('#title')

class Note {
    constructor(title, body) {
        this.title = title,
            this.body = body,
            this.id = Math.random()
    }
}

// ------LOCAL STORAGE-----
// Function : Retrive notes from local storage
function getNotes() {
    let notes;
    if (localStorage.getItem('noteApp.notes') === null) {
        notes = []
    } else {
        notes = JSON.parse(localStorage.getItem('noteApp.notes'))
    }
    return notes
}
// Function : Add a note to local storage
function addNoteToLocalStorage(note) {
    const notes = getNotes()
    notes.push(note)
    localStorage.setItem('noteApp.notes', JSON.stringify(notes))
}
// Function : Remove a note from local storage
function removeNote(id) {
    const notes = getNotes()
    notes.forEach((note, index) => {
        if (note.id === id) {
            notes.splice(index, 1)
        }
        localStorage.setItem('noteApp.notes', JSON.stringify(notes))
    })
}

// Function: View note in modal
function activateNoteModal(title, body) {
    const modalTitle = document.querySelector('.modal__title')
    const modalBody = document.querySelector('.modal__body')
    modalTitle.textContent = title
    modalBody.textContent = body
    modalContainer.classList.add('active')
}

//Event:Closing the Modal Button
const modalBtn = document.querySelector('.modal__btn').addEventListener('click', () => {
    modalContainer.classList.remove('active')
})

// Event: Note Buttons
noteContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('note__view')) {
        const currentNote = e.target.closest('.note')
        const currentTitle = currentNote.querySelector('.note__title').textContent
        const currentBody = currentNote.querySelector('.note__body').textContent
        activateNoteModal(currentTitle, currentBody)
    }

    if (e.target.classList.contains('note__delete')) {
        const currentNote = e.target.closest('.note')
        showAlertMessage('Your Note Permanently Deleted', 'remove-message')
        currentNote.remove()
        const id = currentNote.querySelector('span').textContent
        removeNote(Number(id))
    }
})

// Event display notes
document.addEventListener('DOMContentLoaded', displayNotes)


function addNoteToList(note) {
    const newUiNote = document.createElement('div')
    newUiNote.classList.add('note')
    newUiNote.innerHTML = `
    <span hidden>${note.id}</span>
            <h2 class="note__title">${note.title}</h2>
            <p class="note__body">${note.body}
            </p>
            <div class="note__btns">
                <button class="note__btn note__view">View Detali</button>
                <button class="note__btn note__delete">Delete Note</button>
            </div>
    `
    noteContainer.appendChild(newUiNote)
}
// Function:Show Notes in Ui
function displayNotes() {
    const notes = getNotes()
    notes.forEach(note => {
        addNoteToList(note)
    })
}


// Function: Show alerts
function showAlertMessage(message, alertClass) {
    const alertDiv = document.createElement('div')
    alertDiv.className = `message ${alertClass}`
    form.insertAdjacentElement('beforebegin', alertDiv)
    alertDiv.appendChild(document.createTextNode(message))
    titleInput.focus()
    setTimeout(() => alertDiv.remove(), 2000)
}

// Event : Note button
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const noteInput = document.querySelector('#note')
    // Validate inputs
    if (titleInput.value.length > 0 && noteInput.value.length > 0) {
        const newNote = new Note(titleInput.value, noteInput.value)
        addNoteToList(newNote)
        addNoteToLocalStorage(newNote)
        titleInput.value = ''
        noteInput.value = ''
        showAlertMessage('Note Successfully added!', 'success-message')
        titleInput.focus()
    } else {
        showAlertMessage('Please add a title and a note', 'alert-message')
    }
})