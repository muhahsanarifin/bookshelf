const LeftNavFiturs = document.querySelector(".left-nav").children;
addPointer(LeftNavFiturs);

const rigthNavFiturs = document.querySelector(".right-nav").children;
addPointer(rigthNavFiturs);

const asideContensMenu = document.querySelectorAll("a.menu");

addPointer(asideContensMenu)

function addPointer (param) {

	for (const pointer of param) {
		pointer.style.cursor = "pointer";
	}	
}

const mainMenu = document.querySelector(".main-menu");
mainMenu.addEventListener("click", function(){
	let aside = document.querySelector(".aside");
	menuList(aside)
})

function menuList(param) {
	param.classList.toggle("open-aside");
}

const searchBook = document.getElementById("searchBook");
searchBook.addEventListener("keyup", function(){
	let input =document.getElementById("searchBook"),
			filter = input.value.toUpperCase(),
			article = document.getElementsByTagName("article"),
			textValue;

	for (let index = 0; index < article.length; index++) {
    let itemBook = article[index];

    textValue = itemBook.textContent || itemBook.innerText;

    if (textValue.toUpperCase().indexOf(filter) > -1) {
      article[index].style.display = "";
    } else {
      article[index].style.display = "none";
    }
  }		

});

const books = [];
const RENDER_EVENT ='render-book';

document.addEventListener('DOMContentLoaded', function(){
	
	const bookSubmit = document.getElementById("inputBook");
	
	bookSubmit.addEventListener('submit', function(event){
		event.preventDefault();
		
		addBook();
	
	});

	if (isStorageExist()) {
		loadDataFromStorage();
	}
	
});

function addBook() {

	const bookTitle = document.getElementById("inputBookTitle").value;
	const bookAuthor = document.getElementById("inputBookAuthor").value;
	const bookYear = document.getElementById("inputBookYear").value;
	const checkBook = document.getElementById("inputBookIsCompleted").checked;

	const generateID = generateId();

	const bookObject = generateBookObject(generateID, bookTitle,bookAuthor, bookYear, checkBook);

	books.push(bookObject);

	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function generateId() {
	return +new Date();
};

function generateBookObject(id, title, author, year, isCompleted) {
	return {
		id,
		title,
		author,
		year,
		isCompleted
	}
}

document.addEventListener(RENDER_EVENT, function(){
	const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
	incompleteBookshelfList.innerHTML = '';

	const completedBookshelfList = document.getElementById("completedBookshelfList");
	completedBookshelfList.innerHTML = '';

	for(const bookItem of books) {
		const bookElement = makeBook(bookItem);

		if(!bookItem.isCompleted) {
			
			incompleteBookshelfList.append(bookElement);

		}else {
			completedBookshelfList.append(bookElement);
		}
	}

})

function makeBook(bookObject) {
	const textTitle = document.createElement("h3");
	textTitle.innerText = bookObject.title;

	const textAuthor = document.createElement("p");
	textAuthor.innerText = `Penulis : ${bookObject.author}`;

	const textYear = document.createElement("p");
	textYear.innerText = `Tahun : ${bookObject.year}`;

	const article = document.createElement("article");
	article.classList.add("book-item");
	article.append(textTitle,textAuthor,textYear);
	article.setAttribute("id",`book-${bookObject.id}`);


	if(bookObject.isCompleted) {
		const undoButton = document.createElement("button");
		undoButton.classList.add("undo");

		undoButton.addEventListener("click", function() {
      undoBookFromCompleted(bookObject.id);
    });

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("delete");

		deleteButton.addEventListener("click", function(){
			removeBookFromCompleted(bookObject.id);
		})

		const actionButton = document.createElement("div");
		actionButton.classList.add("action-button");
		actionButton.append(undoButton, deleteButton);

		const read = document.createElement("p");
		read.innerHTML ="Selesai dibaca";
		read.classList.add("read");

		const action = document.createElement("div");
		action.classList.add("action");
		action.append(read, actionButton);

		article.append(action);

	}else {
		const checked = document.createElement("button");
		checked.classList.add("checked");

		checked.addEventListener('click', function(){
			addBookToCompleted(bookObject.id);
		})

		const actionButton = document.createElement("div");
		actionButton.classList.add("action-button");
		actionButton.append(checked);

		const notRead = document.createElement("p");
		notRead.innerHTML = "Belum selesai dibaca";
		notRead.classList.add("not-read");

		const action = document.createElement("div");
    action.classList.add("action");
		action.append(notRead, actionButton);

		article.append(action);
	}

	return article;
}

function addBookToCompleted(bookId) {
	const bookTarget = findBook(bookId);

	if(bookTarget == null) return;

	bookTarget.isCompleted =true;

	document.dispatchEvent(new Event(RENDER_EVENT));
	
	saveData();
}

function findBook(bookId) {
	for(const bookItem of books) {
		if(bookItem.id === bookId) {
			return bookItem;
		}
	}
	return null;
}

function undoBookFromCompleted(bookId) {
	const bookTarget = findBook(bookId);

	if (bookTarget == null) return;

	bookTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	
	saveData();
}

function removeBookFromCompleted(bookId) {
	const bookTarget = findBookIndex(bookId);

	if(bookTarget === -1) return;

	books.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	
	saveData();
}

function findBookIndex(bookId) {
	for (const index in books) {
		if(books[index].id === bookId) {
			return index;
		}
	}

	return -1;
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
}

function isStorageExist() {
	if (typeof(Storage) === undefined) {
		alert("Kemungkin browser anda tidak mendukung local storage");
		return false;
	}
	return true;
}

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const book of data) {
			books.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}