import { BindThis } from '../decorators/bindthis';
import { ProjectStatus } from '../models/project-model';
import { Project } from '../models/project-model';
type Listner<T> = (items: T[]) => void;

abstract class State<T> {
  protected containerArray: Listner<T>[] = [];

  addItem(itemFn: Listner<T>) {
    this.containerArray.push(itemFn);
  }
}

//singleton class initiated once
export class ProjectState extends State<Project> {
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
    this.updateContainer();
  }

  transferProject(prjId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => prjId === project.id);
    if (project) {
      project.status = newStatus;
      this.updateContainer();
    }
  }
  @BindThis
  private updateContainer() {
    for (const listnerFn of this.containerArray) {
      listnerFn(this.projects.slice());
    }
  }
}
export const projectState = ProjectState.getInstance();
