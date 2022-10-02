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
import {Check, RotateClockwise, Search, Trash, X} from 'tabler-icons-react';
import dayjs from 'dayjs';
import {useDebouncedValue} from '@mantine/hooks';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import NoDataFound from '../no-data-found';
import {fetchDisabledDevices} from '../../redux/features/devices/thunk/fetch-disabled.thunk';
import {restoreDisabledDevice} from '../../redux/features/devices/thunk/restore-disabled.thunk';
import {fetchDevices} from '../../redux/features/devices/thunk/fetch-devices.thunk';
import {deleteDeviceById} from '../../redux/features/devices/thunk/delete-by-id';
import {fetchDeletedDevices} from '../../redux/features/devices/thunk/fetch-deleted.thunk';
import {showNotification} from '@mantine/notifications';
import {fetchDeviceById} from '../../redux/features/devices';
import DeviceUpdateTypeModal from './update-type-modal.component';

interface RestoreDisabledDeviceModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;

  deviceTypes: any[]
}

const RestoreDisabledDeviceModal: React.FC<RestoreDisabledDeviceModalProps> = (
  props
) => {
  const {classes, cx} = useStyles();
  const disabledDevices = useAppSelector(
    (state) => state.device.disabledDevices
  );
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [isShowUpdateType, setIsShowUpdateType] = useState<boolean>(false);

  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDisabledDevices(search));
  }, [searchDebounced]);

  const handleActiveDevice = (
    id: string,
    deviceType: string,
    isDeleted: string
  ) => {
    if (!deviceType || isDeleted) {
      dispatch(fetchDeviceById(id));
      setIsShowUpdateType(true);
    } else {
      dispatch(restoreDisabledDevice(id))
        .unwrap()
        .catch((e) =>
          showNotification({
            id: 'restore-data',
            color: 'red',
            title: 'Error while restoring device',
            message: e.message ?? 'Failed to restore device',
            icon: <X/>,
            autoClose: 3000,
          })
        )
        .then(() =>
          showNotification({
            id: 'restore-data',
            color: 'teal',
            title: 'This device was restored',
            message: 'This device was successfully restored',
            icon: <Check/>,
            autoClose: 3000,
          })
        )
        .then(() => dispatch(fetchDevices(props.pagination)))
        .then(() =>
          dispatch(fetchDisabledDevices(search))
            .unwrap()
            .then((disabledDevices) =>
              disabledDevices.length < 1 ? props.toggleShown() : null
            )
        );
    }
  };

  const handleDeleteDevice = (id: string) => {
    dispatch(deleteDeviceById(id))
      .unwrap()
      .catch((e) => {
        showNotification({
          id: 'restore-data',
          color: 'red',
          title: 'Error while deleting device',
          message: e.message ?? 'Failed to delete device',
          icon: <X/>,
          autoClose: 3000,
        })
      })
      .then(() => showNotification({
        id: 'delete-data',
        color: 'teal',
        title: 'This device was deleted',
        message: 'This device was successfully deleted',
        icon: <Check/>,
        autoClose: 3000,
      }))
      .then(() => dispatch(fetchDevices(props.pagination)))
      .then(() =>
        dispatch(fetchDisabledDevices(search))
          .unwrap()
          .then((disabledDevices) =>
            disabledDevices.length < 1 ? props.toggleShown() : null
          )
          .then(() => {
            dispatch(fetchDeletedDevices(''));
          })
      );
  };

  const rows = disabledDevices?.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.name}
        </Highlight>
      </td>
      <td>{row.deviceTypeName}</td>
      <td>{dayjs(row.disabledAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.disabledBy}</td>
      <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() =>
            handleActiveDevice(row.id, row.deviceTypeName, row.isTypeDeleted)
          }
          style={{
            margin: 5,
          }}
          variant="outline"
          color="green"
          leftIcon={<RotateClockwise/>}
        >
          Restore
        </Button>
        <Button
          onClick={() => handleDeleteDevice(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="red"
          leftIcon={<Trash/>}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text className={classes.modalHeaderTitle}>Restore Disabled Devices</Text>
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
      {disabledDevices?.length > 0 ? (
        <>
          <ScrollArea
            sx={{height: 500}}
            onScrollPositionChange={({y}) => setScrolled(y !== 0)}
          >
            <div>
              <Table sx={{minWidth: 700}}>
                <thead
                  className={cx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
                >
                <tr>
                  <th>STT</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Disabled at</th>
                  <th>Disabled by</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </div>
          </ScrollArea>
        </>
      ) : (
        <NoDataFound/>
      )}

      <DeviceUpdateTypeModal
        isShown={isShowUpdateType}
        toggleShown={() => setIsShowUpdateType(!isShowUpdateType)}
        pagination={props.pagination}
        deviceTypes={props.deviceTypes}
      />
    </Modal>
  );
};

const useStyles = createStyles((theme) => ({
  modalHeaderTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
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

export default RestoreDisabledDeviceModal;
