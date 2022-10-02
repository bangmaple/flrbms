import {useState, useRef, useEffect} from 'react';
import {
  NumberInput,
  Group,
  ActionIcon,
  NumberInputHandlers,
  Select,
  createStyles,
  Button,
} from '@mantine/core';
import {FPT_ORANGE_COLOR} from '@app/constants';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchDevicesName} from '../../redux/features/room-booking/thunk/fetch-devices-name';
import {Plus, X} from 'tabler-icons-react';
import {FormikProps} from "formik";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import autoAnimate from "@formkit/auto-animate";

interface SelectDevicesComponentProps {
  formik: FormikProps<any>;
  deviceNum: number;
  currentKey: number;

  setDeviceNum(): void;

  removeItem(val): void;
}

export default function SelectDevicesComponent(props: SelectDevicesComponentProps) {
  const [value, setValue] = useState(0);
  const handlers = useRef<NumberInputHandlers>();
  const dispatch = useAppDispatch();

  const [listDevice, setListDevice] = useState([]);

  useEffect(() => {
    async function loadDeviceName() {
      dispatch(fetchDevicesName())
        .unwrap()
        .then((response) => setListDevice(response))
        .catch((e) => {
          alert(e);
        });
    }
    loadDeviceName();
  }, [dispatch]);

  const {classes} = useStyles();

  return (
    <div className={classes.displayFex}>
      <Select
        id="device"
        label={props.currentKey}
        required
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="ease"
        dropdownPosition="bottom"
        radius="md"
        data={listDevice}
        searchable={true}
        className={classes.selectComponent}
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
          value={value}
          onChange={(val) => setValue(val)}
          handlersRef={handlers}
          max={10}
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
      <Button onClick={() => props.setDeviceNum()} radius="md" className={classes.buttonComponent}>
        <Plus/>
      </Button>
      {props.deviceNum > 1 ?
        <Button onClick={() => props.removeItem(props.currentKey)} radius="md" className={classes.buttonComponent}>
          <X/>
        </Button> : null}
    </div>
  );
}

const useStyles = createStyles({
  displayFex: {
    display: 'flex',
    alignItems: 'end',
  },
  selectComponent: {
    width: '200px',
    marginRight: 10,
  },
  groupComponent: {
    marginRight: 10,
  },
  buttonComponent: {
    marginRight: 10,
    backgroundColor: FPT_ORANGE_COLOR,
  },
});
