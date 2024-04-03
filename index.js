const form = document.querySelector('[data-form]');
const list = document.querySelector('[data-list]');
const input = document.querySelector('[data-input]');
const deleteAll = document.getElementById('deleteAll')


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
    toDoArr.unshift(toDo);

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
        let displayData = toDoArr.map((entry, index) => {
            return `<div class="todo" draggable="true" data-index = ${index}> 
                        <p class='entryText'>${entry.toDo}</p>
                        <div class='icons'>

                        
                        <span class='edit' data-id=${entry.id}>✍️</span>
                        <span class='remove' data-id=${entry.id}>🗑️</span>
                        </div>
                        
                    </div>`;
                    /*<span class='up' data-id=${entry.id}>☝️</span>
                        <span class='down' data-id=${entry.id}>👇</span>*/
        });
        if (toDoArr.length > 0) {
            deleteAll.innerHTML = `Delete All 🚮`
            deleteAll.style.visibility = 'visible';
        } else {
            deleteAll.innerHTML = ''
            deleteAll.style.visibility = 'hidden';
        }
        list.innerHTML = displayData.join(' ');
    }

    static clear() {
        input.value = '';
    }

}

window.addEventListener("DOMContentLoaded", () => {
    UI.displayData();
});
let draggedItemIndex = null;
let touchStartPosition = null;
let touchPlaceholder = null;

list.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartPosition = touch.clientY;
    draggedItemIndex = +e.target.getAttribute('data-index');
    const draggedItem = e.target;
    touchPlaceholder = document.createElement('div');
    touchPlaceholder.classList.add('touch-placeholder');
    touchPlaceholder.style.height = draggedItem.offsetHeight + 'px';
    draggedItem.style.opacity = '0.5';
    draggedItem.parentNode.insertBefore(touchPlaceholder, draggedItem.nextSibling);
});

list.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (draggedItemIndex !== null) {
        const touch = e.touches[0];
        const deltaY = touch.clientY - touchStartPosition;
        touchPlaceholder.style.transform = `translateY(${deltaY}px)`;
    }
});

list.addEventListener('touchend', (e) => {
    if (draggedItemIndex !== null) {
        const touchEndPosition = e.changedTouches[0].clientY;
        const deltaY = touchEndPosition - touchStartPosition;
        const draggedItem = list.querySelector(`[data-index="${draggedItemIndex}"]`);
        if (draggedItem) {
            draggedItem.style.opacity = '1';
        }
        touchPlaceholder.remove();
        if (Math.abs(deltaY) > 50) {
            const draggedItem = toDoArr[draggedItemIndex];
            const droppedItemIndex = draggedItemIndex + (deltaY > 0 ? 1 : -1);
            if (draggedItemIndex !== null && droppedItemIndex >= 0 && droppedItemIndex < toDoArr.length && draggedItemIndex !== droppedItemIndex) {
                toDoArr.splice(draggedItemIndex, 1);
                toDoArr.splice(droppedItemIndex, 0, draggedItem);
                UI.displayData();
                Storage.addToStorage(toDoArr);
            }
        }
    }
    draggedItemIndex = null;
    touchStartPosition = null;
});

let iconChange = true;
list.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
        const btnId = e.target.dataset.id;
        toDoArr = toDoArr.filter((x) => x.id !== +btnId);
        UI.displayData();
        Storage.addToStorage(toDoArr);
    }
    if (e.target.classList.contains('edit')) {
        let p = e.target.parentElement.parentElement.firstElementChild;
        const btnId = e.target.dataset.id;

        if (iconChange) {
            p.setAttribute('contenteditable', 'true');
            p.focus();
            p.style.opacity = '50%'
            e.target.textContent = "Save";
            iconChange = !iconChange



        } else {
            e.target.textContent = "✍️";
            p.style.color = 'black';
            p.style.opacity = '100%'
            p.removeAttribute('contenteditable')
            const newArr = toDoArr.findIndex((item) => item.id === +btnId || '');
            toDoArr[newArr].toDo = p.textContent;
            Storage.addToStorage(toDoArr)
            iconChange = !iconChange


        }
    }
    // if (e.target.classList.contains('up')) {
    //     let p = e.target.parentElement.parentElement.firstElementChild;
    //     const btnId = e.target.dataset.id;
    //     const newArr = toDoArr.findIndex((item) => item.id === +btnId || '');
    //     if(newArr-1 >=0){
    //         let prevTemp = toDoArr[newArr - 1];
    //         toDoArr[newArr - 1] = toDoArr[newArr];
    //         toDoArr[newArr] = prevTemp;
    //         UI.displayData();
    //         Storage.addToStorage(toDoArr);
    // }
        
    // }
    // if (e.target.classList.contains('down')) {
    //     let p = e.target.parentElement.parentElement.firstElementChild;
    //     const btnId = e.target.dataset.id;
    //     const newArr = toDoArr.findIndex((item) => item.id === +btnId || '');
    //     if(newArr+1 <toDoArr.length){
    //         let prevTemp = toDoArr[newArr + 1];
    //         toDoArr[newArr + 1] = toDoArr[newArr];
    //         toDoArr[newArr] = prevTemp;
    //         UI.displayData();
    //         Storage.addToStorage(toDoArr);
    // }
    // }
});
deleteAll.addEventListener('click', (e) => {
    toDoArr = [];
    UI.displayData();
    Storage.addToStorage(toDoArr)

})
