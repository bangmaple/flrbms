import React, {useState} from 'react';
import {
  createStyles,
  Table,
  Button, Highlight,
} from '@mantine/core';
import {
  Archive,
  ArchiveOff,
  InfoCircle,
  Pencil,
  Trash,
} from 'tabler-icons-react';
import NoDataFound from '../../components/no-data-found';
import Th from '../../components/table/th.table.component';

interface RowData {
  name: string;
}

interface TableBodyProps {
  data: any[];

  toggleSortDirection(): void;

  search: string | string[];
  actionButtonCb: any;
  page: number;
  itemsPerPage: number;
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const [sortBy] = useState<keyof RowData>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const {classes} = useStyles();

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
      <td>
        <Highlight highlight={props.search}>
          {row.name}
        </Highlight>
      </td>
      <td className={classes.actionButtonContainer}>
        <Button
          variant="outline"
          onClick={() => props.actionButtonCb.info(row.id)}
        >
          <InfoCircle/>
        </Button>
        {props.actionButtonCb.update !== undefined ?
          <Button
            variant="outline"
            color="green"
            onClick={() => props.actionButtonCb.update(row.id)}
          >
            <Pencil/>
          </Button> : null
        }

        {props.actionButtonCb.delete !== undefined ?
          <Button
            variant="outline"
            color="red"
            onClick={() => props.actionButtonCb.delete(row.id)}
          >
            <Archive/>
          </Button> : null

        }

      </td>
    </tr>
  ));

  return props.data.length > 0 ? (
    <Table
      horizontalSpacing="md"
      verticalSpacing="xs"
      sx={{tableLayout: 'fixed'}}
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
          style={{
            width: '75%',
          }}
          sorted={sortBy === 'name'}
          reversed={reverseSortDirection}
          onSort={() => setSorting('name')}
        >
          Name
        </Th>

        <Th sorted={null} reversed={reverseSortDirection} onSort={null} style={{width: 220}}>
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
