import { useQuery } from '@tanstack/react-query';
import { EventMessage } from 'docker-types/generated/1.41';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { buildUrl } from '../proxy/queries/build-url';
import { queryKeys } from '../proxy/queries/query-keys';
import { jsonObjectsToArrayHandler } from '../proxy/queries/utils';

import { EventViewModel } from './model';

type Params = { since?: number; until?: number };

export function useEvents(
  environmentId: EnvironmentId,
  { params }: { params?: Params } = {}
) {
  return useQuery({
    queryKey: [...queryKeys.base(environmentId), 'events', params],
    queryFn: () => getEvents(environmentId, params),
  });
}

async function getEvents(
  environmentId: EnvironmentId,
  { since, until }: Params = {}
) {
  try {
    const { data } = await axios.get<string>(
      buildUrl(environmentId, 'events'),
      { params: { since, until } }
    );
    const arr = jsonObjectsToArrayHandler<EventMessage>(data);
    return arr.map((event) => new EventViewModel(event));
  } catch (err) {
    throw parseAxiosError(err, 'Unable to retrieve engine events');
  }
}
