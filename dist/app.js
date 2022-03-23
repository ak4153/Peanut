"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function ProjectInputLogger(logString) {
    return function (constructor) { };
}
//Input decorator
function BindThis(_, _2, descriptor) {
    //binds this to a function
    //submitHandler
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjustedDescriptor;
}
function validate(settings) {
    let isValid = { valid: true, message: '' };
    if (settings.required && !settings.value) {
        isValid = { valid: false, message: 'required fields are missing' };
    }
    if (settings.minLength &&
        typeof settings.value === 'string' &&
        settings.value.trim().length < settings.minLength) {
        isValid = { valid: false, message: 'input too short' };
    }
    if (settings.maxLength &&
        typeof settings.value === 'string' &&
        settings.value.trim().length > settings.maxLength) {
        isValid = { valid: false, message: 'input too long' };
    }
    if (settings.min &&
        typeof settings.value === 'number' &&
        settings.value < settings.min) {
        isValid = {
            valid: false,
            message: `minimal value ${settings.min} yours ${settings.value}`,
        };
    }
    if (settings.max &&
        typeof settings.value === 'number' &&
        settings.value > settings.max) {
        isValid = {
            valid: false,
            message: `maximal value ${settings.max} yours ${settings.value}`,
        };
    }
    console.log(isValid.message);
    return isValid;
}
//component class
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostElementId);
        const importedProjectsListNode = document.importNode(this.templateEl.content, true);
        this.el = importedProjectsListNode.firstElementChild;
        if (newElementId) {
            this.el.id = newElementId;
        }
        this.attach(true);
    }
    attach(insertAtStart) {
        switch (insertAtStart) {
            case true:
                this.hostEl.insertAdjacentElement('afterbegin', this.el);
            case false:
                this.hostEl.insertAdjacentElement('beforeend', this.el);
            default:
                break;
        }
    }
}
class State {
    constructor() {
        this.listneres = [];
    }
    addListener(listnerFn) {
        this.listneres.push(listnerFn);
    }
}
//singleton class initiated once
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        return (this.instance = new ProjectState());
    }
    addProject(title, description, people, status) {
        const newProject = new Project(Math.random().toString(), description, title, people, ProjectStatus.active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    transferProject(prjId, newStatus) {
        const project = this.projects.find((project) => prjId === project.id);
        if (project) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listnerFn of this.listneres) {
            listnerFn(this.projects.slice());
        }
    }
}
__decorate([
    BindThis
], ProjectState.prototype, "updateListeners", null);
const projectState = ProjectState.getInstance();
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["active"] = 0] = "active";
    ProjectStatus[ProjectStatus["inactive"] = 1] = "inactive";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        return this.project.people === 1
            ? `1 person assigned`
            : `${this.project.people} persons assigned`;
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(event) { }
    configure() {
        this.el.addEventListener('dragstart', this.dragStartHandler);
        this.el.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.el.querySelector('h2').innerText = this.project.title;
        this.el.querySelector('h3').innerText = this.project.description;
        this.el.querySelector('p').innerText = this.persons;
    }
}
__decorate([
    BindThis
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    BindThis
], ProjectItem.prototype, "dragEndHandler", null);
//projectlist class
class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        this.el.addEventListener('dragover', this.dragOverHandler);
        this.el.addEventListener('dragleave', this.dragLeaveHandler);
        this.el.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((project) => {
                if (this.type === 'active') {
                    return project.status === ProjectStatus.active;
                }
                else
                    return project.status === ProjectStatus.inactive;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.el.querySelector('ul').id = listId;
        this.el.querySelector('h2').textContent =
            this.type.toUpperCase() + ' PROJECTS';
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.el.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dragLeaveHandler(event) { }
    dropHandler(event) {
        var _a;
        projectState.transferProject((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain'), this.type === 'active' ? ProjectStatus.active : ProjectStatus.inactive);
        const listEl = this.el.querySelector('ul');
        listEl.classList.remove('droppable');
        this.el.removeEventListener('dragleave', this.dragLeaveHandler);
        this.el.removeEventListener('drop', this.dropHandler);
        this.el.removeEventListener('dragover', this.dragOverHandler);
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            //   const listItemEl = document.createElement('li');
            //   listItemEl.textContent = prjItem.title;
            //   listEl.appendChild(listItemEl);
            new ProjectItem(this.el.querySelector('ul').id, prjItem);
        }
    }
}
__decorate([
    BindThis
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    BindThis
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    BindThis
], ProjectList.prototype, "dropHandler", null);
//ProjectInput Class
let ProjectInput = class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputEl = this.el.querySelector('#title');
        this.descriptionInputEl = (this.el.querySelector('#description'));
        this.peopleInputEl = this.el.querySelector('#people');
        this.configure();
    }
    configure() {
        this.el.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    gatherInputData() {
        return !(this.titleInputEl.value.trim().length === 0 ||
            this.peopleInputEl.value.trim().length === 0 ||
            this.descriptionInputEl.value.trim().length === 0)
            ? [
                this.titleInputEl.value,
                this.descriptionInputEl.value,
                +this.peopleInputEl.value,
            ]
            : console.log('error');
    }
    clearInputs() {
        this.titleInputEl.value = '';
        this.descriptionInputEl.value = '';
        this.peopleInputEl.value = '';
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.gatherInputData();
        if (Array.isArray(userInput)) {
            {
                const [title, description, people] = userInput;
                if (validate({
                    value: title,
                    required: true,
                    minLength: 5,
                    maxLength: 10,
                }).valid &&
                    validate({
                        value: description,
                        required: true,
                        minLength: 5,
                        maxLength: 25,
                    }).valid &&
                    validate({ value: people, required: true, min: 1, max: 5 }).valid) {
                    projectState.addProject(title, description, people, ProjectStatus.active);
                    this.clearInputs();
                }
            }
        }
    }
};
__decorate([
    BindThis
], ProjectInput.prototype, "submitHandler", null);
ProjectInput = __decorate([
    ProjectInputLogger('logging ProjectInput...')
], ProjectInput);
const input = new ProjectInput();
const activePrj = new ProjectList('active');
const finishedPrj = new ProjectList('inactive');
