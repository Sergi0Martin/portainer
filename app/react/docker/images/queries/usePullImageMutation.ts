import { RawAxiosRequestHeaders } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { withInvalidate } from '@/react-tools/react-query';
import axios, { parseAxiosError } from '@/portainer/services/axios';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { Registry } from '@/react/portainer/registries/types/registry';
import { useEnvironmentRegistries } from '@/react/portainer/environments/queries/useEnvironmentRegistries';

import { buildImageFullURI } from '../utils';

import { encodeRegistryCredentials } from './encodeRegistryCredentials';
import { buildProxyUrl } from './build-url';
import { queryKeys } from './queryKeys';

type UsePullImageMutation = Omit<PullImageOptions, 'registry'> & {
  registryId?: Registry['Id'];
};

export function usePullImageMutation(envId: EnvironmentId) {
  const queryClient = useQueryClient();
  const registriesQuery = useEnvironmentRegistries(envId);

  return useMutation({
    mutationFn: (args: UsePullImageMutation) =>
      pullImage({
        ...args,
        registry: getRegistry(registriesQuery.data || [], args.registryId),
      }),
    ...withInvalidate(queryClient, [queryKeys.base(envId)]),
  });
}

function getRegistry(registries: Registry[], registryId?: Registry['Id']) {
  return registryId
    ? registries.find((registry) => registry.Id === registryId)
    : undefined;
}

interface PullImageOptions {
  environmentId: EnvironmentId;
  image: string;
  nodeName?: string;
  registry?: Registry;
  ignoreErrors: boolean;
}

export async function pullImage({
  environmentId,
  ignoreErrors,
  image,
  nodeName,
  registry,
}: PullImageOptions) {
  const authenticationDetails =
    registry && registry.Authentication
      ? encodeRegistryCredentials(registry.Id)
      : '';

  const imageURI = buildImageFullURI(image, registry);

  const headers: RawAxiosRequestHeaders = {
    'X-Registry-Auth': authenticationDetails,
  };

  if (nodeName) {
    headers['X-PortainerAgent-Target'] = nodeName;
  }

  try {
    await axios.post(buildProxyUrl(environmentId, { action: 'create' }), null, {
      params: {
        fromImage: imageURI,
      },
      headers,
    });
  } catch (err) {
    if (ignoreErrors) {
      return;
    }

    throw parseAxiosError(err as Error, 'Unable to pull image');
  }
}
