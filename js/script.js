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

    static getTasks() {
        const list = localStorage.getItem("tasks");
        return !list ? [] : JSON.parse(list);
    }

    static deleteTaskById(id) {
        const list = Task.getTasks().filter(task => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(list));
        return list;
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
    img.addEventListener("click", () => {
        Task.editTask({...task, status: task.status === 'pending' ?  'success' : 'pending'});
        renderTasks();
    });
    const del = document.createElement('div');
    del.classList.add('task-delete');
    del.addEventListener("click", (e) => {
        e.stopPropagation();
        const answer = confirm('Удалить задачу совсем-совсем?');
        if (answer) {
            Task.deleteTaskById(task.id);
            renderTasks();
        }
    });
    colStatus.appendChild(img);
    row.appendChild(colDate);
    row.appendChild(colTitle);
    row.appendChild(colDesc);
    row.appendChild(colStatus);
    taskListItem.appendChild(row);
    taskListItem.appendChild(del);
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

const searchTasks = (e) => {
    if (!e.target.value.trim().length) {
        renderTasks();
        return;
    }
    const list = Task.getTasks().filter(i => i.title.toLowerCase().includes(e.target.value.toLowerCase()));
    renderTasks(list);
}

window.onload = function() {
    const search = document.getElementById("search-input");
    const form = document.getElementById("add-form");

    search.addEventListener("input", searchTasks);
    form.addEventListener("submit", createTask);

    renderTasks();
};
