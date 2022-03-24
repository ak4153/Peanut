var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './component.js';
import { BindThis } from '../decorators/bindthis.js';
import { projectState } from '../state/project-state.js';
import { ProjectStatus } from '../models/project-model.js';
import { ProjectItem } from './project-item.js';
export default class ProjectList extends Component {
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
        projectState.addItem((projects) => {
            const relevantProjects = projects.filter((project) => {
                //if the type of the project-list
                if (this.type === 'active') {
                    //returns an active project
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
    dragLeaveHandler(event) {
        const listEl = this.el.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    dropHandler(event) {
        var _a;
        const listEl = this.el.querySelector('ul');
        listEl.classList.remove('droppable');
        projectState.transferProject((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain'), this.type === 'active' ? ProjectStatus.active : ProjectStatus.inactive);
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
