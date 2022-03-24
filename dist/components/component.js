//component class
/**
 * @param ()takes HostEl, TemplateEl and appends to project
 * @param ?newElementId?: string renames the newElement
 */
export default class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.el = importedNode.firstElementChild;
        if (newElementId) {
            this.el.id = newElementId;
        }
        this.attach(true);
    }
    attach(insertAtStart) {
        switch (insertAtStart) {
            case true:
                this.hostEl.insertAdjacentElement('afterbegin', this.el);
            case false:
                this.hostEl.insertAdjacentElement('beforeend', this.el);
            default:
                break;
        }
    }
}
