import React, {useEffect, useState} from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Modal,
  Text,
  Button,
  InputWrapper,
  TextInput, Highlight,
} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {Check, RotateClockwise, Search, X} from 'tabler-icons-react';
import {PaginationParams} from '../../models/pagination-params.model';
import dayjs from 'dayjs';
import {showNotification} from '@mantine/notifications';
import NoDataFound from "../no-data-found";
import {useDebouncedValue} from '@mantine/hooks';
import {restoreDeletedSlotById} from '../../redux/features/slot/thunk/restore-delete-slot-by-id.thunk';
import {fetchAllSlots} from '../../redux/features/slot';
import {fetchDeletedSlots} from '../../redux/features/slot/thunk/fetch-deleted-device-types';


interface RestoreDeletedModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PaginationParams;
  search: string | string[]
}

const RestoreDeletedModal: React.FC<RestoreDeletedModalProps> = (
  props
) => {
  const {classes, cx} = useStyles();
  //BUGG
  //const deletedSlots = useAppSelector((state) => state.slot.deletedSlots);
  const deletedSlots = [];
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedSlots(search));
  }, [searchDebounced]);


  const handleRestoreDeletedSlot = (id: string) => {
    dispatch(restoreDeletedSlotById(id))
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'restore-data',
          color: 'red',
          title: 'Error while restore slot',
          message: e.message ?? 'Failed to restore slot',
          icon: <X/>,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'restore-data',
          color: 'teal',
          title: 'Slot was restored',
          message: 'Slot was successfully restored',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then(() => {
        props.toggleShown();
        dispatch(fetchDeletedSlots(''));
        dispatch(fetchAllSlots());
      })
  };
  console.log(deletedSlots)

  const rows = deletedSlots?.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>
      <td>
        <Highlight highlight={props.search}>
          {row.name}
        </Highlight>

      </td>
      <td>{row.timeStart}</td>
      <td>{row.timeEnd}</td>
      <td>{dayjs(row.deletedAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.deletedBy}</td>
      <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() => handleRestoreDeletedSlot(row.id)}
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
        Restore Deleted Slots
      </Text>
    );
  };

  return (
    <div>
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
        {deletedSlots?.length > 0 ? (
          <ScrollArea
            sx={{height: 500}}
            onScrollPositionChange={({y}) => setScrolled(y !== 0)}
          >
            <Table>
              <thead
                className={cx(classes.header, {[classes.scrolled]: scrolled})}
              >
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Time Starts</th>
                <th>Time Ends</th>
                <th>Deleted At</th>
                <th>Deleted By</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        ) : <NoDataFound/>}
      </Modal>
    </div>
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

export default RestoreDeletedModal;
