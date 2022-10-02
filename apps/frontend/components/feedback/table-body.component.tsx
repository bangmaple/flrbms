import React, { useEffect, useState } from 'react';
import { createStyles, Table, Button, Highlight } from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';
import NoDataFound from '../../components/no-data-found';
import Th from '../../components/table/th.table.component';
import dayjs from 'dayjs';
import { UserInfoModel } from '../../models/user/user-info.model';

interface RowData {
  'ft.name': string;
  'f.created_at': string;
  'f.created_by': string;
  'f.status': string;
}

interface TableBodyProps {
  data: any[];

  toggleSortDirection(): void;

  actionButtonCb: any;
  page: number;
  itemsPerPage: number;
  search: string | string[];
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const [sortBy, setSortBy] = useState<keyof RowData>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const { classes } = useStyles();
  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    props.toggleSortDirection();
  };

  const rows = props.data.map((row, index) => (
    <tr key={row.id}>
      <td>
        {props.page === 1
          ? index + 1
          : (props.page - 1) * props.itemsPerPage + (index + 1)}
      </td>
      {userInfo.role !== 'Staff' ? (
        <td>
          <Highlight highlight={props.search}>{row.createdByName}</Highlight>
        </td>
      ) : null}
      <td>
        <Highlight highlight={props.search}>{row.feedbackTypeName}</Highlight>
      </td>
      <td>{dayjs(row.createdAt).format('DD-MM-YYYY')}</td>
      <td>
        {row.status === 'PENDING' ? (
          <div className={classes.pendingDisplay}>{row.status}</div>
        ) : row.status === 'RESOLVED' ? (
          <div className={classes.resolvedDisplay}>{row.status}</div>
        ) : row.status === 'REJECTED' ? (
          <div className={classes.rejectedDisplay}>{row.status}</div>
        ) : null}
      </td>
      <td className={classes.actionButtonContainer}>
        <Button
          variant="outline"
          onClick={() => props.actionButtonCb.info(row.id)}
        >
          <InfoCircle />
        </Button>
        {/* <Button
          variant="outline"
          color="red"
          onClick={() => props.actionButtonCb.delete(row.id)}
        >
          <Trash />
        </Button> */}
      </td>
    </tr>
  ));

  return props.data.length > 0 ? (
    <Table
      horizontalSpacing="md"
      verticalSpacing="xs"
      sx={{ tableLayout: 'fixed' }}
    >
      <thead>
        <tr>
          <Th
            style={{
              width: '50px',
            }}
            sorted={null}
            reversed={reverseSortDirection}
            onSort={null}
          >
            STT
          </Th>
          {userInfo.role !== 'Staff' ? (
            <Th
              sorted={sortBy === 'f.created_by'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('f.created_by')}
            >
              Sender
            </Th>
          ) : null}

          <Th
            sorted={sortBy === 'ft.name'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('ft.name')}
          >
            Feedback type
          </Th>

          <Th
            sorted={sortBy === 'f.created_at'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('f.created_at')}
          >
            Sent at
          </Th>

          <Th
            sorted={sortBy === 'f.status'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('f.status')}
          >
            Status
          </Th>

          <Th
            sorted={null}
            reversed={reverseSortDirection}
            onSort={null}
            style={{ width: 160 }}
          >
            Actions
          </Th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  ) : (
    <NoDataFound />
  );
};

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },

  notFoundContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  notFoundText: {
    fontSize: 32,
    fontWeight: 600,
  },
  actionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pendingDisplay: {
    color: '#228be6',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#0000ff1c',
    fontWeight: 600,
  },
  rejectedDisplay: {
    color: 'red',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#ff00001c',
    fontWeight: 600,
  },
  resolvedDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
  },
}));
