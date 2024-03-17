import { createColumnHelper } from '@tanstack/react-table';
import { Clock } from 'lucide-react';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';

import { Datatable } from '@@/datatables';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';

import { EventViewModel } from './model';

const columnHelper = createColumnHelper<EventViewModel>();

export const columns = [
  columnHelper.accessor('time', {
    header: 'Date',
    cell: ({ getValue }) => {
      const value = getValue();
      return isoDateFromTimestamp(value);
    },
  }),
  columnHelper.accessor('type', {
    header: 'Type',
  }),
  columnHelper.accessor('details', {
    header: 'Details',
  }),
];

const tableKey = 'docker-events';
const settingsStore = createPersistedStore(tableKey, {
  id: 'Time',
  desc: true,
});

export function EventsDatatable({
  dataset,
}: {
  dataset?: Array<EventViewModel>;
}) {
  const tableState = useTableState(settingsStore, tableKey);

  return (
    <Datatable
      dataset={dataset ?? []}
      isLoading={!dataset}
      columns={columns}
      settingsManager={tableState}
      title="Events"
      titleIcon={Clock}
      disableSelect
      emptyContentLabel="No event available."
      data-cy="docker-events-datatable"
    />
  );
}
