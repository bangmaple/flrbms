import React from "react";
import {Button, createStyles, Modal, Text} from "@mantine/core";
import {FPT_ORANGE_COLOR} from "@app/constants";
import {ABOff, Power, X} from "tabler-icons-react";

interface LogoutModalProps {
  isOpened: boolean;
  handleClose(): void;
  handleRouterReload(): void;
}

const LogoutModal: React.FC<LogoutModalProps> = (props) => {

  const handleLogoutSession = () => {
    fetch('/api/v1/logout')
      .then(() => window.localStorage.removeItem('user'))
      .then(() => props.handleRouterReload());
  };
  return (
    <Modal centered
           title={<Text style={{
             fontSize: 22,
             fontWeight: '600'
           }}>
             Ready to log out?
           </Text>}
           withCloseButton={false}
           zIndex={999999999999}
           closeOnClickOutside={false}
           closeOnEscape={false}
           trapFocus={true}
           opened={props.isOpened}
           onClose={() => props.handleClose()}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: 10
      }}>
        <Text>
          You current session will be terminated until you log in again! Hope to see you again.
        </Text>
        <div style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Button
            leftIcon={<X/>}
            onClick={() => props.handleClose()}
          >
            Cancel
          </Button>
          <Button
            leftIcon={<Power/>}
            color={"orange"}
            onClick={() => handleLogoutSession()}>
            Sign Out
          </Button>
        </div>
      </div>
    </Modal>

  );
};

const styles = createStyles({

});

export default LogoutModal;
