import React, { useEffect, useRef } from 'react';
import { Button, createStyles, InputWrapper } from '@mantine/core';
import {
  CalendarStats,
  ClipboardText,
  FileDescription,
  Id,
  User,
  X,
} from 'tabler-icons-react';
import { InputInfoProps } from '../models/input-info-props.model';
import InputType from '../common/input-type.component';
import autoAnimate from '@formkit/auto-animate';

interface InfoComponentProps {
  fields: InputInfoProps[];
  toggleShown(): void;

  isShowListItems: boolean;
  itemsOfData: any[];
  itemsOfDataButton: React.ReactNode;
  title: string;
}

const InfoComponent: React.FC<InfoComponentProps> = (props) => {
  const { classes } = useStyles();

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const listItemDiv =
    props.itemsOfData && props.itemsOfData.length > 0
      ? props.itemsOfData.map((item) => (
          <div key={item.id} className={classes.itemRow}>
            <p className={classes.col1}>{item.name || item.username}</p>
          </div>
        ))
      : null;

  const RenderIcon: React.FC<{ field: string }> = (props) => {
    switch (props.field) {
      case 'id':
        return <Id />;
      case 'name':
        return <ClipboardText />;
      case 'description':
        return <FileDescription />;
      case 'createdAt':
        return <CalendarStats />;
      case 'updatedAt':
        return <CalendarStats />;
      case 'updatedBy':
        return <User />;
      case 'createdBy':
        return <User />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex' }} ref={parent}>
      <div className={classes.body}>
        <div className={classes.inner}>
          {props.fields.map((field, index) => (
            <InputWrapper
              key={index}
              label={field.label}
              className={classes.inputWrapper}
            >
              <InputType
                id={field.id}
                name={field.name}
                inputtype={field.inputtype}
                icon={<RenderIcon field={field.id} />}
                defaultValue={field.value}
                readOnly={field.readOnly}
              />
            </InputWrapper>
          ))}
        </div>
        <div className={classes.footer}>
          <Button
            leftIcon={<X />}
            color="orange"
            onClick={() => props.toggleShown()}
            style={{ marginRight: 20 }}
          >
            Close
          </Button>

          {props.itemsOfData?.length > 0 ? props.itemsOfDataButton : null}
        </div>
      </div>
      {props.isShowListItems &&
        props.itemsOfData &&
        props.itemsOfData.length > 0 && (
          <div style={{ marginLeft: 10 }}>
            <div style={{ marginBottom: 35 }}>
              <b>{props.title}</b>
            </div>
            {listItemDiv}
          </div>
        )}
    </div>
  );
};

const useStyles = createStyles({
  headerTitle: { fontWeight: 600, fontSize: 20 },
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 500,
    width: 500,
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

export default InfoComponent;
