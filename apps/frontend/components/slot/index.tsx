import React, { useEffect, useState } from 'react';
import { Button, createStyles } from '@mantine/core';
import AdminLayout from '../../components/layout/admin.layout';
import Header from '../../components/common/header.component';
import {Bookmark, BuildingWarehouse, Plus, TrashOff, X} from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  defaultPaginationParams,
  PaginationParams,
} from '../../models/pagination-params.model';
import { TableBody } from './table-body.component';
import TableFooter from '../../components/actions/table-footer.component';
import AddModal from './add-modal.component';
import { InputTypes } from '../../components/actions/models/input-type.constant';
import InfoModal from '../../components/actions/modal/info-modal.component';
import RestoreDeletedModal from './restore-deleted.modal.component';
import dayjs from 'dayjs';
import { fetchAllSlots } from '../../redux/features/slot';
import { fetchSlotById } from '../../redux/features/slot/thunk/fetch-by-id.thunk';
import DeleteModal from './delete-modal.component';
import NoDataFound from '../no-data-found';
import SlotInfoModal from './info-modal.component';
import SlotUpdateModal from './update-modal.component';

// const AddSlotValidation = Yup.object().shape({
//   name: Yup.string()
//     .trim()
//     .min(1, 'Minimum device type name is 1 character')
//     .max(100, 'Maximum device type name is 100 characters.')
//     .required('Device type name is required'),
//   // description: Yup.string().max(
//   //   500,
//   //   'Maximum Device type description is 500 characters'
//   // ),
// });

const ManageSlots: React.FC<any> = () => {
  const slot = useAppSelector((state) => state.slot.slot);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllSlots()).unwrap();
  }, []);

  // const toggleSortDirection = () => {
  //   setPagination({
  //     ...pagination,
  //     dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
  //   });
  // };
  //
  // const handleSearchValue = (val: string) => {
  //   setPagination({
  //     ...defaultPaginationParams,
  //     search: val,
  //   });
  // };
  //
  // const handleLimitChange = (val: number) => {
  //   setPagination({
  //     ...pagination,
  //     limit: val,
  //   });
  // };

  // const handlePageChange = (val: number) => {
  //   setPagination({
  //     ...pagination,
  //     page: val,
  //   });
  // };
  //
  // const handleResetFilter = () => {
  //   setPagination(defaultPaginationParams);
  // };

  const handleFetchById = (idVal) => {
    return dispatch(fetchSlotById(idVal));
  };

  const [key, setKey] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [itemsOfData, setItemsOfData] = useState<any>([]);

  const ActionsFilter: React.FC = () => {
    return (
      <div>
        <Button
          leftIcon={<Plus />}
          color="green"
          onClick={() => setAddShown(!isAddShown)}
          style={{ marginRight: 10 }}
        >
          Add
        </Button>
      </div>
    );
  };

  const handleActionsCb = {
    info: (id) => {
      setKey(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
    update: (id) => {
      setKey(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setUpdateShown(!isUpdateShown));
    },
    delete: (id) => {
      setKey(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setDeleteShown(!isDeleteShown));
    },
  };

  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
  };

  return (
    <AdminLayout>
      <Header
        title="Slots Configuration"
        icon={<Bookmark size={50} />}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ActionsFilter />
      </div>
      {slot ? (
        <>
          <TableBody actionButtonCb={handleActionsCb} data={slot} />
          <SlotInfoModal
            toggleShown={() => setInfoShown(!isInfoShown)}
            isShown={isInfoShown}
          />
          <SlotUpdateModal
            keySlot={key}
            toggleShown={() => setUpdateShown(!isUpdateShown)}
            isShown={isUpdateShown}
          />

          <DeleteModal
            keySlot={key}
            isShown={isDeleteShown}
            toggleShown={() => setDeleteShown(!isDeleteShown)}
          />
        </>
      ) : (
        <NoDataFound />
      )}
      <AddModal
        isShown={isAddShown}
        toggleShown={() => handleAddModalClose()}
      />
    </AdminLayout>
  );
};

export default ManageSlots;
