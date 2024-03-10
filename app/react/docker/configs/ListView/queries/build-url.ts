import { EnvironmentId } from '@/react/portainer/environments/types';
import { buildUrl as buildProxyUrl } from '@/react/docker/proxy/queries/build-url';

export function buildUrl(environmentId: EnvironmentId, id = '', action = '') {
  let proxyAction = '';

  if (id) {
    proxyAction = id;
  }

  if (action) {
    proxyAction += `/${action}`;
  }

  return buildProxyUrl(environmentId, 'configs', proxyAction);
}
