const form = document.querySelector('[data-form]');
const list = document.querySelector('[data-list]');
const input = document.querySelector('[data-input]');

class Storage {
    static addToStorage(toDoArr) {
        localStorage.setItem('todo', JSON.stringify(toDoArr));
    }

    static getFromStorage() {
        try {
            const storedData = localStorage.getItem('todo');
            return storedData ? JSON.parse(storedData) : [];
        } catch (error) {
            
            return [];
        }
    }
}
let id = 0;
let toDoArr = Storage.getFromStorage();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    id++;
    const toDo = new ToDo(id, input.value);
    toDoArr.push(toDo);

    UI.displayData();
    UI.clear();

    Storage.addToStorage(toDoArr);
});

class ToDo {
    constructor(id, toDo) {
        this.id = id;
        this.toDo = toDo;
    }
}

class UI {
    static displayData() {
        let displayData = toDoArr.map((entry) => {
            return `<div class="todo">
                        <p>${entry.toDo}</p>
                        <span class='remove' data-id=${entry.id}>🗑️</span>
                    </div>`;
        });
        list.innerHTML = displayData.join(' ');
    }

    static clear() {
        input.value = '';
    }
}

window.addEventListener("DOMContentLoaded", () => {
    UI.displayData();
});

list.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
        const btnId = e.target.dataset.id;
        toDoArr = toDoArr.filter((x) => x.id !== +btnId);
        UI.displayData();
        Storage.addToStorage(toDoArr);
    }
});
