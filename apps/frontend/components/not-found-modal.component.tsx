import {createStyles, Modal, Text} from "@mantine/core";
import Image from "next/image";
import React from "react";

interface ItemNotFoundModalProps {
  isShown: boolean;
  toggleShown(): void;
}

const ItemNotFoundModal: React.FC<ItemNotFoundModalProps> = (props) => {

  const {classes} = useStyles();

  const ModalHeader = () => {
    return <Text style={{
      fontSize: 22,
      fontWeight: 600
    }}>
      Records not found
    </Text>;
  }

  return (
    <Modal title={<ModalHeader/>} opened={props.isShown}
            onClose={() => props.toggleShown()} centered>
      <div className={classes.modalBody}>
        <Image src="/location_search.svg" height={300} width={300} layout="fixed"/>
        <Text className={classes.modalBodyFont}>
          The data you are trying to request is not available.
        </Text>

      </div>
    </Modal>
  );

}

const useStyles = createStyles({
  modalBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  modalBodyFont: {
    fontSize: 22,
    textAlign: 'center'
  },
});

export default ItemNotFoundModal;
