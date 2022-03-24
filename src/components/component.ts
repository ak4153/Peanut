//component class

/**
 * @param ()takes HostEl, TemplateEl and appends to project
 * @param ?newElementId?: string renames the newElement
 */
export default abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement
> {
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
    const importedNode = document.importNode(this.templateEl.content, true);
    this.el = <U>importedNode.firstElementChild;
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
