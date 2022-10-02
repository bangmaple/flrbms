import React, {useEffect, useState} from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Modal,
  Text,
  InputWrapper,
  TextInput, Highlight,
} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import { Search} from 'tabler-icons-react';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import dayjs from 'dayjs';
import {useDebouncedValue} from '@mantine/hooks';
import NoDataFound from '../no-data-found';
import {fetchDeletedDevices} from '../../redux/features/devices/thunk/fetch-deleted.thunk';

interface RestoreDeletedDeviceModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
}

const RestoreDeletedDeviceModal: React.FC<RestoreDeletedDeviceModalProps> = (
  props
) => {
  const {classes, cx} = useStyles();
  const deletedDevices = useAppSelector((state) => state.device.deletedDevices);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDeletedDevices(search));
  }, [searchDebounced]);

  const rows = deletedDevices?.map((row, index) => (
    <tr key={row.id} style={{height: 50}}>
      <td>{index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.name}
        </Highlight>
      </td>
      <td>{row.deviceTypeName}</td>
      <td>{dayjs(row.updatedAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.deletedBy}</td>
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
        Restore Deleted Devices
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
      {deletedDevices.length > 0 ? (
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
                <th>Type</th>
                <th>Delete At</th>
                <th>Delete By</th>
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

export default RestoreDeletedDeviceModal;
