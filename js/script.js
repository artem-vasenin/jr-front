class Task {
    constructor(date, title, description) {
        this.date = Task.dateFormat(date);
        this.title = title;
        this.description = description;
        this.id = Date.now();
        this.status = 'pending';
    }

    static dateFormat(date) {
        if (date.length === 10 && date.includes('-')) {
            const list = date.split('-');
            return list[2] + '-' + list[1] + '-' + list[0];
        }
        const dt = new Date();
        const day = dt.getDay() < 10 ? '0' + dt.getDay() : dt.getDay();
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
        const year = dt.getFullYear();
        return `${day}-${month}-${year}`;
    }

    static dateFormatReverse(date) {
        if (date.length === 10 && date.includes('-')) {
            const list = date.split('-');
            return list[2] + '-' + list[1] + '-' + list[0];
        }
        const dt = new Date();
        const day = dt.getDay() < 10 ? '0' + dt.getDay() : dt.getDay();
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
        const year = dt.getFullYear();
        return `${year}-${month}-${day}`;
    }

    static getTasks() {
        const list = localStorage.getItem("tasks");
        return !list ? [] : JSON.parse(list);
    }

    static deleteTaskById(id) {
        const list = Task.getTasks().filter(task => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(list));
        return list;
    }

    static getTaskById(id) {
        const task = Task.getTasks().find(task => task.id === id);
        return task ? task : null;
    }

    static editTask(task) {
        const list = Task.getTasks().map(i => {
            if (i.id === task.id) {
                i.date = task.date;
                i.title = task.title;
                i.description = task.description;
                i.status = task.status;
            }
            return i;
        });
        localStorage.setItem("tasks", JSON.stringify(list));
        return list;
    }

    addTask() {
        const list = Task.getTasks();
        const task = {
            id: this.id,
            date: this.date,
            title: this.title,
            description: this.description,
            status: this.status,
        }
        list.push(task);
        localStorage.setItem("tasks", JSON.stringify(list));
        return task;
    }
}

const onTaskRemove = (e, id) => {
    e.stopPropagation();
    const answer = confirm('Удалить задачу совсем-совсем?');
    if (answer) {
        Task.deleteTaskById(id);
        renderTasks();
    }
};

const onToggleTaskStatus = (task) => {
    Task.editTask({...task, status: task.status === 'pending' ?  'success' : 'pending'});
    renderTasks();
}

const onEditTask = (e, id) => {
    e.stopPropagation();
    const task = Task.getTaskById(id);
    if (!task) return;
    const idField = document.getElementById('edit-id');
    const date = document.getElementById('edit-date');
    const title = document.getElementById('edit-title');
    const desc = document.getElementById('edit-description');
    const status = document.getElementById('edit-status');
    const modal = document.getElementById('modal');
    idField.value = task.id;
    date.value = Task.dateFormatReverse(task.date);
    title.value = task.title;
    desc.value = task.description;
    status.value = task.status;
    modal.classList.add('modal--active');
}

const onCancel = () => {
    const modal = document.getElementById('modal');
    const form = document.getElementById('edit-form');
    modal.classList.remove('modal--active');
    form.reset();
}

const createListItem = (task) => {
    let imgScr = 'img/task-pending-icon.svg';
    let imgClass = 'task-pending-icon';
    const taskListItem = document.createElement('li');
    taskListItem.classList.add('task-list-item');
    if (task.status === 'pending') {
        taskListItem.classList.add('task-list-item--pending');
    } else if (task.status === 'success') {
        taskListItem.classList.add('task-list-item--success');
        imgScr = 'img/task-success-icon.svg';
        imgClass = 'task-success-icon';
    }
    const row = document.createElement('div');
    row.classList.add('task-content');
    const colDate = document.createElement('div');
    colDate.classList.add('task-data');
    colDate.textContent = task.date;
    const colTitle = document.createElement('div');
    colTitle.classList.add('task-title');
    colTitle.textContent = task.title;
    const colDesc = document.createElement('div');
    colDesc.classList.add('task-desc');
    colDesc.textContent = task.description;
    const colStatus = document.createElement('div');
    colStatus.classList.add('task-status');
    const img = document.createElement("img");
    img.src = imgScr;
    img.alt = "Icon";
    img.classList.add(imgClass);
    img.addEventListener("click", () => onToggleTaskStatus(task));
    const del = document.createElement('div');
    del.classList.add('task-delete');
    del.addEventListener("click", (e) => onTaskRemove(e, task.id));
    const editIcon = document.createElement('img');
    editIcon.src = 'img/edit_icon.svg';
    editIcon.alt = "Icon";
    editIcon.classList.add('edit-icon');
    const edit = document.createElement('div');
    edit.classList.add('task-edit');
    edit.appendChild(editIcon);
    edit.addEventListener("click", (e) => onEditTask(e, task.id));
    colStatus.appendChild(img);
    row.appendChild(colDate);
    row.appendChild(colTitle);
    row.appendChild(colDesc);
    row.appendChild(colStatus);
    taskListItem.appendChild(row);
    taskListItem.appendChild(del);
    taskListItem.appendChild(edit);
    return taskListItem;
};

const renderTasks = (searchList) => {
    const listEmpty = document.getElementById('list-empty');
    const listFilled = document.getElementById('list-filled');
    const taskList = document.getElementById('task-list');
    const list = searchList || Task.getTasks();
    taskList.innerHTML = '';
    if (!list.length) {
        listEmpty.classList.remove('row--hidden');
        listFilled.classList.add('row--hidden');
    } else {
        listEmpty.classList.add('row--hidden');
        listFilled.classList.remove('row--hidden');
        list.forEach(item => {
            taskList.appendChild(createListItem(item));
        })
    }
}

function createTask(e) {
    e.preventDefault();
    const taskData = {};
    const formData = new FormData(this);
    for (let [name, value] of formData.entries()) {
        taskData[name] = value;
    }
    const alert = document.getElementById('alert');
    const task = new Task(taskData.date, taskData.title, taskData.description);
    task.addTask();
    alert.classList.add('success');
    e.target.reset();
    renderTasks();
    setTimeout(() => {
        alert.classList.remove('success');
    }, 3000)
}

function editTask(e) {
    e.preventDefault();
    const taskData = {};
    const formData = new FormData(this);
    for (let [name, value] of formData.entries()) {
        taskData[name] = value;
    }
    Task.editTask({
        ...taskData,
        id: +taskData.id,
        date: Task.dateFormat(taskData.date),
    });
    renderTasks();
    onCancel();
}

const searchTasks = (e) => {
    if (!e.target.value.trim().length) {
        renderTasks();
        return;
    }
    const list = Task.getTasks()
        .filter(i => i.title.toLowerCase().includes(e.target.value.toLowerCase())
            || i.description.toLowerCase().includes(e.target.value.toLowerCase())
            || i.date.toLowerCase().includes(e.target.value.toLowerCase()));
    renderTasks(list);
}

window.onload = function() {
    const search = document.getElementById("search-input");
    const addForm = document.getElementById("add-form");
    const editForm = document.getElementById("edit-form");
    const cancel = document.getElementById("btn-cancel");

    search.addEventListener("input", searchTasks);
    addForm.addEventListener("submit", createTask);
    editForm.addEventListener("submit", editTask);
    cancel.addEventListener("click", onCancel);

    renderTasks();
};
