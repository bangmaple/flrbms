import React, { useEffect, useState } from 'react';
import { createStyles, Table, Button, Highlight } from '@mantine/core';
import { Archive, InfoCircle, Pencil, Trash } from 'tabler-icons-react';
import NoDataFound from '../../components/no-data-found';
import Th from '../../components/table/th.table.component';
import { UserInfoModel } from '../../models/user/user-info.model';
import dayjs from 'dayjs';

interface RowData {
  'holidays.name': string;
  'holidays.dateStart': string;
  'holidays.dateEnd': string;
}

interface TableBodyProps {
  data: any[];

  toggleSortDirection(label): void;

  actionButtonCb: any;
  page: number;
  itemsPerPage: number;
  search: string | string[];
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const [sortBy, setSortBy] = useState<keyof RowData>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const { classes } = useStyles();
  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    props.toggleSortDirection(field);
  };

  const rows = props.data.map((row, index) => (
    <tr key={index}>
      <td>
        {props.page === 1
          ? index + 1
          : (props.page - 1) * props.itemsPerPage + (index + 1)}
      </td>

      <td>
        <Highlight highlight={props.search}>{row.name}</Highlight>
      </td>
      <td>{dayjs(row.dateStart).format('dddd DD-MM-YYYY')}</td>

      <td>{dayjs(row.dateEnd).format('dddd DD-MM-YYYY')}</td>
      <td className={classes.actionButtonContainer}>
        <Button
          variant="outline"
          onClick={() => props.actionButtonCb.info(row.id)}
        >
          <InfoCircle />
        </Button>

        <Button
          variant="outline"
          color="green"
          onClick={() => props.actionButtonCb.update(row.id)}
        >
          <Pencil />
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => props.actionButtonCb.delete(row.id)}
        >
          <Trash />
        </Button>
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

          <Th
            sorted={sortBy === 'holidays.name'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('holidays.name')}
          >
            Name
          </Th>

          <Th
            sorted={sortBy === 'holidays.dateStart'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('holidays.dateStart')}
          >
            Date Starts
          </Th>
          <Th
            sorted={sortBy === 'holidays.dateEnd'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('holidays.dateEnd')}
          >
            Date Ends
          </Th>
          <Th
            sorted={null}
            reversed={reverseSortDirection}
            onSort={null}
            style={{ width: 220 }}
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
  bookingDisplay: {
    color: '#228be6',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#0000ff1c',
    fontWeight: 600,
  },
  bookedDisplay: {
    color: '#fd7e14',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#fd7e1442',
    fontWeight: 600,
  },
  canceledDisplay: {
    color: 'red',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#ff00001c',
    fontWeight: 600,
  },
  processingDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
  },
}));
