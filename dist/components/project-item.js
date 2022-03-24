var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './component.js';
import { BindThis } from '../decorators/bindthis.js';
export class ProjectItem extends Component {
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
