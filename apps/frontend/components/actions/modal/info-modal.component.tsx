import React from 'react';
import {createStyles, Modal} from '@mantine/core';
import {InputInfoProps} from '../models/input-info-props.model';
import InfoComponent from './info-component.component';

interface InfoModalProps {
  header: React.ReactNode;
  fields: InputInfoProps[];
  toggleShown(): void;
  isShown: boolean;


  isShowListItems: boolean;
  itemsOfData: any[];
  itemsOfDataButton: React.ReactNode;
  title: string;
}

const InfoModal: React.FC<InfoModalProps> = (props) => {
  const {classes} = useStyles();

  return (
    <Modal
      size="auto"
      centered
      title={<div className={classes.headerTitle}>{props.header}</div>}
      padding="lg"
      transition="pop"
      withinPortal
      trapFocus
      withCloseButton
      closeOnClickOutside
      closeOnEscape
      opened={props.isShown}
      onClose={() => props.toggleShown()}
    >
      <InfoComponent
        toggleShown={props.toggleShown}
        fields={props.fields}
        isShowListItems={props.isShowListItems}
        itemsOfData={props.itemsOfData}
        itemsOfDataButton={props.itemsOfDataButton}
        title={props.title}
      />
    </Modal>
  );
};

const useStyles = createStyles({
  headerTitle: {fontWeight: 600, fontSize: 20},
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    columnGap: 50,
  },
  inputWrapper: {
    margin: 10,
    '&:nth-of-type(1)': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
    },
    '&:nth-of-type(2)': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
    },
    '&:nth-of-type(3)': {
      gridColumnStart: 1,
      gridColumnEnd: 3,
    },
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  itemRow: {
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
});

export default InfoModal;
