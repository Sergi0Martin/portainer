import angular from 'angular';

import { EdgeGroupsSelector } from '@/react/edge/edge-stacks/components/EdgeGroupsSelector';
import { r2a } from '@/react-tools/react2angular';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { EdgeStackDeploymentTypeSelector } from '@/react/edge/edge-stacks/components/EdgeStackDeploymentTypeSelector';
import { EditEdgeStackForm } from '@/react/edge/edge-stacks/ItemView/EditEdgeStackForm/EditEdgeStackForm';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { EdgeGroupAssociationTable } from '@/react/edge/components/EdgeGroupAssociationTable';
import { AssociatedEdgeEnvironmentsSelector } from '@/react/edge/components/AssociatedEdgeEnvironmentsSelector';
import { EnvironmentsDatatable } from '@/react/edge/edge-stacks/ItemView/EnvironmentsDatatable';
import { TemplateFieldset } from '@/react/edge/edge-stacks/CreateView/TemplateFieldset/TemplateFieldset';

import { edgeJobsModule } from './edge-jobs';

const ngModule = angular
  .module('portainer.edge.react.components', [edgeJobsModule])
  .component(
    'edgeStackEnvironmentsDatatable',
    r2a(withUIRouter(withReactQuery(EnvironmentsDatatable)), [])
  )
  .component(
    'edgeGroupsSelector',
    r2a(withUIRouter(withReactQuery(EdgeGroupsSelector)), [
      'onChange',
      'value',
      'error',
      'horizontal',
      'isGroupVisible',
      'required',
    ])
  )

  .component(
    'edgeStackDeploymentTypeSelector',
    r2a(withReactQuery(EdgeStackDeploymentTypeSelector), [
      'value',
      'onChange',
      'hasDockerEndpoint',
      'hasKubeEndpoint',
      'allowKubeToSelectCompose',
    ])
  )
  .component(
    'editEdgeStackForm',
    r2a(withUIRouter(withReactQuery(withCurrentUser(EditEdgeStackForm))), [
      'edgeStack',
      'fileContent',
      'isSubmitting',
      'onEditorChange',
      'onSubmit',
      'allowKubeToSelectCompose',
    ])
  )
  .component(
    'edgeGroupAssociationTable',
    r2a(withReactQuery(EdgeGroupAssociationTable), [
      'emptyContentLabel',
      'onClickRow',
      'query',
      'title',
      'data-cy',
    ])
  )
  .component(
    'associatedEdgeEnvironmentsSelector',
    r2a(withReactQuery(AssociatedEdgeEnvironmentsSelector), [
      'onChange',
      'value',
    ])
  )
  .component(
    'edgeStackCreateTemplateFieldset',
    r2a(withReactQuery(TemplateFieldset), ['setValues', 'values', 'errors'])
  );

export const componentsModule = ngModule.name;
