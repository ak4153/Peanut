var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BindThis } from '../decorators/bindthis.js';
import { ProjectStatus } from '../models/project-model.js';
import { Project } from '../models/project-model.js';
class State {
    constructor() {
        this.containerArray = [];
    }
    addItem(itemFn) {
        this.containerArray.push(itemFn);
    }
}
//singleton class initiated once
export class ProjectState extends State {
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
    BindThis
], ProjectState.prototype, "updateContainer", null);
export const projectState = ProjectState.getInstance();
