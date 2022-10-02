import React from 'react';
import { Button, createStyles, Modal, Text } from '@mantine/core';
import { AlertCircle } from 'tabler-icons-react';
import { resetLoginFailedStatus } from '../redux/features/account/auth.slice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { FPT_ORANGE_COLOR } from '@app/constants';

const LoginFailedModal: React.FC<any> = (props) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();
  const isLoginFailed = useAppSelector((state) => state.auth.isLoginFailed);
  const loginErrorMsg = useAppSelector((state) => state.auth.error);

  return (
    <Modal
      centered
      withCloseButton={false}
      opened={isLoginFailed}
      onClose={() => dispatch(resetLoginFailedStatus())}
    >
      <div className={classes.container}>
        <AlertCircle size={50} color="red" />
      </div>
      <Text size="xl" weight={600} align="center" color="">
        Unauthorized
      </Text>
      <Text size="xl" weight={500} align="center" color="">
        {loginErrorMsg}
      </Text>

      <Button
        type="submit"
        onClick={() => dispatch(resetLoginFailedStatus())}
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

export default LoginFailedModal;
