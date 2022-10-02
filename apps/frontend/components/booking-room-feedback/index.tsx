import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { PaginationParams } from '../../models/pagination-params.model';
import { useDebouncedValue } from '@mantine/hooks';
import {BuildingWarehouse, Download, MessageShare} from 'tabler-icons-react';
import AdminLayout from '../layout/admin.layout';
import Header from '../common/header.component';
import TableHeader from '../actions/table-header.component';
import { TableBody } from './table-body.component';
import InfoModal from './info-modal.component';
import NoDataFound from '../no-data-found';
import TableFooter from '../actions/table-footer.component';
import { fetchBookingRoomFeedbacks } from '../../redux/features/booking-room-feedback/thunk/fetch-booking-room-feedbacks.thunk';
import { fetchBookingRoomFeedbackById } from '../../redux/features/booking-room-feedback/thunk/fetch-booking-room-feedback-by-id.thunk';
import { Button, createStyles } from '@mantine/core';

const defaultPaginationParams = {
  page: 1,
  limit: 5,
  search: '',
  dir: 'DESC',
  sort: 'f.created_at',
};

const ManageBookingRoomFeedback: React.FC<any> = () => {
  const bookingRoomFeedbacks = useAppSelector(
    (state) => state.bookingRoomFeedback.bookingRoomFeedbacks
  );
  const [pagination, setPagination] = useState<PaginationParams>(
    defaultPaginationParams
  );

  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBookingRoomFeedbacks(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.dir,
    pagination.sort,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  const toggleSortDirection = (field: string) => {
    setPagination({
      ...pagination,
      sort: field,
      dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleSearchValue = (val: string) => {
    setPagination({
      ...defaultPaginationParams,
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
    setPagination(defaultPaginationParams);
  };

  const handleFetchById = (idVal) => {
    return dispatch(fetchBookingRoomFeedbackById(idVal));
  };

  const [isInfoShown, setInfoShown] = useState<boolean>(false);

  const handleActionsCb = {
    info: (id) => {
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
  };

  return (
    <AdminLayout>
      <Header
        title="Room Booking Feedbacks"
        icon={<MessageShare size={50} />}
      />
      <TableHeader
        handleResetFilter={() => handleResetFilter()}
        search={pagination.search}
        actions={null}
        setSearch={(val) => handleSearchValue(val)}
        actionsLeft={null}
      />

      {bookingRoomFeedbacks?.items ? (
        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={(field) => toggleSortDirection(field)}
            data={bookingRoomFeedbacks.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <InfoModal
            header="Room Booking Feedback Information"
            toggleShown={() => setInfoShown(!isInfoShown)}
            isShown={isInfoShown}
          />
        </>
      ) : (
        <NoDataFound />
      )}

      {bookingRoomFeedbacks?.meta ? (
        <TableFooter
          handlePageChange={(val) => handlePageChange(val)}
          handleLimitChange={(val) => handleLimitChange(val)}
          metadata={bookingRoomFeedbacks.meta}
        />
      ) : null}
    </AdminLayout>
  );
};

export default ManageBookingRoomFeedback;
