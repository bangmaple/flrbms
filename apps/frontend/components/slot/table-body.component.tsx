import React, {useState} from 'react';
import {createStyles, Table, Button, Highlight} from '@mantine/core';
import {InfoCircle, Pencil, Trash} from 'tabler-icons-react';
import NoDataFound from '../../components/no-data-found';
import Th from '../../components/table/th.table.component';

interface RowData {
  name: string;
}

interface TableBodyProps {
  data: any;
  actionButtonCb: any;
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const {classes} = useStyles();
  const slots = new Object(props.data);
  const slotsArray = Object.entries(slots);
  const rows = slotsArray.map((row, index) => (
    <tr key={row[0]}>
      <td>{index + 1}</td>
      <td>{row[1].name}</td>
      <td>{row[1].start}</td>
      <td>{row[1].end}</td>
      <td className={classes.actionButtonContainer}>
        <Button
          variant="outline"
          onClick={() => props.actionButtonCb.info(row[0])}
        >
          <InfoCircle/>
        </Button>
        <Button
          variant="outline"
          color="green"
          onClick={() => props.actionButtonCb.update(row[0])}
        >
          <Pencil/>
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => props.actionButtonCb.delete(row[0])}
        >
          <Trash/>
        </Button>
      </td>
    </tr>
  ));

  return props.data ? (
    <Table
      horizontalSpacing="md"
      verticalSpacing="xs"
      sx={{tableLayout: 'fixed'}}
    >
      <thead>
      <tr>
        <Th
          sorted={null}
          reversed={null}
          onSort={null}
          style={{
            width: 50,
          }}
        >
          STT
        </Th>

        <Th
          sorted={null}
          reversed={null}
          onSort={null}
          style={{
            width: 100,
          }}
        >
          Name
        </Th>
        <Th sorted={null} reversed={null} onSort={null} style={{
          width: 100,
        }}>
          Time starts
        </Th>
        <Th sorted={null} reversed={null} onSort={null} style={{
          width: 100,
        }}>
          Time Ends
        </Th>

        <Th
          sorted={null}
          reversed={null}
          onSort={null}
          style={{width: 59}}
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
}));
