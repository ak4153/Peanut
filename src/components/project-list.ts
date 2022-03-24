import Component from './component.js';
import { BindThis } from '../decorators/bindthis.js';
import { projectState } from '../state/project-state.js';
import { ProjectStatus } from '../models/project-model.js';
import { DragTarget } from '../models/drag-drop-interfaces.js';
import { Project } from '../models/project-model.js';
import { ProjectItem } from './project-item.js';
export default class ProjectList
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

    //creates a function to run on each update
    projectState.addItem((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        //if the type of the project-list
        if (this.type === 'active') {
          //returns an active project
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
  dragLeaveHandler(event: DragEvent): void {
    const listEl = this.el.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  @BindThis
  dropHandler(event: DragEvent): void {
    const listEl = this.el.querySelector('ul')!;
    listEl.classList.remove('droppable');
    projectState.transferProject(
      event.dataTransfer?.getData('text/plain') as string,
      this.type === 'active' ? ProjectStatus.active : ProjectStatus.inactive
    );

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
      //              active list/inactive
      new ProjectItem(this.el.querySelector('ul')!.id, prjItem);
    }
  }
}
