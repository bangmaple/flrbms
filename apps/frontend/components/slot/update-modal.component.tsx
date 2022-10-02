import React, { useEffect, useState } from 'react';
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
  Pencil,
  Plus,
  X,
} from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Form, FormikProvider, FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { addSlot } from '../../redux/features/slot/thunk/add.thunk';
import { fetchAllSlots } from '../../redux/features/slot';
import { TimeInput } from '@mantine/dates';
import { updateSlot } from '../../redux/features/slot/thunk/update-slot.thunk';

interface UpdateModalProps {
  isShown: boolean;
  keySlot: string;
  toggleShown(): void;
}

const UpdateSlotValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Name must have at least 1 character.')
    .max(100, 'Name can only have at most 100 characters.')
    .required('Name is required!'),
});

const SlotUpdateModal: React.FC<UpdateModalProps> = (props) => {
  const { classes } = useStyles();
  const [isUpdateDisabled, setUpdateDisabled] = useState<boolean>(false);
  const [slotError, setSlotError] = useState<boolean>(false);
  const slotConfig = useAppSelector((state) => state.slot.slotConfig);
  const timeStartArray = slotConfig?.start?.split(':');
  const timeEndArray = slotConfig?.end?.split(':');
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);

  useEffect(() => {
    if (timeStartArray) {
      setTimeStart(
        new Date(
          new Date().setHours(
            Number(timeStartArray[0]),
            Number(timeStartArray[1]),
            Number(timeStartArray[2])
          )
        )
      );
    }
    if (timeEndArray) {
      setTimeEnd(
        new Date(
          new Date().setHours(
            Number(timeEndArray[0]),
            Number(timeEndArray[1]),
            Number(timeEndArray[2])
          )
        )
      );
    }
  }, [slotConfig]);

  const dispatch = useAppDispatch();

  const handleUpdateSubmit = (values: FormikValues) => {
    if (!values.start || !values.end) {
      showNotification({
        id: 'Update-slot',
        color: 'red',
        title: 'Error while updating slot',
        message: `Time start and Time end can be null`,
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      dispatch(
        updateSlot({
          id: props.keySlot,
          name: values.name,
          start: values.start,
          end: values.end,
        })
      )
        .unwrap()
        .then(() => dispatch(fetchAllSlots()).finally(() => formik.resetForm()))
        .then(() =>
          showNotification({
            id: 'Update-slot',
            color: 'teal',
            title: 'Slot was updated',
            message: 'Slot was successfully updated',
            icon: <Check />,
            autoClose: 3000,
          })
        )
        .then((e) => props.toggleShown())
        .catch((e) => {
          showNotification({
            id: 'Update-slot',
            color: 'red',
            title: 'Error while updating slot',
            message: `${e.message}`,
            icon: <X />,
            autoClose: 3000,
          });
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: slotConfig.name,
      start: timeStart,
      end: timeEnd,
    },
    enableReinitialize: true,
    onSubmit: (values) => handleUpdateSubmit(values),
    validationSchema: UpdateSlotValidation,
  });

  useEffect(() => {
    if (
      formik.initialValues.name === formik.values.name &&
      formik.initialValues.start === formik.values.start &&
      formik.initialValues.end === formik.values.end
    ) {
      setUpdateDisabled(true);
    } else {
      setUpdateDisabled(false);
    }
  }, [formik.values.name, formik.values.start, formik.values.end]);

  useEffect(() => {
    if (formik.values.start && formik.values.end) {
      if (formik.values.start > formik.values.end) {
        setSlotError(true);
        setUpdateDisabled(true);
      } else {
        setSlotError(false);
      }
    }
  }, [formik.values.start, formik.values.end]);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Update slot</Text>;
  };

  const handleCancelAddModal = () => {
    props.toggleShown();
    formik.resetForm();
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size={'30%'}
        centered
        opened={props.isShown}
        onClose={() => props.toggleShown()}
      >
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className={classes.modalBody}>
              <InputWrapper required label="Slot name">
                <TextInput
                  icon={<ClipboardText />}
                  id="slot-name"
                  name="name"
                  error={formik.errors.name}
                  onChange={formik.handleChange}
                  className={classes.textInput}
                  radius="md"
                  value={formik.values.name}
                />
              </InputWrapper>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <InputWrapper required label="Time starts">
                  <TimeInput
                    icon={<ClipboardText />}
                    id="timeStart"
                    name="timeStart"
                    error={formik.errors.start}
                    onChange={(time) => formik.setFieldValue('start', time)}
                    className={classes.textInput}
                    radius="md"
                    value={formik.values.start}
                  />
                </InputWrapper>
                <ChevronsRight
                  size={28}
                  strokeWidth={2}
                  color={'black'}
                  style={{ marginRight: 20, position: 'relative', top: 30 }}
                />
                <InputWrapper required label="Time ends">
                  <TimeInput
                    icon={<ClipboardText />}
                    id="timeEnd"
                    name="timeEnd"
                    error={formik.errors.end}
                    onChange={(time) => formik.setFieldValue('end', time)}
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
                leftIcon={<X />}
              >
                Cancel
              </Button>

              <Button
                color="cyan"
                disabled={isUpdateDisabled}
                onClick={() => formik.submitForm()}
                leftIcon={<Pencil />}
              >
                Update
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

export default SlotUpdateModal;
