import { EventMessage } from 'docker-types/generated/1.41';

export class EventViewModel {
  time: number | undefined;

  type?: string;

  details?: string;

  raw?: EventMessage;

  id?: string;

  constructor(
    data: EventMessage & { from?: string; status?: string; id?: string }
  ) {
    this.raw = data;
    this.id = data.id || btoa(JSON.stringify(data));
    // Type, Action, Actor unavailable in Docker < 1.10
    this.time = data.time;
    if (data.Type) {
      this.type = data.Type;
      this.details = createEventDetails(data);
    } else {
      if (data.status) {
        this.type = data.status;
      }

      if (data.from) {
        this.details = data.from;
      }
    }
  }
}

function createEventDetails(event: EventMessage) {
  const eventAttr = event.Actor?.Attributes || {};
  const actorId = event.Actor?.ID || '';
  let details = '';

  let action = event.Action || '';
  let extra = '';
  const colonIndex = action.indexOf(':');
  if (colonIndex !== -1) {
    extra = action.substring(colonIndex);
    action = action.substring(0, colonIndex);
  }

  switch (event.Type) {
    case 'container':
      switch (action) {
        case 'stop':
          details = `Container ${eventAttr.name} stopped`;
          break;
        case 'destroy':
          details = `Container ${eventAttr.name} deleted`;
          break;
        case 'create':
          details = `Container ${eventAttr.name} created`;
          break;
        case 'start':
          details = `Container ${eventAttr.name} started`;
          break;
        case 'kill':
          details = `Container ${eventAttr.name} killed`;
          break;
        case 'die':
          details = `Container ${eventAttr.name} exited with status code ${eventAttr.exitCode}`;
          break;
        case 'commit':
          details = `Container ${eventAttr.name} committed`;
          break;
        case 'restart':
          details = `Container ${eventAttr.name} restarted`;
          break;
        case 'pause':
          details = `Container ${eventAttr.name} paused`;
          break;
        case 'unpause':
          details = `Container ${eventAttr.name} unpaused`;
          break;
        case 'attach':
          details = `Container ${eventAttr.name} attached`;
          break;
        case 'detach':
          details = `Container ${eventAttr.name} detached`;
          break;
        case 'copy':
          details = `Container ${eventAttr.name} copied`;
          break;
        case 'export':
          details = `Container ${eventAttr.name} exported`;
          break;
        case 'health_status':
          details = `Container ${eventAttr.name} executed health status`;
          break;
        case 'oom':
          details = `Container ${eventAttr.name} goes in out of memory`;
          break;
        case 'rename':
          details = `Container ${eventAttr.name} renamed`;
          break;
        case 'resize':
          details = `Container ${eventAttr.name} resized`;
          break;
        case 'top':
          details = `Showed running processes for container ${eventAttr.name}`;
          break;
        case 'update':
          details = `Container ${eventAttr.name} updated`;
          break;
        case 'exec_create':
          details = 'Exec instance created';
          break;
        case 'exec_start':
          details = 'Exec instance started';
          break;
        case 'exec_die':
          details = 'Exec instance exited';
          break;
        default:
          details = 'Unsupported event';
      }
      break;
    case 'image':
      switch (action) {
        case 'delete':
          details = 'Image deleted';
          break;
        case 'import':
          details = `Image ${actorId} imported`;
          break;
        case 'load':
          details = `Image ${actorId} loaded`;
          break;
        case 'tag':
          details = `New tag created for ${eventAttr.name}`;
          break;
        case 'untag':
          details = 'Image untagged';
          break;
        case 'save':
          details = `Image ${actorId} saved`;
          break;
        case 'pull':
          details = `Image ${actorId} pulled`;
          break;
        case 'push':
          details = `Image ${actorId} pushed`;
          break;
        default:
          details = 'Unsupported event';
      }
      break;
    case 'network':
      switch (action) {
        case 'create':
          details = `Network ${eventAttr.name} created`;
          break;
        case 'destroy':
          details = `Network ${eventAttr.name} deleted`;
          break;
        case 'remove':
          details = `Network ${eventAttr.name} removed`;
          break;
        case 'connect':
          details = `Container connected to ${eventAttr.name} network`;
          break;
        case 'disconnect':
          details = `Container disconnected from ${eventAttr.name} network`;
          break;
        default:
          details = 'Unsupported event';
      }
      break;
    case 'volume':
      switch (action) {
        case 'create':
          details = `Volume ${actorId} created`;
          break;
        case 'destroy':
          details = `Volume ${actorId} deleted`;
          break;
        case 'mount':
          details = `Volume ${actorId} mounted`;
          break;
        case 'unmount':
          details = `Volume ${actorId} unmounted`;
          break;
        default:
          details = 'Unsupported event';
      }
      break;
    default:
      details = 'Unsupported event';
  }
  return details + extra;
}
