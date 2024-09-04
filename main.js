document.addEventListener('DOMContentLoaded', function () {
  const submitbuku = document.getElementById('bookSubmit');
  const searchbuku = document.getElementById('searchSubmit');

  submitbuku.addEventListener('click', function (event) {
      event.preventDefault();
      addbook();
  });

  searchbuku.addEventListener('click', function (event) {
      event.preventDefault();
      searchBook();
  });

  if (isStorageExist()) {
      loadDataFromStorage();
  }
});

const space = [];
const render_book = 'render_book';
const search_book = 'search_book';

function generatedID() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
      id,
      title,
      author,
      year: parseInt(year),
      isComplete
  };
}

function addbook() {
  const judulbuku = document.getElementById('inputBookTitle').value;
  const penulisbuku = document.getElementById('inputBookAuthor').value;
  const tahunbuku = document.getElementById('inputBookYear').value;
  const checkbuku = document.getElementById('inputBookIsComplete').checked;

  const addId = generatedID();
  const bookObject = generateBookObject(addId, judulbuku, penulisbuku, tahunbuku, checkbuku);
  space.push(bookObject);

  document.dispatchEvent(new Event(render_book));
  saveData();
}

document.addEventListener(render_book, function () {
  const incompleteBookList = document.getElementById('incompleteBookshelfList');
  const completeBookList = document.getElementById('completeBookshelfList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const bookItem of space) {
      const bookElement = makebook(bookItem);
      if (bookItem.isComplete) {
          completeBookList.append(bookElement);
      } else {
          incompleteBookList.append(bookElement);
      }
  }
});

function makebook(bookObject) {
  const titlebook = document.createElement('h2');
  titlebook.innerText = bookObject.title;
  const authorname = document.createElement('p');
  authorname.innerText = bookObject.author;
  const datebook = document.createElement('p');
  datebook.innerText = bookObject.year;

  const box = document.createElement('div');
  box.classList.add('book_item');
  box.append(titlebook, authorname, datebook);

  const actionBox = document.createElement('div');
  actionBox.classList.add('action');

  const toggleButton = document.createElement('button');
  toggleButton.innerText = bookObject.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', function() {
      toggleBookCompletion(bookObject.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.addEventListener('click', function() {
      removeBook(bookObject.id);
  });

  actionBox.append(toggleButton, deleteButton);
  box.append(actionBox);

  return box;
}

function toggleBookCompletion(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = !bookTarget.isComplete;
  document.dispatchEvent(new Event(render_book));
  saveData();
}

function removeBook(bookId) {
  const bookTargetIndex = findBookIndex(bookId);
  if (bookTargetIndex === -1) return;

  space.splice(bookTargetIndex, 1);
  document.dispatchEvent(new Event(render_book));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of space) {
      if (bookItem.id === bookId) {
          return bookItem;
      }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in space) {
      if (space[index].id === bookId) {
          return index;
      }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
      const parsed = JSON.stringify(space);
      localStorage.setItem('BOOKSHELF_APPS', parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem('BOOKSHELF_APPS');
  let data = JSON.parse(serializedData);

  if (data !== null) {
      for (const book of data) {
          space.push(book);
      }
  }

  document.dispatchEvent(new Event(render_book));
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
  }
  return true;
}

function searchBook() {
  const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const searchResults = space.filter(book => book.title.toLowerCase().includes(searchBookTitle));
  
  const incompleteBookList = document.getElementById('incompleteBookshelfList');
  const completeBookList = document.getElementById('completeBookshelfList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const bookItem of searchResults) {
      const bookElement = makebook(bookItem);
      if (bookItem.isComplete) {
          completeBookList.append(bookElement);
      } else {
          incompleteBookList.append(bookElement);
      }
  }
}


const searchFormHTML = document.getElementById('searchContainer').innerHTML = searchFormHTML;
