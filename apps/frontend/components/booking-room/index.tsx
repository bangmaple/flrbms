import { Button, createStyles, Space } from '@mantine/core';
import AdminLayout from '../../components/layout/admin.layout';
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Ticket } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchRoomBookings } from '../../redux/features/room-booking/thunk/fetch-room-booking-list';
import { fetchRoomBookingById } from '../../redux/features/room-booking/thunk/fetch-room-booking-by-id';
import TableHeader from '../../components/actions/table-header.component';
import { TableBody } from './table-body.component';
import TableFooter from '../../components/actions/table-footer.component';
import NoDataFound from '../../components/no-data-found';
import { BookingRequestParams } from '../../models/pagination-params/booking-room-params.model';
import CancelRequestModal from '../../components/booking-room/cancel-request.component';
import { useDebouncedValue } from '@mantine/hooks';
import Header from '../../components/common/header.component';
import RequestInfoModal from '../../components/booking-room/info-modal.component';
import SendBookingModal from './option-booking-modal.component';
import AcceptRequestModal from './accept-request-modal.component';
import RejectRequestModal from './reject-request.component';
import CheckinRequestModal from './checkin-request.component';
import CheckoutRequestModal from './checkout-request.component';
import { io } from 'socket.io-client';

import { fetchCountRequestBooking } from '../../redux/features/room-booking/thunk/fetch-count-request-booking';
import AddBookingFeedbackModal from '../booking-room-feedback/add-modal.component';
import { fetchFeedbackTypeNames } from '../../redux/features/feedback-type/thunk/fetch-feedback-type-names.thunk';
import { fetchHolidaysMini } from 'apps/frontend/redux/features/holidays/thunk/fetch-holidays-mini.thunk';

const defaultPagination = {
  limit: 5,
  page: 1,
  search: '',
  reasonType: '',
  checkInAt: '',
  checkOutAt: '',
  sort: 'requested_at',
  dir: 'DESC',
  status: '',
};

const BookingRoom = () => {
  const { classes } = useStyles();
  const socket = useMemo(() => {
    return io('ws://localhost:5000/booking');
  }, []);
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isCancelShown, setCancelShown] = useState<boolean>(false);
  const [isRejectShown, setRejectShown] = useState<boolean>(false);
  const [isAcceptShown, setAcceptShown] = useState<boolean>(false);
  const [isCheckinShown, setCheckinShown] = useState<boolean>(false);
  const [isCheckoutShown, setCheckoutShown] = useState<boolean>(false);
  const [isSendFeedbackShown, setSendFeedbackShown] = useState<boolean>(false);
  const [feedbackTypeNames, setFeedbackTypeNames] = useState<any[]>(null);

  const [count, setCount] = useState<{ count: number }[]>([]);

  useEffect(() => {
    socket.on('sendRequestForSelf', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        bookedFor &&
        bookedFor !== _userInfor.id &&
        _userInfor.role !== 'Staff'
      ) {
        dispatch(fetchRoomBookings(pagination));
        dispatch(fetchCountRequestBooking()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('sendRequestForOther', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        bookedFor &&
        (bookedFor === _userInfor.id || _userInfor.role !== 'Staff')
      ) {
        dispatch(fetchRoomBookings(pagination));
        dispatch(fetchCountRequestBooking()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('acceptRequest', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        bookedFor &&
        (bookedFor === _userInfor.id || _userInfor.role !== 'Staff')
      ) {
        dispatch(fetchRoomBookings(pagination));
        dispatch(fetchCountRequestBooking()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('rejectRequest', (bookedFor) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        bookedFor &&
        (bookedFor === _userInfor.id || _userInfor.role !== 'Staff')
      ) {
        dispatch(fetchRoomBookings(pagination));
        dispatch(fetchCountRequestBooking()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('cancelRequest', (payload) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        payload &&
        payload.cancelledBy !== _userInfor.id &&
        _userInfor.role !== 'Staff'
      ) {
        dispatch(fetchRoomBookings(pagination));
        dispatch(fetchCountRequestBooking()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    dispatch(fetchCountRequestBooking()).unwrap().then(setCount);
  }, []);

  useEffect(() => {
    dispatch(fetchHolidaysMini()).unwrap();
  }, []);

  useEffect(() => {
    dispatch(fetchFeedbackTypeNames())
      .unwrap()
      .then((feedbackTypes) => setFeedbackTypeNames(feedbackTypes));
  }, []);

  const roomBookingList = useAppSelector(
    (state) => state.roomBooking.roomBookings
  );

  const [pagination, setPagination] =
    useState<BookingRequestParams>(defaultPagination);
  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRoomBookings(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.search,
    pagination.reasonType,
    pagination.checkInAt,
    pagination.checkOutAt,
    pagination.sort,
    pagination.dir,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  const toggleSortDirection = (label) => {
    setPagination({
      ...pagination,
      sort: label,
      dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleSearchValue = (val: string) => {
    setPagination({
      ...pagination,
      search: val,
    });
  };

  const handleChangeStatus = (val: string) => {
    setPagination({
      ...pagination,
      page: 1,
      status: val,
    });
  };

  const handleLimitChange = (val: number) => {
    setPagination({
      ...pagination,
      page: 1,
      limit: val,
    });
  };

  const handlePageChange = (val: number) => {
    setPagination({
      ...pagination,
      page: val,
    });
  };

  const handleFetchById = (idVal) => {
    return dispatch(fetchRoomBookingById(idVal));
  };

  const handleActionsCb = {
    info: (id) => {
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
  };

  const handleResetFilter = () => {
    setPagination(defaultPagination);
  };

  const ActionsFilter: React.FC = () => {
    return (
      <>
        <Button
          variant="outline"
          color="violet"
          onClick={() => setAddShown(true)}
          style={{ marginRight: 10 }}
        >
          <Plus />
        </Button>
      </>
    );
  };

  const ActionsFilterLeft: React.FC = () => {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <Space w="xl" />

          <Button
            variant="outline"
            color="green"
            onClick={() => handleChangeStatus('BOOKED')}
            size="xs"
          >
            Booked
            {count && count[0]?.count > 0 ? (
              <div
                className={classes.badge}
                style={{ backgroundColor: '#40c057' }}
              >
                {count[0].count}
              </div>
            ) : null}
          </Button>

          <Space w="xl" />

          <Button
            variant="outline"
            color="orange"
            onClick={() => handleChangeStatus('CHECKED_IN')}
            size="xs"
          >
            Checked in
            {count && count[1]?.count > 0 ? (
              <div
                className={classes.badge}
                style={{ backgroundColor: '#fd7e14' }}
              >
                {count[1].count}
              </div>
            ) : null}
          </Button>

          <Space w="xl" />
          <Button
            variant="outline"
            color="violet"
            onClick={() => handleChangeStatus('CHECKED_OUT')}
            size="xs"
          >
            Checked out
            {count && count[2]?.count > 0 ? (
              <div
                className={classes.badge}
                style={{ backgroundColor: '#7950f2' }}
              >
                {count[2].count}
              </div>
            ) : null}
          </Button>

          <Space w="xl" />

          <Button
            variant="outline"
            color="red"
            onClick={() => handleChangeStatus('CANCELLED')}
            size="xs"
          >
            Cancelled
            {count && count[3]?.count > 0 ? (
              <div
                className={classes.badge}
                style={{ backgroundColor: '#fa5252' }}
              >
                {count[3].count}
              </div>
            ) : null}
          </Button>
        </div>
      </>
    );
  };

  return (
    <AdminLayout>
      <Header title="Room Booking" icon={<Ticket size={50} />} />

      <TableHeader
        handleResetFilter={() => handleResetFilter()}
        actions={<ActionsFilter />}
        actionsLeft={<ActionsFilterLeft />}
        setSearch={(val) => handleSearchValue(val)}
        search={pagination.search}
      />

      {roomBookingList.items ? (
        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={(label) => toggleSortDirection(label)}
            data={roomBookingList.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <RequestInfoModal
            toggleShown={() => setInfoShown(!isInfoShown)}
            isShown={isInfoShown}
            toggleCancelModalShown={() => setCancelShown(!isCancelShown)}
            toggleRejectModalShown={() => setRejectShown(!isRejectShown)}
            toggleAcceptModalShown={() => setAcceptShown(!isAcceptShown)}
            toggleCheckinModalShown={() => setCheckinShown(!isCheckinShown)}
            toggleCheckoutModalShown={() => setCheckoutShown(!isCheckoutShown)}
            toggleSendFeedbackModalShown={() =>
              setSendFeedbackShown(!isSendFeedbackShown)
            }
          />
          <RejectRequestModal
            isShown={isRejectShown}
            toggleShown={() => setRejectShown(!isRejectShown)}
            toggleInforModalShown={() => setInfoShown(!isInfoShown)}
            setCount={(val) => setCount(val)}
            pagination={pagination}
          />
          <CancelRequestModal
            isShown={isCancelShown}
            toggleShown={() => setCancelShown(!isCancelShown)}
            toggleInforModalShown={() => setInfoShown(!isInfoShown)}
            setCount={(val) => setCount(val)}
            pagination={pagination}
          />
          <AcceptRequestModal
            isShown={isAcceptShown}
            toggleShown={() => setAcceptShown(!isAcceptShown)}
            toggleInfoModalShown={() => setInfoShown(!isInfoShown)}
            setCount={(val) => setCount(val)}
            pagination={pagination}
          />
          <CheckinRequestModal
            isShown={isCheckinShown}
            toggleShown={() => setCheckinShown(!isCheckinShown)}
            toggleInforModalShown={() => setInfoShown(!isInfoShown)}
            setCount={(val) => setCount(val)}
            pagination={pagination}
          />
          <CheckoutRequestModal
            isShown={isCheckoutShown}
            toggleShown={() => setCheckoutShown(!isCheckoutShown)}
            toggleInforModalShown={() => setInfoShown(!isInfoShown)}
            setCount={(val) => setCount(val)}
            pagination={pagination}
          />
          <TableFooter
            handlePageChange={(val) => handlePageChange(val)}
            handleLimitChange={(val) => handleLimitChange(val)}
            metadata={roomBookingList.meta}
          />
          <AddBookingFeedbackModal
            isShown={isSendFeedbackShown}
            toggleShown={() => setSendFeedbackShown(!isSendFeedbackShown)}
            feedbackTypes={feedbackTypeNames}
          />
        </>
      ) : (
        <NoDataFound />
      )}

      <SendBookingModal
        toggleShown={() => setAddShown(!isAddShown)}
        isShown={isAddShown}
        pagination={pagination}
      />
    </AdminLayout>
  );
};

const useStyles = createStyles({
  text: {
    marginLeft: 10,
    fontWeight: 600,
    fontSize: 30,
  },

  badge: {
    borderRadius: 50,
    marginLeft: 10,
    height: 20,
    width: 25,
    color: 'white',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },

  container: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textModalTitle: {
    marginLeft: 10,
    fontWeight: 600,
    fontSize: 20,
  },
  tableContainer: {
    margin: 10,
  },
  table: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  statusRow: {
    textAlign: 'center',
  },
  bookingDisplay: {
    color: '#228be6',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#0000ff1c',
    fontWeight: 600,
  },
  bookedDisplay: {
    color: '#fd7e14',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#fd7e1442',
    fontWeight: 600,
  },
  canceledDisplay: {
    color: 'red',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#ff00001c',
    fontWeight: 600,
  },
  processingDisplay: {
    color: '#40c057',
    textAlign: 'center',
    borderRadius: 50,
    width: 100,
    backgroundColor: '#00800024',
    fontWeight: 600,
  },
});

export default BookingRoom;
