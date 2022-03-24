/// < reference path="component.ts />
namespace App {
  export class ProjectItem
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
}
