var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './component.js';
import validate from '../util/validation.js';
import { ProjectInputLogger, BindThis } from '../decorators/bindthis.js';
import { projectState } from '../state/project-state.js';
import { ProjectStatus } from '../models/project-model.js';
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
export default ProjectInput;
