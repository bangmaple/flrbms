import React, { useEffect, useState } from 'react';
import { createStyles, Table, Button, Highlight } from '@mantine/core';
import {
  Archive,
  InfoCircle,
  Pencil,
  RotateClockwise,
} from 'tabler-icons-react';
import NoDataFound from '../../components/no-data-found';
import Th from '../../components/table/th.table.component';
import { UserInfoModel } from '../../models/user/user-info.model';

interface RowData {
  fullname: string;
  email: string;
  'account.disabled_at': string;
}

interface TableBodyProps {
  data: any[];
  search?: string | string[];

  toggleSortDirection(label): void;

  actionButtonCb: any;
  page: number;
  itemsPerPage: number;
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const [sortBy] = useState<keyof RowData>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const { classes } = useStyles();
  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    props.toggleSortDirection(field);
  };

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);

  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const RenderStatus: React.FC<{ disabledAt: string }> = (props) => {
    if (props.disabledAt) {
      return <p className={classes.disabledDisplay}>Disable</p>;
    } else {
      return <p className={classes.activeDisplay}>Active</p>;
    }
  };

  const RenderButton: React.FC<{ id: string; disabledAt: string }> = (
    _props
  ) => {
    if (_props.disabledAt) {
      return (
        <Button
          variant="outline"
          color="green"
          onClick={() => props.actionButtonCb.restore(_props.id)}
        >
          <RotateClockwise />
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline"
          color="red"
          onClick={() => props.actionButtonCb.disable(_props.id)}
        >
          <Archive />
        </Button>
      );
    }
  };

  const rows = props.data.map((row, index) =>
    userInfo.id !== row.id ? (
      <tr key={index}>
        <td>
          {props.page === 1
            ? index + 1
            : (props.page - 1) * props.itemsPerPage + (index + 1)}
        </td>
        <td>
          <Highlight highlight={props.search}>{row.fullname}</Highlight>
        </td>
        <td>{row.email}</td>
        <td>
          <RenderStatus disabledAt={row.disabledAt} />
        </td>
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
          <RenderButton id={row.id} disabledAt={row.disabledAt} />
        </td>
      </tr>
    ) : null
  );

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
            sorted={sortBy === 'fullname'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('fullname')}
          >
            Full name
          </Th>

          <Th
            sorted={sortBy === 'email'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('email')}
          >
            Email
          </Th>

          <Th
            sorted={sortBy === 'account.disabled_at'}
            reversed={reverseSortDirection}
            onSort={() => setSorting('account.disabled_at')}
            style={{ width: '150px' }}
          >
            Status
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
  activeDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
  },
  disabledDisplay: {
    color: 'red',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#ff00001c',
    fontWeight: 600,
  },
}));
