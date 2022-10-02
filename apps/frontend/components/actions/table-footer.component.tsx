import React from 'react';
import { usePagination } from '@mantine/hooks';
import { createStyles, Pagination, Select } from '@mantine/core';
import { PaginationMeta } from '../../models/pagination-meta.model';

const limitPaginationData = [
  {
    label: '1 per page',
    value: '1',
  },
  {
    label: '3 per page',
    value: '3',
  },
  {
    label: '5 per page',
    value: '5',
  },
  {
    label: '10 per page',
    value: '10',
  },
  {
    label: '30 per page',
    value: '30',
  },
  {
    label: '50 per page',
    value: '50',
  },
];

interface TableFooterProps {
  metadata: PaginationMeta;
  handlePageChange(val: number): void;
  handleLimitChange(val: number): void;
}

const TableFooter: React.FC<TableFooterProps> = (props) => {
  const pagination = usePagination({
    total: props.metadata.totalItems,
    page: props.metadata.totalPages,
    initialPage: props.metadata.currentPage,
  });
  const { classes } = useStyles();

  return props.metadata.totalItems > 0 ? (
    <div className={classes.container}>
      <div style={{ fontWeight: '500' }}>
        Showing {props.metadata.itemCount} of {props.metadata.totalItems}
      </div>
      <Pagination
        color="orange"
        page={props.metadata.currentPage}
        total={pagination.active}
        onChange={(val) => props.handlePageChange(val)}
      />
      <Select
        value={String(props.metadata.itemsPerPage)}
        onChange={(val) => props.handleLimitChange(Number(val))}
        data={limitPaginationData}
      />
    </div>
  ) : null;
};

const useStyles = createStyles((theme) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  };
});

export default TableFooter;
