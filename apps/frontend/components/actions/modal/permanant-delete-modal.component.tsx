import React from 'react';
import { Button, createStyles, Modal, Text } from '@mantine/core';
import { Trash, X } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';

interface PermanentDeleteModalProps {
  isShown: boolean;
  toggleShown(): void;
  handleSubmit(): void;
}

const PermanentDeleteModal: React.FC<PermanentDeleteModalProps> = (props) => {
  const { classes } = useStyles();

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitle}>Are you sure?</Text>;
  };

  return (
    <Modal
      closeOnClickOutside={true}
      centered
      zIndex={1000}
      title={<ModalHeaderTitle />}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <div className={classes.modalContainer}>
        <Text className={classes.modalBody}>
          Once permanently deleted, you will not be able to recover in any way.
          Make sure you still want to continue deleting!!!
        </Text>
        <div className={classes.modalFooter}>
          <Button
            color="red"
            leftIcon={<Trash />}
            onClick={() => props.handleSubmit()}
            style={{
              width: '60%',
              margin: 10,
            }}
          >
            Permanent Delete
          </Button>
          <Button
            onClick={() => props.toggleShown()}
            leftIcon={<X />}
            style={{
              backgroundColor: FPT_ORANGE_COLOR,
              width: '60%',
              margin: 10,
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const useStyles = createStyles({
  modalTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalContainer: {
    margin: 10,
  },
  modalBody: {
    margin: 10,
    textAlign: 'justify',
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PermanentDeleteModal;
