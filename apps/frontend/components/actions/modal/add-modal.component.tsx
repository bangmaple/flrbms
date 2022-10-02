import React from 'react';
import { Button, createStyles, InputWrapper, Modal } from '@mantine/core';
import { FormikProps, FormikProvider } from 'formik';
import { Plus } from 'tabler-icons-react';
import { InputAddProps } from '../models/input-add-props.model';
import InputType from '../common/input-type.component';

interface AddModalProps {
  header: React.ReactNode;
  isShown: boolean;
  toggleShown(): void;
  formik: FormikProps<any>;
  handleSubmit(): void;
  fields: InputAddProps[];
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { classes } = useStyles();

  return (
    <Modal
      size="lg"
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
      <FormikProvider value={props.formik}>
        <div className={classes.body}>
          <div className={classes.inner}>
            {props.fields.map((field, index) => (
              <InputWrapper
                key={index}
                label={field.label}
                description={field.description}
                required={field.required}
              >
                <InputType
                  id={field.id}
                  name={field.name}
                  onChange={props.formik.handleChange}
                  error={props.formik.errors[field.id]}
                  inputtype={field.inputtype}
                />
              </InputWrapper>
            ))}
          </div>
          <div className={classes.footer}>
            <Button
              onClick={() => props.handleSubmit()}
              leftIcon={<Plus />}
              color="green"
            >
              Add
            </Button>
          </div>
        </div>
      </FormikProvider>
    </Modal>
  );
};

const useStyles = createStyles({
  headerTitle: { fontWeight: 600, fontSize: 20 },
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AddModal;
