/// <reference path="models/drag-drop-interfaces.ts"/>
/// <reference path="decorators/bindthis.ts"/>
/// <reference path="state/project-state.ts"/>
/// <reference path="models/project-model.ts"/>
/// <reference path="util/validation.ts"/>
/// <reference path="components/component.ts"/>
/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-list.ts"/>
/// <reference path="components/project-item.ts" />

namespace App {
  const input = new ProjectInput();
  const activePrj = new ProjectList('active');
  const finishedPrj = new ProjectList('inactive');
}
