import React, {useEffect, useState} from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  Check,
  ChevronsRight,
  ClipboardText,
  FileDescription,
  Plus,
  X,
} from 'tabler-icons-react';
import {useAppDispatch} from '../../redux/hooks';
import {Form, FormikProvider, FormikValues, useFormik} from 'formik';
import * as Yup from 'yup';
import {showNotification} from '@mantine/notifications';
import {PagingParams} from '../../models/pagination-params/paging-params.model';
import {addSlot} from '../../redux/features/slot/thunk/add.thunk';
import {fetchAllSlots} from '../../redux/features/slot';
import {TimeInput} from '@mantine/dates';

interface AddModalProps {
  isShown: boolean;

  toggleShown(): void;
}

const AddSlotValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Name must have at least 1 character.')
    .max(100, 'Name can only have at most 100 characters.')
    .required('Name is required!'),

});

const AddSlotModal: React.FC<AddModalProps> = (props) => {
  const {classes} = useStyles();
  const [isAddDisabled, setAddDisabled] = useState<boolean>(false);
  const [slotError, setSlotError] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleAddSubmit = (values: FormikValues) => {
    if (!values.start || !values.end) {
      showNotification({
        id: 'Add-slot',
        color: 'red',
        title: 'Error while adding slot',
        message: `Time start and Time end can be null`,
        icon: <X/>,
        autoClose: 3000,
      });
    } else {
      dispatch(
        addSlot({
          name: values.name,
          start: values.start,
          end: values.end,
        })
      )
        .unwrap()
        .then(() =>
          dispatch(fetchAllSlots()).finally(() =>
            formik.resetForm()
          )
        )
        .then(() =>
          showNotification({
            id: 'Add-slot',
            color: 'teal',
            title: 'Slot was added',
            message: 'Slot was successfully added',
            icon: <Check/>,
            autoClose: 3000,
          })
        )
        .then((e) => props.toggleShown())
        .catch((e) => {
          showNotification({
            id: 'Add-slot',
            color: 'red',
            title: 'Error while add slot',
            message: `${e.message}`,
            icon: <X/>,
            autoClose: 3000,
          });
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      start: null,
      end: null,
    },
    onSubmit: (values) => handleAddSubmit(values),
    validationSchema: AddSlotValidation,
  });

  useEffect(() => {
    if (
      formik.initialValues.name === formik.values.name ||
      formik.initialValues.start === formik.values.start ||
      formik.initialValues.end === formik.values.end
    ) {
      setAddDisabled(true);
    } else {
      setAddDisabled(false);
    }
  }, [
    formik.values.name,
    formik.values.start,
    formik.values.end,
  ]);

  useEffect(() => {
    if (formik.values.start && formik.values.end) {
      if (formik.values.start > formik.values.end) {
        setSlotError(true);
        setAddDisabled(true);
      } else {
        setSlotError(false);
      }
    }
  }, [formik.values.start, formik.values.end]);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Add new slot</Text>;
  };

  const handleCancelAddModal = () => {
    props.toggleShown();
    formik.resetForm();
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle/>}
        size={'30%'}
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className={classes.modalBody}>
              <InputWrapper
                required
                label="Slot name"
                description="Slot name must be unique. Maximum length is 100 characters"
              >
                <TextInput
                  icon={<ClipboardText/>}
                  id="slot-name"
                  name="name"
                  error={formik.errors.name}
                  onChange={formik.handleChange}
                  className={classes.textInput}
                  radius="md"
                  value={formik.values.name}
                />
              </InputWrapper>

              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <InputWrapper required label="Time start">
                  <TimeInput
                    icon={<ClipboardText/>}
                    id="time-start"
                    name="timeStart"
                    error={formik.errors.start}
                    onChange={(e) => formik.setFieldValue('start', e)}
                    className={classes.textInput}
                    radius="md"
                    value={formik.values.start}
                  />
                </InputWrapper>
                <ChevronsRight
                  size={28}
                  strokeWidth={2}
                  color={'black'}
                  style={{marginRight: 20, position: 'relative', top: 30}}
                />
                <InputWrapper required label="Time end">
                  <TimeInput
                    icon={<ClipboardText/>}
                    id="timeEnd"
                    name="timeEnd"
                    error={formik.errors.end}
                    onChange={(e) => formik.setFieldValue('end', e)}
                    className={classes.textInput}
                    radius="md"
                    value={formik.values.end}
                  />
                </InputWrapper>
              </div>
              {slotError && (
                <div
                  style={{
                    position: 'relative',
                    top: '-.6rem',
                    fontSize: '.9rem',
                    color: 'red',
                  }}
                >
                  Time start can not be be later than Time end
                </div>
              )}
            </div>

            <div className={classes.modalFooter}>
              <Button
                onClick={() => handleCancelAddModal()}
                variant="outline"
                color={'red'}
                leftIcon={<X/>}
              >
                Cancel
              </Button>

              <Button
                color="green"
                disabled={isAddDisabled}
                onClick={() => formik.submitForm()}
                leftIcon={<Plus/>}
              >
                Add
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </Modal>
    </>
  );
};

const useStyles = createStyles({
  modalHeaderTitle: {
    fontWeight: 600,
    fontSize: 22,
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 10,
  },
  modalInputDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 20,
  },
});

export default AddSlotModal;
