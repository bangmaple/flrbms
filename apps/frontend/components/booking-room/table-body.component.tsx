import React, {useState} from 'react';
import {createStyles, Table, Button, Highlight} from '@mantine/core';
import {InfoCircle} from 'tabler-icons-react';
import NoDataFound from '../../components/no-data-found';
import Th from '../../components/table/th.table.component';
import dayjs from 'dayjs';

interface RowData {
  name: string;
  requested_at: string;
  checkin_date: string;
  requested_by: string;
  status: string
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
  const [sortBy] = useState<keyof RowData>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const {classes} = useStyles();
  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    props.toggleSortDirection(field);
  };

  const RenderStatus: React.FC<{ status: string }> = (_props) => {
    switch (_props.status) {
      case 'BOOKED':
        return <div className={classes.bookedDisplay}>Booked</div>;
      case 'CHECKED_OUT':
        return <div className={classes.checkedOutDisplay}>Checked out</div>;
      case 'CHECKED_IN':
        return <div className={classes.checkedInDisplay}>Checked in</div>;
      case 'CANCELLED':
        return <div className={classes.canceledDisplay}>Cancelled</div>;
      default:
        return null;
    }
  };

  const rows = props.data.map((row, index) => (
    <tr key={index}>
      <td>
        {props.page === 1
          ? index + 1
          : (props.page - 1) * props.itemsPerPage + (index + 1)}
      </td>
      <td>
        <Highlight highlight={props.search}>
          {row.roomName}
        </Highlight>
      </td>
      <td>{dayjs(row.bookedAt).format('ddd DD-MM-YYYY, HH:mm ')}</td>
      <td>{dayjs(row.checkinDate).format('ddd DD-MM-YYYY')}</td>
      <td>
        <Highlight highlight={props.search}>
          {row.requestedBy}
        </Highlight>
      </td>
      <td>
        <RenderStatus status={row.status}/>
      </td>
      <td className={classes.actionButtonContainer}>
        <Button
          variant="outline"
          onClick={() => props.actionButtonCb.info(row.id)}
        >
          <InfoCircle/>
        </Button>
      </td>
    </tr>
  ));

  return props.data.length > 0 ? (
    <Table
      horizontalSpacing="md"
      verticalSpacing="xs"
      sx={{tableLayout: 'fixed', minWidth: 700}}
    >
      <thead>
      <tr>
        <Th
          style={{
            width: '5%',
          }}
          sorted={null}
          reversed={reverseSortDirection}
          onSort={null}
        >
          STT
        </Th>

        <Th
          sorted={sortBy === 'name'}
          reversed={reverseSortDirection}
          onSort={() => setSorting('name')}
        >
          Room Name
        </Th>

        <Th
          sorted={sortBy === 'requested_at'}
          reversed={reverseSortDirection}
          onSort={() => setSorting('requested_at')}
        >
          Booked At
        </Th>

        <Th
          sorted={sortBy === 'checkin_date'}
          reversed={reverseSortDirection}
          onSort={() => setSorting('checkin_date')}
        >
          Check in Date
        </Th>

        <Th
          sorted={sortBy === 'requested_by'}
          reversed={reverseSortDirection}
          onSort={() => setSorting('requested_by')}
          style={{width: 200}}
        >
          Requested by
        </Th>

        <Th
          sorted={sortBy === 'status'}
          reversed={reverseSortDirection}
          onSort={() => setSorting('status')}
          style={{width: 200}}
        >
          Status
        </Th>

        <Th
          style={{
            width: '10%',
          }}
          sorted={null}
          reversed={reverseSortDirection}
          onSort={null}
        >
          Actions
        </Th>
      </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  ) : (
    <NoDataFound/>
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
  checkedOutDisplay: {
    color: '#7950f2',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#7950f240',
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
  bookedDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
  },
  checkedInDisplay: {
    color: '#fd7e14',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#fd7e1430',
    fontWeight: 600,
  },
}));
