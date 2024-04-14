import angular from 'angular';

import { ItemView as NetworksItemView } from '@/react/docker/networks/ItemView';
import { r2a } from '@/react-tools/react2angular';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { withUIRouter } from '@/react-tools/withUIRouter';

import { containersModule } from './containers';
import { imagesModule } from './images';

export const viewsModule = angular
  .module('portainer.docker.react.views', [containersModule, imagesModule])
  .component(
    'networkDetailsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(NetworksItemView))), [])
  ).name;
