import React, { useEffect, useState } from 'react';
import { Button, createStyles, ScrollArea } from '@mantine/core';
import { ChevronsRight } from 'tabler-icons-react';
import { FormikProps } from 'formik';
import { useAppSelector } from '../../redux/hooks';
import dayjs from 'dayjs';

interface ConfirmModalProps {
  formik: FormikProps<any>;
  handleSubmit(): void;
  handleBackChooseDevice(): void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { classes } = useStyles();
  const room = useAppSelector((state) => state.room.room);
  const userNames = useAppSelector((state) => state.account.userNames);
  const reasonNames = useAppSelector(
    (state) => state.bookingReason.reasonNames
  );

  const [roomUser, setRoomUser] = useState<string>();
  const [reason, setReason] = useState<{ value: string; label: string }>();

  useEffect(() => {
    if (props.formik.values.bookedFor) {
      const result = userNames?.filter(
        (user) => user.value === props.formik.values.bookedFor
      );
      setRoomUser(result[0]?.label);
    }
  }, []);

  useEffect(() => {
    const result = reasonNames?.filter(
      (re) => re.value === props.formik.values.bookingReasonId
    );
    setReason(result[0]);
  }, []);

  return (
    <div>
      <ScrollArea style={{ height: 480, marginBottom: 5, borderRadius: 5 }}>
        <div className={classes.mainDiv}>
          <div style={{ textAlign: 'center' }}>
            <b>CONFIRM INFORMATION OF BOOKING</b>
          </div>
          <div className={classes.nameAndDateDiv}>
            <b style={{ marginRight: 10, flexBasis: '30%' }}>Room name:</b>
            <div
              style={{
                backgroundColor: 'white',
                padding: "5px 10px",
                borderRadius: 5,
                flexBasis: '70%',
                color: 'black',
              }}
            >
              {room.name}
            </div>
          </div>
          <div className={classes.nameAndDateDiv}>
            <b style={{ marginRight: 10, flexBasis: '30%' }}>Checked in date:</b>
            <div
              style={{
                backgroundColor: 'white',
                padding: "5px 10px",
                borderRadius: 5,
                flexBasis: '70%',
                color: 'black',
              }}
            >
              {dayjs(props.formik.values.checkinDate).format('ddd DD-MM-YYYY')}
            </div>
          </div>
          {props.formik.values.checkoutDate ? (
            <div className={classes.nameAndDateDiv}>
              <b style={{ marginRight: 10, flexBasis: '30%' }}>
                Date check out:
              </b>
              <div
                style={{
                  backgroundColor: 'white',
                  padding: "5px 10px",
                  borderRadius: 5,
                  flexBasis: '70%',
                  color: 'black',
                }}
              >
                {dayjs(props.formik.values.checkoutDate).format(
                  'ddd DD-MM-YYYY'
                )}
              </div>
            </div>
          ) : null}
          <div
            style={{
              display: 'flex',
              boxShadow:
                'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
              borderRadius: 5,
              padding: 10,
              margin: '5px',
              justifyContent: 'space-between',
              width: '80%',
            }}
          >
            <div className={classes.slotArea}>
              <b style={{ marginRight: 10 }}>From:</b>
              <div className={classes.slotDiv}>
                <p>{dayjs(props.formik.values.timeStart).format("HH:mm")}</p>
              </div>
            </div>
            <ChevronsRight
              size={40}
              strokeWidth={2}
              color={'black'}
              style={{}}
            />
            <div className={classes.slotArea}>
              <b style={{ marginRight: 10 }}>To:</b>
              <div className={classes.slotDiv}>
                <p>{dayjs(props.formik.values.timeEnd).format("HH:mm")}</p>
              </div>
            </div>
          </div>

          <div className={classes.nameAndDateDiv}>
            <b style={{ marginRight: 10, flexBasis: '30%' }}>Room user:</b>
            <div
              style={{
                backgroundColor: 'white',
                padding: "5px 10px",
                borderRadius: 5,
                flexBasis: '70%',
                color: 'black',
              }}
            >
              {roomUser || "Yourself"}
            </div>
          </div>

          <div className={classes.otherDiv}>
            <div style={{ flexBasis: '30%' }}>
              <b>List device:</b>
            </div>
            {props.formik.values.listDevice.length > 0 ? (
              props.formik.values.listDevice.map((item) => (
                <div key={item.value} className={classes.item}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ margin: ' 0 10px' }}>{item.quantity}</div>
                    <div>{item.label}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>None</p>
            )}
          </div>
          <div className={classes.otherDiv}>
            <b style={{ marginRight: 10, flexBasis: '30%' }}>Reason:</b>
            {reason && reason.label}
          </div>

          <div
            style={{
              padding: 10,
              borderRadius: 5,
              margin: '5px 20px 5px 5px',
              boxShadow:
                'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
            }}
          >
            <b style={{ marginRight: 10, flexBasis: '30%' }}>Description:</b>
            {props.formik.values.description || 'Dont have description'}
          </div>
        </div>
      </ScrollArea>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => props.handleBackChooseDevice()} color="green">
          Back
        </Button>

        <Button onClick={() => props.handleSubmit()} color="green">
          Book
        </Button>
      </div>
    </div>
  );
};

const useStyles = createStyles({
  mainDiv: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 470,
    // color: 'white',
  },
  nameAndDateDiv: {
    display: 'flex',
    padding: 10,
    margin: '5px',
    boxShadow:
      'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
    width: '80%',
    borderRadius: '5px',
    alignItems: 'center',
  },
  otherDiv: {
    padding: 10,
    borderRadius: 5,
    margin: '5px 20px 5px 5px',
    boxShadow:
      'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
  },
  slotArea: {
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
  },
  slotDiv: {
    width: 100,
    backgroundColor: 'white',
    borderRadius: '0.5em',
    fontSize: '1rem',
    color: 'black',
    padding: "10px 0"
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5em',
    backgroundColor: 'white',
    marginBottom: '0.75em',
    borderRadius: '0.5em',
    // boxShadow: 'rgb(238 239 255) 0px 0px 0px 3px',
    color: 'black',
    fontSize: '0.875em',
  },
});

export default ConfirmModal;
