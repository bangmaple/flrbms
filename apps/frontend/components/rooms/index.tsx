import { GetServerSideProps } from 'next';
import AdminLayout from '../../components/layout/admin.layout';
import { Button } from '@mantine/core';
import {
  ArchiveOff,
  BuildingWarehouse,
  Plus,
  TrashOff,
} from 'tabler-icons-react';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useDebouncedValue } from '@mantine/hooks';
import { fetchRooms } from '../../redux/features/room/thunk/fetch-rooms';
import { getRoomById } from '../../redux/features/room/thunk/get-room-by-id';
import NoDataFound from '../../components/no-data-found';
import TableHeader from '../../components/actions/table-header.component';
import { TableBody } from './table-body.component';
import TableFooter from '../../components/actions/table-footer.component';
import AddRoomModal from '../../components/rooms/add-modal.component';
import DeleteRoomModal from '../../components/rooms/delete-modal.component';
import DisableRoomModal from '../../components/rooms/disable-modal.component';
import RoomInfoModal from '../../components/rooms/info-modal.component';
import RestoreDisabledRoomModal from '../../components/rooms/restore-disabled.modal.component';
import RestoreDeletedRoomModal from '../../components/rooms/restore-deleted.modal.component';
import UpdateModal from '../../components/rooms/update-modal.component';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import Header from '../../components/common/header.component';
import { fetchRoomTypeNames } from '../../redux/features/room-type';
import { UserInfoModel } from '../../models/user/user-info.model';

const defaultPagination = {
  limit: 5,
  page: 1,
  name: '',
  search: '',
  type: '',
  sort: 'name',
  dir: 'ASC',
};

function RoomsManagement(props: any) {
  const rooms = useAppSelector((state) => state.room.rooms);
  const [roomTypeNames, setRoomTypeNames] = useState([]);
  const [pagination, setPagination] = useState<PagingParams>(defaultPagination);
  const [debounceSearchValue] = useDebouncedValue(pagination.name, 400);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRooms(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.name,
    pagination.type,
    pagination.sort,
    pagination.dir,
    pagination.search,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(fetchRoomTypeNames())
      .unwrap()
      .then((roomTypes) => setRoomTypeNames(roomTypes));
  }, []);

  const toggleSortDirection = (field) => {
    setPagination({
      ...pagination,
      sort: field,
      dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleSearchValue = (val: string) => {
    setPagination({
      ...defaultPagination,
      search: val,
    });
  };

  const handleLimitChange = (val: number) => {
    setPagination({
      ...pagination,
      limit: val,
    });
  };

  const handlePageChange = (val: number) => {
    setPagination({
      ...pagination,
      page: val,
    });
  };

  const handleResetFilter = () => {
    setPagination(defaultPagination);
  };

  const handleFetchById = (idVal) => {
    return dispatch(getRoomById(idVal));
  };

  const [id, setId] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);
  const [isDisableShown, setDisableShown] = useState<boolean>(false);
  const [isRestoreDisabledShown, setRestoreDisabledShown] =
    useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const ActionsFilter: React.FC = () => {
    return (
      <>
        <Button
          leftIcon={<Plus />}
          color="green"
          onClick={() => setAddShown(true)}
          style={{ marginRight: 10 }}
        >
          Add
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDisabledShown(true)}
          style={{ marginRight: 10 }}
        >
          <ArchiveOff color={'red'} />
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDeletedShown(true)}
          style={{ marginRight: 10 }}
        >
          <TrashOff />
        </Button>
      </>
    );
  };

  const handleActionsCb = {
    info: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
    update: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setUpdateShown(!isUpdateShown));
    },
    disable: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setDisableShown(!isDisableShown));
    },
  };

  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
  };

  return (
    <>
      <AdminLayout>
        <Header
          title="Rooms Management"
          icon={<BuildingWarehouse size={50} />}
        />
        <TableHeader
          actionsLeft={null}
          handleResetFilter={() => handleResetFilter()}
          actions={userInfo.role !== 'Staff' ? <ActionsFilter /> : null}
          setSearch={(val) => handleSearchValue(val)}
          search={pagination.search}
        />

        <RestoreDisabledRoomModal
          roomTypes={roomTypeNames}
          isShown={isRestoreDisabledShown}
          toggleShown={() => setRestoreDisabledShown(!isRestoreDisabledShown)}
          pagination={pagination}
        />
        <RestoreDeletedRoomModal
          isShown={isRestoreDeletedShown}
          toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
          pagination={pagination}
        />

        {rooms?.items ? (
          <>
            <TableBody
              actionButtonCb={handleActionsCb}
              toggleSortDirection={(field) => toggleSortDirection(field)}
              data={rooms.items}
              page={pagination.page}
              itemsPerPage={pagination.limit}
              search={pagination.search}
            />
            <RoomInfoModal
              // header="Room Information"
              // fields={infoFields}
              toggleShown={() => setInfoShown(!isInfoShown)}
              isShown={isInfoShown}
              toggleDeleteModalShown={() => setDeleteShown(!isDeleteShown)}
            />
            <DisableRoomModal
              isShown={isDisableShown}
              toggleShown={() => setDisableShown(!isDisableShown)}
              pagination={pagination}
            />
            <DeleteRoomModal
              isShown={isDeleteShown}
              toggleShown={() => setDeleteShown(!isDeleteShown)}
              toggleInforModalShown={() => setInfoShown(!isInfoShown)}
              pagination={pagination}
            />
            <UpdateModal
              // formik={updateFormik}
              // handleSubmit={() => updateFormik.handleSubmit()}
              isShown={isUpdateShown}
              toggleShown={() => setUpdateShown(!isUpdateShown)}
              pagination={pagination}
              roomTypes={roomTypeNames}
            />
          </>
        ) : (
          <NoDataFound />
        )}
        <AddRoomModal
          isShown={isAddShown}
          pagination={pagination}
          toggleShown={() => handleAddModalClose()}
          roomTypes={roomTypeNames}
        />
        {rooms?.meta ? (
          <TableFooter
            handlePageChange={(val) => handlePageChange(val)}
            handleLimitChange={(val) => handleLimitChange(val)}
            metadata={rooms.meta}
          />
        ) : null}
      </AdminLayout>
    </>
  );
}

export default RoomsManagement;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      assa: null,
    },
  };
};
