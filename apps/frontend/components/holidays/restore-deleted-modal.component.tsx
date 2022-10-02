import React, {useEffect, useState} from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Modal,
  Text,
  InputWrapper,
  TextInput, Highlight, Button,
} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {Check, RotateClockwise, Search, X} from 'tabler-icons-react';

import {PagingParams} from '../../models/pagination-params/paging-params.model';
import dayjs from 'dayjs';
import {useDebouncedValue} from '@mantine/hooks';
import NoDataFound from '../no-data-found';
import {fetchDeletedHolidays} from "../../redux/features/holidays/thunk/fetch-deleted-holidays.thunk";
import {restoreDeletedHolidayById} from "../../redux/features/holidays/thunk/restore-deleted-holiday-by-id.thunk";
import {fetchHolidays} from "../../redux/features/holidays/thunk/fetch-holidays.thunk";
import {showNotification} from "@mantine/notifications";

interface RestoreDeletedHolidayModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
}

const RestoreDeletedHolidayModal: React.FC<RestoreDeletedHolidayModalProps> = (
  props
) => {
  const {classes, cx} = useStyles();
  const deletedHolidays = useAppSelector((state) => state.holiday.deletedHolidays);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedHolidays(search));
  }, [searchDebounced]);

  const handleRestoreDeletedHolidays = (id: string) => {
    dispatch(restoreDeletedHolidayById(id))
      .unwrap()
      .then(() => dispatch(fetchDeletedHolidays('')))
      .then(() => dispatch(fetchHolidays(props.pagination)))
      .then(() =>
        showNotification({
          id: 'restore-holiday',
          color: 'teal',
          title: 'This holiday was restored',
          message: 'This holiday was successfully restored',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .catch((e) => {
        showNotification({
          id: 'restore-holiday',
          color: 'red',
          title: 'Error while restoring holiday',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
  };
  const rows = deletedHolidays?.map((row, index) => (
    <tr key={row.id} style={{height: 60}}>
      <td>
        {index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.name}
        </Highlight>
      </td>
      <td>{dayjs(row.deletedAt).format('HH:mm DD-MM-YYYY')}</td>
      <td>{row.deletedBy}</td>
      <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() => handleRestoreDeletedHolidays(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="green"
          leftIcon={<RotateClockwise/>}
        >
          Restore
        </Button>
      </td>
    </tr>
  ));

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text
        style={{
          fontWeight: '600',
          fontSize: 22,
        }}
      >
        Restore Deleted Holidays
      </Text>
    );
  };

  return (
    <Modal
      opened={props.isShown}
      onClose={() => props.toggleShown()}
      centered
      size="70%"
      title={<ModalHeaderTitle/>}
      closeOnClickOutside={true}
      closeOnEscape={false}
    >
      <InputWrapper label="Search">
        <TextInput
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search/>}
        />
      </InputWrapper>
      {deletedHolidays?.length > 0 ? (
        <>
          <ScrollArea
            sx={{height: 500}}
            onScrollPositionChange={({y}) => setScrolled(y !== 0)}
          >
            <Table sx={{minWidth: 700}}>
              <thead
                className={cx(classes.header, {[classes.scrolled]: scrolled})}
              >
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Deleted At</th>
                <th>Deleted By</th>
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </>
      ) : (
        <NoDataFound/>
      )}
    </Modal>
  );
};

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export default RestoreDeletedHolidayModal;
