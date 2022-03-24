"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    //Input decorator
    function BindThis(_, _2, descriptor) {
        //binds "this" to a function
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
    App.BindThis = BindThis;
    function ProjectInputLogger(logString) {
        return function (constructor) { };
    }
    App.ProjectInputLogger = ProjectInputLogger;
})(App || (App = {}));
var App;
(function (App) {
    class State {
        constructor() {
            this.containerArray = [];
        }
        addItem(itemFn) {
            this.containerArray.push(itemFn);
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
            const newProject = new App.Project(Math.random().toString(), description, title, people, App.ProjectStatus.active);
            this.projects.push(newProject);
            this.updateContainer();
        }
        transferProject(prjId, newStatus) {
            const project = this.projects.find((project) => prjId === project.id);
            if (project) {
                project.status = newStatus;
                this.updateContainer();
            }
        }
        updateContainer() {
            for (const listnerFn of this.containerArray) {
                listnerFn(this.projects.slice());
            }
        }
    }
    __decorate([
        App.BindThis
    ], ProjectState.prototype, "updateContainer", null);
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["active"] = 0] = "active";
        ProjectStatus[ProjectStatus["inactive"] = 1] = "inactive";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
    //component class
    /**
     * @param ()takes HostEl, TemplateEl and appends to project
     * @param ?newElementId?: string renames the newElement
     */
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateEl = (document.getElementById(templateId));
            this.hostEl = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateEl.content, true);
            this.el = importedNode.firstElementChild;
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
    App.Component = Component;
})(App || (App = {}));
/// < reference path="component.ts />
/// < reference path="../utils/validation.ts />
var App;
(function (App) {
    let ProjectInput = class ProjectInput extends App.Component {
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
                    if (App.validate({
                        value: title,
                        required: true,
                        minLength: 5,
                        maxLength: 10,
                    }).valid &&
                        App.validate({
                            value: description,
                            required: true,
                            minLength: 5,
                            maxLength: 25,
                        }).valid &&
                        App.validate({ value: people, required: true, min: 1, max: 5 }).valid) {
                        App.projectState.addProject(title, description, people, App.ProjectStatus.active);
                        this.clearInputs();
                    }
                }
            }
        }
    };
    __decorate([
        App.BindThis
    ], ProjectInput.prototype, "submitHandler", null);
    ProjectInput = __decorate([
        App.ProjectInputLogger('logging ProjectInput...')
    ], ProjectInput);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
/// <reference path="component.ts"/>
var App;
(function (App) {
    class ProjectList extends App.Component {
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
            //creates a function to run on each update
            App.projectState.addItem((projects) => {
                const relevantProjects = projects.filter((project) => {
                    //if the type of the project-list
                    if (this.type === 'active') {
                        //returns an active project
                        return project.status === App.ProjectStatus.active;
                    }
                    else
                        return project.status === App.ProjectStatus.inactive;
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
        dragLeaveHandler(event) {
            const listEl = this.el.querySelector('ul');
            listEl.classList.remove('droppable');
        }
        dropHandler(event) {
            var _a;
            const listEl = this.el.querySelector('ul');
            listEl.classList.remove('droppable');
            App.projectState.transferProject((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain'), this.type === 'active' ? App.ProjectStatus.active : App.ProjectStatus.inactive);
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
                //              active list/inactive
                new App.ProjectItem(this.el.querySelector('ul').id, prjItem);
            }
        }
    }
    __decorate([
        App.BindThis
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.BindThis
    ], ProjectList.prototype, "dragLeaveHandler", null);
    __decorate([
        App.BindThis
    ], ProjectList.prototype, "dropHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
/// < reference path="component.ts />
var App;
(function (App) {
    class ProjectItem extends App.Component {
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
        App.BindThis
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        App.BindThis
    ], ProjectItem.prototype, "dragEndHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
/// <reference path="models/drag-drop-interfaces.ts"/>
/// <reference path="decorators/bindthis.ts"/>
/// <reference path="state/project-state.ts"/>
/// <reference path="models/project-model.ts"/>
/// <reference path="util/validation.ts"/>
/// <reference path="components/component.ts"/>
/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-list.ts"/>
/// <reference path="components/project-item.ts" />
var App;
(function (App) {
    const input = new App.ProjectInput();
    const activePrj = new App.ProjectList('active');
    const finishedPrj = new App.ProjectList('inactive');
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map