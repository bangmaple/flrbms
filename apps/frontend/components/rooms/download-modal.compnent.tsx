import React from 'react';
import {
  Button,
  createStyles,
  Divider,
  Modal,
  Switch,
  Text,
} from '@mantine/core';
import { Download, FileDownload } from 'tabler-icons-react';

interface DownloadModalProps {
  isShown: boolean;
  toggleShown(): void;
}

const DownloadModal: React.FC<DownloadModalProps> = (props) => {
  const { classes } = useStyles();

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitleText}>Export to Excel file</Text>;
  };

  return (
    <Modal
      centered
      title={<ModalHeaderTitle />}
      closeOnClickOutside={true}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.buttonContainer}>
        <Button
          color="green"
          className={classes.button}
          leftIcon={<FileDownload />}
        >
          Export only this page
        </Button>
        <Button
          color="orange"
          className={classes.button}
          leftIcon={<Download />}
        >
          Export all data
        </Button>
      </div>
      <Divider className={classes.divider} />
      <Switch className={classes.switch} label="Including DISABLED data" />
      <Switch className={classes.switch} label="Including DELETED data" />
    </Modal>
  );
};

const useStyles = createStyles({
  modalTitleText: {
    fontWeight: 600,
    fontSize: 22,
  },
  buttonContainer: {
    margin: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    flexGrow: 1,
  },
  button: {
    marginTop: 10,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  switch: {
    margin: 5,
  },
});

export default DownloadModal;
