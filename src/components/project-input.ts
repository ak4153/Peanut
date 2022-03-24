import Component from './component.js';
import validate from '../util/validation.js';
import { ProjectInputLogger, BindThis } from '../decorators/bindthis.js';
import { projectState } from '../state/project-state.js';
import { ProjectStatus } from '../models/project-model.js';

@ProjectInputLogger('logging ProjectInput...')
export default class ProjectInput extends Component<HTMLElement, HTMLElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputEl = <HTMLInputElement>this.el.querySelector('#title');
    this.descriptionInputEl = <HTMLInputElement>(
      this.el.querySelector('#description')
    );
    this.peopleInputEl = <HTMLInputElement>this.el.querySelector('#people');

    this.configure();
  }

  configure() {
    this.el.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private gatherInputData(): [string, string, number] | void {
    return !(
      this.titleInputEl.value.trim().length === 0 ||
      this.peopleInputEl.value.trim().length === 0 ||
      this.descriptionInputEl.value.trim().length === 0
    )
      ? [
          this.titleInputEl.value,
          this.descriptionInputEl.value,
          +this.peopleInputEl.value,
        ]
      : console.log('error');
  }

  private clearInputs() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInputEl.value = '';
  }

  @BindThis
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherInputData();
    if (Array.isArray(userInput)) {
      {
        const [title, description, people] = userInput;

        if (
          validate({
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
          validate({ value: people, required: true, min: 1, max: 5 }).valid
        ) {
          projectState.addProject(
            title,
            description,
            people,
            ProjectStatus.active
          );
          this.clearInputs();
        }
      }
    }
  }
}
