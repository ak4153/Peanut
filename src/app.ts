function ProjectInputLogger(logString: string): Function {
  return function (constructor: Function) {};
}
//Input decorator
function BindThis(_: any, _2: string | symbol, descriptor: PropertyDescriptor) {
  //binds this to a function
  //submitHandler
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

//validation
interface ToValidate {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
type Validated = {
  valid: boolean;
  message: string;
};
function validate(settings: ToValidate): Validated {
  let isValid: Validated = { valid: true, message: '' };

  if (settings.required && !settings.value) {
    isValid = { valid: false, message: 'required fields are missing' };
  }

  if (
    settings.minLength &&
    typeof settings.value === 'string' &&
    settings.value.trim().length < settings.minLength
  ) {
    isValid = { valid: false, message: 'input too short' };
  }
  if (
    settings.maxLength &&
    typeof settings.value === 'string' &&
    settings.value.trim().length > settings.maxLength
  ) {
    isValid = { valid: false, message: 'input too long' };
  }

  if (
    settings.min &&
    typeof settings.value === 'number' &&
    settings.value < settings.min
  ) {
    isValid = {
      valid: false,
      message: `minimal value ${settings.min} yours ${settings.value}`,
    };
  }
  if (
    settings.max &&
    typeof settings.value === 'number' &&
    settings.value > settings.max
  ) {
    isValid = {
      valid: false,
      message: `maximal value ${settings.max} yours ${settings.value}`,
    };
  }
  console.log(isValid.message);
  return isValid;
}

//component class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  el: U;

  constructor(
    templateId: string,
    hostElementId: string,

    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = <HTMLTemplateElement>document.getElementById(templateId);
    this.hostEl = <T>document.getElementById(hostElementId);

    const importedProjectsListNode = document.importNode(
      this.templateEl.content,
      true
    );

    this.el = <U>importedProjectsListNode.firstElementChild;
    if (newElementId) {
      this.el.id = newElementId;
    }
    this.attach(true);
  }
  private attach(insertAtStart: boolean) {
    switch (insertAtStart) {
      case true:
        this.hostEl.insertAdjacentElement('afterbegin', this.el);
      case false:
        this.hostEl.insertAdjacentElement('beforeend', this.el);
      default:
        break;
    }
  }
  abstract configure(): void;
  abstract renderContent(): void;
}

type Listner<T> = (items: T[]) => void;

abstract class State<T> {
  protected listneres: Listner<T>[] = [];

  addListener(listnerFn: Listner<T>) {
    this.listneres.push(listnerFn);
  }
}

//singleton class initiated once
class ProjectState extends State<Project> {
  private static instance: ProjectState;

  projects: Project[] = [];
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return (this.instance = new ProjectState());
  }

  addProject(
    title: string,
    description: string,
    people: number,
    status: ProjectStatus
  ) {
    const newProject = new Project(
      Math.random().toString(),
      description,
      title,
      people,
      ProjectStatus.active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  transferProject(prjId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => prjId === project.id);
    if (project) {
      project.status = newStatus;
      this.updateListeners();
    }
  }
  @BindThis
  private updateListeners() {
    for (const listnerFn of this.listneres) {
      listnerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

enum ProjectStatus {
  active,
  inactive,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

class ProjectItem
  extends Component<HTMLElement, HTMLElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    return this.project.people === 1
      ? `1 person assigned`
      : `${this.project.people} persons assigned`;
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  @BindThis
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }
  @BindThis
  dragEndHandler(event: DragEvent): void {}

  configure(): void {
    this.el.addEventListener('dragstart', this.dragStartHandler);
    this.el.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.el.querySelector('h2')!.innerText = this.project.title;
    this.el.querySelector('h3')!.innerText = this.project.description;
    this.el.querySelector('p')!.innerText = this.persons;
  }
}

//projectlist class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  constructor(private type: 'active' | 'inactive') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  configure(): void {
    this.el.addEventListener('dragover', this.dragOverHandler);
    this.el.addEventListener('dragleave', this.dragLeaveHandler);
    this.el.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: any[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.active;
        } else return project.status === ProjectStatus.inactive;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.el.querySelector('ul')!.id = listId;
    this.el.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }
  assignedProjects: Project[];

  @BindThis
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.el.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @BindThis
  dragLeaveHandler(event: DragEvent): void {}

  @BindThis
  dropHandler(event: DragEvent): void {
    projectState.transferProject(
      event.dataTransfer?.getData('text/plain') as string,
      this.type === 'active' ? ProjectStatus.active : ProjectStatus.inactive
    );
    const listEl = this.el.querySelector('ul')!;
    listEl.classList.remove('droppable');
    this.el.removeEventListener('dragleave', this.dragLeaveHandler);
    this.el.removeEventListener('drop', this.dropHandler);
    this.el.removeEventListener('dragover', this.dragOverHandler);
  }

  renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      //   const listItemEl = document.createElement('li');
      //   listItemEl.textContent = prjItem.title;
      //   listEl.appendChild(listItemEl);
      new ProjectItem(this.el.querySelector('ul')!.id, prjItem);
    }
  }
}

//ProjectInput Class
@ProjectInputLogger('logging ProjectInput...')
class ProjectInput extends Component<HTMLElement, HTMLElement> {
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

const input = new ProjectInput();
const activePrj = new ProjectList('active');
const finishedPrj = new ProjectList('inactive');
