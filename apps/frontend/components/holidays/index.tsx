import { GetServerSideProps } from 'next';
import AdminLayout from '../../components/layout/admin.layout';
import { Button } from '@mantine/core';
import { Calendar, Plus, TrashOff, Upload } from 'tabler-icons-react';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useDebouncedValue } from '@mantine/hooks';
import NoDataFound from '../../components/no-data-found';
import TableHeader from '../../components/actions/table-header.component';
import { TableBody } from './table-body.component';
import TableFooter from '../../components/actions/table-footer.component';

import { PagingParams } from '../../models/pagination-params/paging-params.model';
import Header from '../../components/common/header.component';
import { UserInfoModel } from '../../models/user/user-info.model';
import RestoreDeletedHolidayModal from './restore-deleted-modal.component';
import { fetchHolidays } from '../../redux/features/holidays/thunk/fetch-holidays.thunk';
import HolidayInfoModal from './info-modal.component';
import UploadModal from './upload-modal.component';
import { fetchHolidayById } from 'apps/frontend/redux/features/holidays/thunk/fetch-holiday-by-id.thunk';
import HolidayUpdateModal from './update-modal.component';
import DeleteModal from './delete-modal.component';
import AddHolidayModal from './add-modal.component';

const defaultPagination = {
  limit: 5,
  page: 1,
  name: '',
  search: '',
  type: '',
  sort: 'date_start',
  dir: 'ASC',
};

function HolidaysManagement(props: any) {
  const holidays = useAppSelector((state) => state.holiday.holidays);
  const [pagination, setPagination] = useState<PagingParams>(defaultPagination);
  const [debounceSearchValue] = useDebouncedValue(pagination.name, 400);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchHolidays(pagination));
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
    return dispatch(fetchHolidayById(idVal));
  };

  const [id, setId] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUploadShown, setUploadShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
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
          onClick={() => setRestoreDeletedShown(true)}
          style={{ marginRight: 10 }}
        >
          <TrashOff />
        </Button>

        <Button
          variant="outline"
          color="green"
          onClick={() => setUploadShown(true)}
          style={{ marginRight: 10 }}
        >
          <Upload />
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
    delete: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setDeleteShown(!isDeleteShown));
    },
  };

  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
  };
  const handleUploadModalClose = () => {
    setUploadShown(false);
  };

  return (
    <>
      <AdminLayout>
        <Header title="Holidays Management" icon={<Calendar size={50} />} />
        <TableHeader
          actionsLeft={null}
          handleResetFilter={() => handleResetFilter()}
          actions={<ActionsFilter />}
          setSearch={(val) => handleSearchValue(val)}
          search={pagination.search}
        />

        <RestoreDeletedHolidayModal
          isShown={isRestoreDeletedShown}
          toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
          pagination={pagination}
        />

        {holidays?.items ? (
          <>
            <TableBody
              actionButtonCb={handleActionsCb}
              toggleSortDirection={(field) => toggleSortDirection(field)}
              data={holidays.items}
              page={pagination.page}
              itemsPerPage={pagination.limit}
              search={pagination.search}
            />
            <HolidayInfoModal
              toggleShown={() => setInfoShown(!isInfoShown)}
              isShown={isInfoShown}
            />
            <DeleteModal
              isShown={isDeleteShown}
              toggleShown={() => setDeleteShown(!isDeleteShown)}
              pagination={pagination}
            />

            <HolidayUpdateModal
              isShown={isUpdateShown}
              toggleShown={() => setUpdateShown(!isUpdateShown)}
              pagination={pagination}
            />
          </>
        ) : (
          <NoDataFound />
        )}
        <UploadModal
          isShown={isUploadShown}
          toggleShown={() => handleUploadModalClose()}
          pagination={pagination}
        />

        <AddHolidayModal
          isShown={isAddShown}
          pagination={pagination}
          toggleShown={() => handleAddModalClose()}
        />
        {holidays?.meta ? (
          <TableFooter
            handlePageChange={(val) => handlePageChange(val)}
            handleLimitChange={(val) => handleLimitChange(val)}
            metadata={holidays.meta}
          />
        ) : null}
      </AdminLayout>
    </>
  );
}

export default HolidaysManagement;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      assa: null,
    },
  };
};
