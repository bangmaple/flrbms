import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  InputWrapper,
  NumberInput,
  NumberInputHandlers,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  Check,
  ChevronsRight,
  CircleCheck,
  ClipboardText,
  Devices,
  Pencil,
  Plus,
  X,
} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import dayjs from 'dayjs';
import autoAnimate from '@formkit/auto-animate';
import ReactStars from 'react-stars';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {showNotification} from '@mantine/notifications';
import {FPT_ORANGE_COLOR} from '@app/constants';
import {updateListDevice} from '../../redux/features/room-booking/thunk/update-list-devices';
import {io} from "socket.io-client";

interface UserInfoModel {
  avatar: string;
  fullname: string;
  role: string;
  phone: string;
  email: string;
  username: string;
  id: string;
  googleId: string;
  keycloakId: string;
  effdate: string;
  description: string;
  img: File;
}

interface RequestInfoComponentProps {
  toggleCancelModalShown(): void;

  toggleRejectModalShown(): void;

  toggleAcceptModalShown(): void;

  toggleCheckinModalShown(): void;

  toggleCheckoutModalShown(): void;

  toggleSendFeedbackModalShown(): void;
}

const RequestInfoComponent: React.FC<RequestInfoComponentProps> = (props) => {
  const {classes} = useStyles();
  const requestBooking = useAppSelector(
    (state) => state.roomBooking.roomBooking
  );
  const [isShowListDevice, setShowListDevice] = useState(false);
  const [isShowFeedback, setShowFeedback] = useState(false);
  const parent = useRef(null);

  const [choosedDevice, setChoosedDevice] = useState<any[]>(
    requestBooking.listDevice || []
  );
  const [device, setDevice] = useState('');

  const handlers = useRef<NumberInputHandlers>();

  const [deviceNames, setDeviceNames] = useState<any[]>(
    useAppSelector((state) => state.device.deviceNames)
  );

  const socket = useMemo(() => {
    return io('ws://localhost:5000/booking');
  }, []);

  useEffect(() => {
    if (choosedDevice.length) {
      const deviceNamesUpdated = deviceNames.filter((deviceName) =>
        choosedDevice.every((choosed) => choosed.deviceId != deviceName.value)
      );
      setDeviceNames(deviceNamesUpdated);
    }
  }, [choosedDevice]);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const RenderDeviceButton: React.FC = () => {
    const dropdown = useRef(null);
    const [show, setShow] = useState(false);

    const [parent] = useAutoAnimate();

    useEffect(() => {
      parent.current && autoAnimate(dropdown.current);
    }, [parent]);
    const reveal = () => setShow(!show);


    console.log(choosedDevice.length)

    switch (requestBooking.status) {
      case 'CHECKED_OUT':
        if (choosedDevice && choosedDevice.length > 0) {
          return (
            <Button
              onClick={() => setShowListDevice(!isShowListDevice)}
              variant="outline"
              color={'blue'}
              leftIcon={<Devices/>}
            >
              Devices
            </Button>
          );
        } else return null;

      default:
        return (
          <Button
            onClick={() => setShowListDevice(!isShowListDevice)}
            variant="outline"
            color={'blue'}
            leftIcon={<Devices/>}
          >
            Devices
          </Button>
        );
    }

  };


  const ButtonRender = (status: string) => {
    switch (status) {
      case 'PENDING':
        if (userInfo.id === requestBooking.requestedById) {
          return (
            <>
              <Button
                onClick={() => props.toggleCancelModalShown()}
                variant="outline"
                color={'red'}
                leftIcon={<X/>}
              >
                Cancel request
              </Button>
              <RenderDeviceButton/>
            </>
          );
        } else {
          return (
            <>
              <Button
                onClick={() => props.toggleRejectModalShown()}
                variant="outline"
                color={'red'}
                leftIcon={<X/>}
              >
                Reject request
              </Button>

              <Button
                onClick={() => props.toggleAcceptModalShown()}
                variant="outline"
                color={'green'}
                leftIcon={<Check/>}
              >
                Accept request
              </Button>

              <RenderDeviceButton/>
            </>
          );
        }
      case 'BOOKED':
        if (userInfo.role !== 'Staff') {
          return (
            <>
              <Button
                onClick={() => props.toggleCancelModalShown()}
                variant="outline"
                color={'red'}
                leftIcon={<X/>}
              >
                Cancel request
              </Button>
              <Button
                onClick={() => props.toggleCheckinModalShown()}
                variant="outline"
                color={'green'}
                leftIcon={<CircleCheck/>}
              >
                Check in
              </Button>

              <RenderDeviceButton/>
            </>
          );
        } else {
          return (
            <>
              <Button
                onClick={() => props.toggleCancelModalShown()}
                variant="outline"
                color={'red'}
                leftIcon={<X/>}
              >
                Cancel request
              </Button>
              <RenderDeviceButton/>
            </>
          );
        }
      case 'CHECKED_IN':
        if (userInfo.role !== 'Staff') {
          return (
            <>
              <Button
                onClick={() => props.toggleCheckoutModalShown()}
                variant="outline"
                color={'green'}
                leftIcon={<CircleCheck/>}
              >
                Check out
              </Button>

              <RenderDeviceButton/>
            </>
          );
        } else return null;

      case 'CHECKED_OUT':

        if (userInfo.id === requestBooking.bookedForId) {
          if (requestBooking.feedback) {
            return (
              <>
                <Button
                  onClick={() => setShowFeedback(!isShowFeedback)}
                  variant="outline"
                  color={'blue'}
                >
                  Feedback
                </Button>
                <RenderDeviceButton/>
              </>
            );
          } else {
            return (
              <>
                <Button
                  onClick={() => props.toggleSendFeedbackModalShown()}
                  variant="outline"
                  color={'green'}
                >
                  Send feedback
                </Button>
                <RenderDeviceButton/>

              </>
            );
          }
        } else {
          if (requestBooking.feedback) {
            return (
              <>
                <Button
                  onClick={() => setShowFeedback(!isShowFeedback)}
                  variant="outline"
                  color={'blue'}
                >
                  Feedback
                </Button>
                <RenderDeviceButton/>
              </>
            );
          } else {
            return <RenderDeviceButton/>
          }
        }

    }

  };
  const remove = (item) => {
    for (const d of choosedDevice) {
      if (d.deviceId === item) {
        setDeviceNames((devicename) => [
          ...devicename,
          {value: d.deviceId, label: d.deviceName},
        ]);
        break;
      }
    }
    const chooesdDeviceUpdated = choosedDevice.filter(
      (d) => d.deviceId !== item
    );

    setChoosedDevice(chooesdDeviceUpdated);
  };

  const ListDeviceDiv: React.FC = () => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(0);
    const [disable, setDisable] = useState(true);
    const add = () => {
      if (value === 0 || !value) {
        showNotification({
          id: 'miss-data',
          color: 'red',
          title: 'Quantity missed',
          message: 'Please choose quantity of device you want to use',
          icon: <X/>,
          autoClose: 3000,
        });
      } else if (!device) {
        showNotification({
          id: 'miss-data',
          color: 'red',
          title: 'Device missed',
          message: 'Please choose device you want to use',
          icon: <X/>,
          autoClose: 3000,
        });
      } else {
        if (deviceNames.length) {
          for (const de of deviceNames) {
            if (de.value === device) {
              setChoosedDevice((devices) => [
                ...devices,
                {
                  deviceId: de.value,
                  deviceName: de.label,
                  deviceQuantity: value,
                },
              ]);
              setDevice('');
              setValue(0);
              break;
            }
          }
          const deviceNamesUpdated = deviceNames.filter(
            (deviceName) => deviceName.value !== device
          );
          setDeviceNames(deviceNamesUpdated);
        } else {
          showNotification({
            id: 'miss-data',
            color: 'red',
            title: 'Out of device!',
            message: 'Dont have any device to choose',
            icon: <X/>,
            autoClose: 3000,
          });
          alert('Out of device!');
        }
      }
    };

    useEffect(() => {
      const isSame1 = choosedDevice.every((newDevice) =>
        requestBooking.listDevice.some((oldDevice) => {
          return (
            oldDevice.deviceId === newDevice.deviceId &&
            oldDevice.deviceQuantity === newDevice.deviceQuantity
          );
        })
      );

      const isSame2 = requestBooking.listDevice.every((oldDevice) =>
        choosedDevice.some((newDevice) => {
          return (
            oldDevice.deviceId === newDevice.deviceId &&
            oldDevice.deviceQuantity === newDevice.deviceQuantity
          );
        })
      );

      setDisable(isSame1 && isSame2);
    }, []);

    const handleKeypress = (e) => {
      if (e.which === 13) {
        add();
      }
    };

    useEffect(() => {
      if (device) {
        setValue(1);
      } else {
        setValue(0);
      }
    }, [device]);

    const update = () => {

      dispatch(
        updateListDevice({
          requestId: requestBooking.id,
          listDevice: choosedDevice,
        })
      ).unwrap()
        .then(response => {
          socket.emit('updateDevicesForOthers', response);
          showNotification({
            id: 'load-data',
            color: 'teal',
            title: 'Borrowed devices were updated',
            message: 'Borrowed devices were successfully updated',
            icon: <Check/>,
            autoClose: 3000,
          })
        })
        .catch((e) =>
          showNotification({
            id: 'load-data',
            color: 'red',
            title: 'Error while updating borrowed devices',
            message: e.message ?? 'Failed to update borrowed devices',
            icon: <X/>,
            autoClose: 3000,
          })
        )
    };


    return (
      <>
        <div className={classes.displayFex}>
          <Select
            id="device"
            name="device"
            label="Select device (optional)"
            onChange={setDevice}
            value={device}
            transition="pop-top-left"
            transitionDuration={80}
            transitionTimingFunction="ease"
            dropdownPosition="bottom"
            radius="md"
            data={deviceNames}
            searchable={true}
            className={classes.selectComponent}
            onKeyPress={handleKeypress}
          />
          <Group spacing={5} className={classes.groupComponent}>
            <ActionIcon
              size={35}
              variant="default"
              onClick={() => handlers.current.decrement()}
            >
              –
            </ActionIcon>

            <NumberInput
              hideControls
              required
              value={value}
              onChange={(val) => {
                setValue(val);
              }}
              handlersRef={handlers}
              max={30}
              min={0}
              step={1}
              styles={{input: {width: 54, textAlign: 'center'}}}
            />

            <ActionIcon
              size={35}
              variant="default"
              onClick={() => handlers.current.increment()}
            >
              +
            </ActionIcon>
          </Group>
          <Button
            radius="md"
            className={classes.buttonComponent}
            onClick={() => add()}
          >
            <Plus/>
          </Button>
        </div>
        {choosedDevice && choosedDevice.length > 0
          ? choosedDevice.map((device) => (
            <div key={device.deviceId} className={classes.item}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{margin: ' 0 10px'}}>
                  {device.deviceQuantity}
                </div>
                <div>{device.deviceName}</div>
              </div>
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => remove(device.deviceId)}
              >
                <X color="red" size={20} strokeWidth={2.5}/>
              </Button>
            </div>

            // <div key={device.id} className={classes.deviceRow}>
            //   <p className={classes.col1}>{device.deviceName}</p>
            //   <p className={classes.col2}>{device.deviceQuantity}</p>
            // </div>
          ))
          : null}
        <Button
          radius="md"
          className={classes.buttonComponent}
          onClick={() => update()}
          style={{backgroundColor: FPT_ORANGE_COLOR, float: 'right'}}
          disabled={disable}
        >
          <Pencil/> UPDATE
        </Button>
      </>
    );
  };

  const listDeviceCheckOutDiv =
    choosedDevice && choosedDevice.length > 0
      ? choosedDevice.map((device) => (
        <div key={device.id} className={classes.deviceRow}>
          <p className={classes.col1}>{device.deviceName}</p>
          <p className={classes.col2}>{device.deviceQuantity}</p>
        </div>
      ))
      : null;

  const FeedbackDiv: React.FC<{ feedback: any }> = (props) => {
    return (
      <div style={{width: '250px', maxHeight: 400}}>
        <div>
          <b>FEEDBACK</b>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <ReactStars
            count={5}
            value={props.feedback.rateNum}
            edit={false}
            size={35}
            color2={'#ffd700'}
          />
        </div>
        <p>
          <b>Feedback type:</b> {props.feedback.feedbackType || 'none'}
        </p>
        <p>
          <b>Feedback messgase:</b>
        </p>
        <div
          style={{
            backgroundColor: '#d3d3d3',
            padding: 5,
            borderRadius: 5,
            minHeight: 100,
          }}
        >
          <p>{props.feedback.feedbackMess}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{display: 'flex'}} ref={parent}>
      {isShowFeedback && <FeedbackDiv feedback={requestBooking?.feedback}/>}

      <div style={{width: 550, flex: 1, margin: 20}}>
        <div className={classes.modalBody}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <InputWrapper label="Room name" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={requestBooking.roomName}
              />
            </InputWrapper>
            <InputWrapper label="Room user" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={requestBooking.bookedFor}
              />
            </InputWrapper>
          </div>

          <div style={{display: 'flex'}}>
            <InputWrapper label="Request at" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={dayjs(requestBooking.requestedAt).format(
                  'HH:mm DD/MM/YYYY'
                )}
              />
            </InputWrapper>

            <InputWrapper label="Request by" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={requestBooking.requestedBy}
              />
            </InputWrapper>
          </div>

          <div style={{display: 'flex'}}>
            <InputWrapper label="Checkin date" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={dayjs(requestBooking.checkinDate).format('DD/MM/YYYY')}
              />
            </InputWrapper>

            <InputWrapper label="Time start" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={requestBooking.checkinTime.slice(0, 5)}
                style={{width: 150}}
              />
            </InputWrapper>
            <div style={{position: 'relative', top: '45px'}}>
              <ChevronsRight size={28} strokeWidth={2} color={'black'}/>
            </div>
            <InputWrapper label="Time end" className={classes.inputWrapper}>
              <TextInput
                icon={<ClipboardText/>}
                radius="md"
                readOnly
                value={requestBooking.checkoutTime.slice(0, 5)}
                style={{width: 150}}
              />
            </InputWrapper>
          </div>
          {requestBooking.status === 'CANCELLED' ? (
            <>
              <InputWrapper
                label="Reason Cancel"
                className={classes.inputWrapper}
                sx={() => ({
                  label: {
                    color: 'red',
                  },
                })}
              >
                <TextInput
                  icon={<ClipboardText/>}
                  radius="md"
                  readOnly
                  value={requestBooking.cancelReason}
                />
              </InputWrapper>
            </>
          ) : null}

          <InputWrapper label="Reason Booking" className={classes.inputWrapper}>
            <TextInput
              icon={<ClipboardText/>}
              radius="md"
              readOnly
              value={requestBooking.reason || 'Other'}
            />
          </InputWrapper>

          <InputWrapper label="Description" className={classes.inputWrapper}>
            <Textarea
              icon={<ClipboardText/>}
              autosize
              readOnly
              value={requestBooking.description}
            />
          </InputWrapper>
        </div>

        <div className={classes.modalFooter}>
          {ButtonRender(requestBooking.status)}
        </div>
      </div>
      {isShowListDevice ? (
        <div>
          <div style={{marginBottom: 35}}>
            <b>LIST DEVICES</b>
          </div>
          {requestBooking.status === 'CHECKED_OUT' ? listDeviceCheckOutDiv : <ListDeviceDiv/>}

        </div>
      ) : null}
    </div>
  );
};

const useStyles = createStyles({
  modalHeaderTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    width: 550,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 10,
    width: 530,
  },
  modalInputDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrapper: {
    margin: 10,
    flex: 1,
  },
  displayFex: {
    display: 'flex',
    alignItems: 'end',
    marginBottom: 20,
  },
  deviceRow: {
    borderRadius: '3px',
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 9px 0px rgba(0,0,0,0.1)',
    width: 200,
  },
  col1: {
    flexBasis: '80%',
  },
  col2: {
    flexBasis: '20%',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5em',
    backgroundColor: 'white',
    marginBottom: '0.5em',
    borderRadius: '0.5em',
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.1)',
    fontSize: '0.875em',
  },
  groupComponent: {
    marginRight: 10,
  },
  selectComponent: {
    width: '200px',
    marginRight: 10,
  },
  buttonComponent: {
    marginRight: 10,
    backgroundColor: 'red',
  },
});

export default RequestInfoComponent;
