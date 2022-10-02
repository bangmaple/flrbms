import React from 'react';
import { Button, createStyles, Modal, Text } from '@mantine/core';
import { AlertCircle } from 'tabler-icons-react';
import { resetLoginFailedStatus } from '../../redux/features/account/auth.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { FPT_ORANGE_COLOR } from '@app/constants';

interface SystemErrorModal {
  opened: boolean;
  handleClose(): void;
}

const SystemErrorModal: React.FC<SystemErrorModal> = (props) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector((state) => state.system.errorMessage);

  return (
    <Modal
      centered
      withCloseButton={false}
      opened={props.opened}
      closeOnClickOutside={false}
      closeOnEscape={false}
      closeButtonLabel={null}
      trapFocus={true}
      zIndex={9999999999999}
      onClose={() => dispatch(resetLoginFailedStatus())}
    >
      <div className={classes.container}>
        <AlertCircle size={50} color="red" />
      </div>

      <Text size="xl" weight={500} align="center" color="">
        {errorMessage}
      </Text>

      <Button
        type="submit"
        onClick={() => props.handleClose()}
        className={classes.button}
        fullWidth
        mt="xl"
        size="md"
      >
        Close
      </Button>
    </Modal>
  );
};

const useStyles = createStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: FPT_ORANGE_COLOR,
    borderRadius: 50,
    height: 50,
    fontSize: 20,
  },
});

export default SystemErrorModal;
