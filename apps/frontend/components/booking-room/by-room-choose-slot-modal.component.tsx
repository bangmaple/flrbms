import React, { useEffect, useState } from 'react';
import { Button, createStyles, Select, Table } from '@mantine/core';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  Door,
  X,
} from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import dayjs from 'dayjs';
import { FormikProps } from 'formik';
import { DatePicker } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { fetchListBookingByRoomInWeek } from '../../redux/features/room-booking/thunk/fetch-list-booking-by-room-in-week.thunk';
import { IsUserHaveBookedSameSlot } from '../../redux/features/room-booking/thunk/fetch-room-booked-same-slot-of-user.thunk';
import { UserInfoModel } from '../../models/user/user-info.model';
import { FPT_ORANGE_COLOR } from '@app/constants';


interface ChooseSlotModalProps {
  formik: FormikProps<any>;
  handleSubmit(): void;
  handleBackChooseRoom(): void;
  handleNextChooseDevice(): void;
  roomName: string;
}
const ChooseSlotModal: React.FC<ChooseSlotModalProps> = (props) => {
  const { classes } = useStyles();
  const [slotNames, setSlotName] = useState<any[]>();
  //BUGG
  const slotInfors = [];
  const dispatch = useAppDispatch();
  const [dayShowShecule, setDayShowShecule] = useState(
    new Date(dayjs(new Date()).format('YYYY-MM-DD'))
  ); // get current date
  const curr = new Date();
  const sun = dayShowShecule.getDate() - dayShowShecule.getDay(); // First day is the day of the month - the day of the week
  const [days, setDays] = useState<any[]>();
  const [listRequest, setListRequest] = useState([]);
  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const handleNextStep = () => {
    if (
      props.formik.values.checkinDate === null ||
      props.formik.values.checkinSlot === null ||
      props.formik.values.checkoutSlot === null
    ) {
      showNotification({
        id: 'miss-data',
        color: 'red',
        title: 'Miss some filed',
        message: 'Please choose day, slot start, slot end before to next step',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      dispatch(
        IsUserHaveBookedSameSlot({
          checkinDate: props.formik.values.checkinDate,
          userId: props.formik.values.bookedFor || userInfo.id,
          timeStart: props.formik.values.checkinSlot,
          timeEnd: props.formik.values.checkoutSlot,
        })
      )
        .unwrap()
        .then((response) => {
          if (!response) {
            props.handleNextChooseDevice();
          } else {
            showNotification({
              id: 'miss-data',
              color: 'red',
              title: 'You have another requests at same time',
              message: `You already have request booked for ${response} at same time. Please choose another time`,
              icon: <X />,
              autoClose: 3000,
            });
          }
        });
    }
  };

  const toNextWeek = () => {
    setDayShowShecule(
      new Date(dayShowShecule.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
  };

  const toLastWeek = () => {
    setDayShowShecule(
      new Date(dayShowShecule.getTime() - 7 * 24 * 60 * 60 * 1000)
    );
  };

  useEffect(() => {
    if (props.formik.values.checkinSlot && props.formik.values.checkoutSlot) {
      const slotIn = slotInfors.find(
        (slot) => slot.id === props.formik.values.checkinSlot
      );
      const slotOut = slotInfors.find(
        (slot) => slot.id === props.formik.values.checkoutSlot
      );
      if (slotIn.slotNum > slotOut.slotNum) {
        const tmp = props.formik.values.checkinSlot;
        props.formik.setFieldValue(
          'checkinSlot',
          props.formik.values.checkoutSlot
        );
        props.formik.setFieldValue('checkoutSlot', tmp);
      }
    }
  }, [props.formik.values.checkinSlot, props.formik.values.checkoutSlot]);

  useEffect(() => {
    if (props.formik.values.roomId !== '') {
      dispatch(
        fetchListBookingByRoomInWeek({
          roomId: props.formik.values.roomId,
          date: dayShowShecule.toUTCString(),
        })
      )
        .unwrap()
        .then((listBooking) =>
          setListRequest(
            listBooking.map((request) => {
              return {
                ...request,
                checkinDate: new Date(request.checkinDate).getDate(),
              };
            })
          )
        );
    }
  }, [dayShowShecule, dispatch, props.formik.values.roomId]);

  useEffect(() => {
    props.formik.values.checkinSlot = null;
    props.formik.values.checkoutSlot = null;
    if (props.formik.values.checkinDate) {
      const currTime = dayjs(new Date()).format('HH:mm:ss');
      const choosedDay = new Date(props.formik.values.checkinDate).getDate();

      const result = slotInfors?.map((slot) => {
        let isFree = true;
        if (choosedDay === curr.getDate() && currTime > slot.timeStart) {
          isFree = false;
        }
        listRequest.forEach((request) => {
          if (request.checkinDate === choosedDay) {
            return request.checkinDate === choosedDay &&
              request.slotIn <= slot.slotNum &&
              request.slotOut >= slot.slotNum &&
              request.status === 'BOOKED'
              ? (isFree = false)
              : null;
          }
        });

        if (isFree) {
          return {
            value: slot.id,
            label: slot.name,
            disabled: false,
          };
        } else {
          return {
            value: slot.id,
            label: slot.name,
            disabled: true,
          };
        }
      });
      setSlotName(result);
    } else {
      const result = slotInfors?.map((slot) => {
        return { value: slot.id, label: slot.name, disabled: true };
      });
      setSlotName(result);
    }
  }, [props.formik.values.checkinDate]);

  useEffect(() => {
    const tmpArr = [];

    for (let i = 0; i < 7; i++) {
      const test = new Date(dayShowShecule);
      tmpArr[i] = new Date(test.setDate(sun + i + 1));
    }

    setDays(tmpArr);
  }, [dayShowShecule, sun]);

  const rows = slotInfors?.map((slot, indexSlot) => {
    let isBooked = false;
    let isPending = false;
    let isPassed = false;
    return (
      <tr key={slot.id}>
        <td style={{ padding: '2px 10px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {slot.name}
            <div style={{ display: 'flex', fontSize: 10 }}>
              {slot.timeStart.slice(0, 5)} -{slot.timeEnd.slice(0, 5)}
            </div>
          </div>
        </td>
        {days
          ? days.map((day, index) => {
              isBooked = false;
              isPending = false;
              isPassed = false;
              return (
                <td key={indexSlot + '' + index}>
                  {listRequest?.length > 0
                    ? listRequest?.map((request) => {
                        if (day < curr.setHours(0, 0, 0, 0)) {
                          isPassed = true;
                        }
                        if (request.checkinDate === day.getDate()) {
                          return request.checkinDate === day.getDate() &&
                            request.slotIn <= slot.slotNum &&
                            request.slotOut >= slot.slotNum
                            ? request.status === 'BOOKED'
                              ? (isBooked = true)
                              : (isPending = true)
                            : null;
                        }
                      })
                    : day < curr.setHours(0, 0, 0, 0)
                    ? (isPassed = true)
                    : null}
                  {!isPassed ? (
                    isPending ? (
                      <div className={classes.slotPending}></div>
                    ) : isBooked ? (
                      <div className={classes.slotBooked}></div>
                    ) : (
                      <div className={classes.slotFree}></div>
                    )
                  ) : (
                    <div className={classes.dayPassed}></div>
                  )}
                </td>
              );
            })
          : null}
      </tr>
    );
  });

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div className={classes.divInfor}>
          <div
            className={classes.roomNameDiv}
          >
            <Door size={20} strokeWidth={2} color={'#fff'} /> Room:{' '}
            {props.roomName}
          </div>
          <div className={classes.divHeader}>
            <h3 style={{ margin: 0 }}>Choose time to book</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => toLastWeek()}
              color="orange"
              size="xs"
              variant="subtle"
              disabled={
                dayShowShecule.setHours(0, 0, 0, 0) == curr.setHours(0, 0, 0, 0)
                  ? true
                  : false
              }
            >
              <ChevronLeft />
            </Button>
            {days ? (
              <h4
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '0',
                  justifyContent: 'center',
                  width: 100,
                }}
              >
                {days[0].getDate() +
                  '/' +
                  (days[0].getMonth() + 1) +
                  '  -  ' +
                  days[6].getDate() +
                  '/' +
                  (days[6].getMonth() + 1)}
              </h4>
            ) : null}
            <Button
              onClick={() => toNextWeek()}
              color="orange"
              size="xs"
              variant="subtle"
              disabled={
                dayShowShecule.setHours(0, 0, 0, 0) ==
                new Date(curr.getTime() + 2 * 7 * 24 * 60 * 60 * 1000).setHours(
                  0,
                  0,
                  0,
                  0
                )
                  ? true
                  : false
              }
            >
              <ChevronRight />
            </Button>
          </div>
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>
                  <div className={classes.thDiv}>Mon</div>
                </th>
                <th>
                  <div className={classes.thDiv}>Tue</div>
                </th>
                <th>
                  <div className={classes.thDiv}>Wed</div>
                </th>
                <th>
                  <div className={classes.thDiv}>Thu</div>
                </th>
                <th>
                  <div className={classes.thDiv}>Fri</div>
                </th>
                <th>
                  <div className={classes.thDiv}>Sat</div>
                </th>
                <th>
                  <div className={classes.thDiv}>Sun</div>
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
        <div style={{ display: 'flex' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}
          >
            <div className={classes.noteSlotBooked}>.</div>
            <p>Slot was booked</p>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}
          >
            <div className={classes.noteSlotPending}>.</div>
            <p>Slot have request pending</p>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}
          >
            <div className={classes.noteSlotFree}>.</div>
            <p>Slot free</p>
          </div>
        </div>
      </div>
      <div
        style={{
          paddingLeft: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <DatePicker
            id="checkinDate"
            style={{ width: '200px', paddingBottom: 20 }}
            label="Check-in date"
            placeholder="Select date"
            radius="md"
            required
            inputFormat="DD/MM/YYYY"
            value={props.formik.values.checkinDate}
            minDate={dayjs(new Date()).toDate()}
            maxDate={ userInfo.role === 'Staff' ? dayjs(new Date())
              .startOf('weeks')
              .add(21, 'days')
              .toDate() : null}
            // onChange={(date) => setbookDate(date)}
            onChange={(date) => {
              props.formik.setFieldValue('checkinDate', date);
            }}
            // excludeDate={(date) => date.getDay() === 0 || date.getDay() === 7}
          />

          <Select
            id="checkinSlot"
            style={{ paddingBottom: 10 }}
            label="From slot"
            required
            transition="pop-top-left"
            transitionDuration={80}
            transitionTimingFunction="ease"
            // dropdownPosition="top"
            radius="md"
            data={slotNames || []}
            onChange={props.formik.handleChange('checkinSlot')}
            value={props.formik.values.checkinSlot}
          />
          <ChevronsDown size={28} strokeWidth={2} color={'black'} />
          <Select
            id="checkoutSlot"
            // style={{ width: '140px' }}
            label="To slot"
            required
            transition="pop-top-left"
            transitionDuration={80}
            transitionTimingFunction="ease"
            // dropdownPosition="top"
            radius="md"
            data={slotNames || []}
            onChange={props.formik.handleChange('checkoutSlot')}
            value={props.formik.values.checkoutSlot}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => props.handleBackChooseRoom()}
            // leftIcon={<Pencil />}
            color="green"
          >
            Back
          </Button>

          <Button onClick={() => handleNextStep()} color="green">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const useStyles = createStyles({
  divInfor: {
    backgroundColor: '#f0f0f0',
    paddingBottom: 10,
    borderRadius: 10,
    marginBottom: 10,
    // height: 400,
  },
  divHeader: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px',
    marginTop: '20px',
  },
  thDiv: {
    textAlign: 'center',
  },
  tdDiv: {
    margin: 'auto',
  },
  roomNameDiv: {
    position: 'absolute',
    top: 30,
    left: 30,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: FPT_ORANGE_COLOR,
    padding: 5,
    borderRadius: 10,
    color: '#fff'
  },
  dayPassed: {
    backgroundColor: '#a6a6a6',
    height: 20,
    width: 50,
    borderRadius: 5,
    margin: 'auto',
  },
  slotFree: {
    backgroundColor: '#6bce6b',
    height: 20,
    width: 50,
    borderRadius: 5,
    margin: 'auto',
  },
  slotPending: {
    backgroundColor: '#7373d0',
    height: 20,
    width: 50,
    borderRadius: 5,
    margin: 'auto',
  },
  slotBooked: {
    backgroundColor: '#fd6262',
    height: 20,
    width: 50,
    borderRadius: 5,
    margin: 'auto',
  },
  noteSlotBooked: {
    backgroundColor: '#fd6262',
    height: 15,
    width: 30,
    margin: 0,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 20,
  },
  noteSlotPending: {
    backgroundColor: '#7373d0',
    height: 15,
    width: 30,
    margin: 0,
    borderRadius: 5,
    marginRight: 5,
  },
  noteSlotFree: {
    backgroundColor: '#6bce6b',
    height: 15,
    width: 30,
    margin: 0,
    borderRadius: 5,
    marginRight: 5,
  },
});

export default ChooseSlotModal;
