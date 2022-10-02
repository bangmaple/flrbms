import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  ScrollArea,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  ArrowBack,
  Check,
  ChevronsRight,
  ClipboardText,
  FileDescription,
  Pencil,
  Plus,
  X,
} from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { fetchHolidays } from '../../redux/features/holidays/thunk/fetch-holidays.thunk';
import dayjs from 'dayjs';
import { DatePicker } from '@mantine/dates';
import { addHoliday } from '../../redux/features/holidays/thunk/add-holiday';
import { fetchHolidaysMini } from '../../redux/features/holidays/thunk/fetch-holidays-mini.thunk';
import { fetchRequestsInDateRange } from '../../redux/features/room-booking/thunk/fetch-request-in-date-range';
import { fetchDeletedHolidays } from '../../redux/features/holidays/thunk/fetch-deleted-holidays.thunk';

interface AddModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
}

const AddHolidayValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Holiday name must be at least 2 characters')
    .max(100, 'Holiday name can only maximum at 100 characters')
    .required('Holiday name is required'),
  description: Yup.string().max(
    500,
    'Holiday description can only maximum at 500 characters'
  ),
});

const AddHolidayModal: React.FC<AddModalProps> = (props) => {
  const { classes } = useStyles();
  const [isUpdateDisabled, setUpdateDisabled] = useState<boolean>(false);
  const [isShowListRequest, setShowListRequest] = useState<boolean>(false);
  const [listRequest, setListRequest] = useState([]);
  const dispatch = useAppDispatch();
  const holidays = useAppSelector((state) => state.holiday.holidaysMini);
  const isHoliday = (date) => {
    const dateFormat = dayjs(date).format('YYYY-MM-DD');
    for (let i = 0; i < holidays.length; i++) {
      if (
        holidays[i].dateStart <= dateFormat &&
        holidays[i].dateEnd >= dateFormat
      ) {
        return true;
      }
    }
  };

  useEffect(() => {
    dispatch(fetchHolidaysMini()).unwrap();
  }, []);

  useEffect(() => {
    dispatch(fetchHolidays(props.pagination)).unwrap();
  }, []);

  const add = async (values) => {
    dispatch(
      addHoliday({
        ...values,
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while adding holiday',
          message: e.message ?? 'Failed to add holiday',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Holiday was added',
          message: 'Holiday was successfully added',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => props.toggleShown())
      .then(() => dispatch(fetchHolidays(props.pagination)))
      .then(() => dispatch(fetchDeletedHolidays("")))
      .finally(() => {
        formik.resetForm();
      });
  };

  const handleAddSubmit = async (values) => {
    if (!values.dateStart || !values.dateEnd) {
      showNotification({
        id: 'load-data',
        color: 'red',
        title: 'Miss some field',
        message: "Start date and End date can't be empty",
        icon: <X />,
        autoClose: 3000,
      });
    } else if (values.dateStart > values.dateEnd) {
      showNotification({
        id: 'load-data',
        color: 'red',
        title: 'Error while adding holiday',
        message: 'Date Start must be less than or equal to Date End',
        icon: <X />,
        autoClose: 3000,
      });
    } else {
      dispatch(
        fetchRequestsInDateRange({
          dateStart: values.dateStart,
          dateEnd: values.dateEnd,
        })
      )
        .unwrap()
        .then((respone) => {
          if (respone?.length > 0) {
            setListRequest(respone);
            setShowListRequest(true);
          } else {
            add(values);
          }
        })
        .catch((e) =>
          showNotification({
            id: 'load-data',
            color: 'red',
            title: 'Error while adding holiday',
            message: e.message ?? 'Failed to add holiday',
            icon: <X />,
            autoClose: 3000,
          })
        );
    }

    // .then(() => props.toggleShown())
    // .then(() => dispatch(fetchHolidays(props.pagination)))
    // .finally(() => {
    //   formik.resetForm();
    // });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      dateStart: null,
      dateEnd: null,
    },
    enableReinitialize: true,
    onSubmit: (values) => handleAddSubmit(values),
    validationSchema: AddHolidayValidation,
  });

  useEffect(() => {
    setShowListRequest(false);
  }, [formik.values.dateStart, formik.values.dateEnd]);

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalHeaderTitle}>Add new holiday </Text>;
  };

  const ListRequest = () => {
    const rows =
      listRequest && listRequest.length > 0
        ? listRequest.map((row) => (
            <tr key={row.id}>
              <td>{row.roomName}</td>
              <td>{dayjs(row.timeStart).format('DD-MM-YYYY')}</td>
              <td>{row.bookedFor}</td>
            </tr>
          ))
        : null;
    return listRequest && listRequest.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', width: 350 }}>
        <div style={{ marginBottom: 20, textAlign: 'justify' }}>
          <p>
            There has been a booking request for this date. If holidays are
            added, these requests will be cancelled. Are you sure you want to
            add these holidays?
          </p>
        </div>
        <ScrollArea sx={{ height: '100%' }}>
          <Table
            horizontalSpacing="xs"
            verticalSpacing="xs"
            sx={{ tableLayout: 'fixed' }}
            style={{ width: 350 }}
          >
            <thead>
              <tr>
                <th style={{ width: 100 }}>Room</th>
                <th style={{ width: 150 }}>Check in date</th>
                <th style={{ width: 100 }}>User</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>

        <div className={classes.modalFooter}>
          <Button
            color="red"
            disabled={isUpdateDisabled}
            onClick={() => {
              formik.setFieldValue('dateEnd', null);
              formik.setFieldValue('dateStart', null);
            }}
            leftIcon={<ArrowBack />}
          >
            Cancel
          </Button>
          <Button
            color="green"
            disabled={isUpdateDisabled}
            onClick={() => add(formik.values)}
            leftIcon={<Plus />}
          >
            Add
          </Button>
        </div>
      </div>
    ) : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 0px',
        }}
      >
        <h1>Don&apos;t have any check-in days coincide with these holidays </h1>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={<ModalHeaderTitle />}
        size="auto"
        centered
        opened={props.isShown}
        onClose={() => {
          formik.resetForm();
          props.toggleShown();
        }}
      >
        <div style={{ display: 'flex' }}>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit} style={{ maxWidth: '500px' }}>
              <div className={classes.modalBody}>
                <InputWrapper
                  required
                  label="Holiday name"
                  style={{ marginBottom: 20 }}
                  description="Holiday's name must be unique. Maximum length is 100 characters"
                >
                  <TextInput
                    icon={<ClipboardText />}
                    id="holiday-name"
                    name="name"
                    error={formik.errors.name}
                    onChange={formik.handleChange}
                    className={classes.textInput}
                    radius="md"
                    value={formik.values.name}
                  />
                </InputWrapper>

                <InputWrapper
                  label="Holiday Description"
                  style={{ marginBottom: 20 }}
                  description="(Optional) Maximum length is 500 characters."
                >
                  <Textarea
                    id="holiday-description"
                    name="description"
                    icon={<FileDescription />}
                    error={formik.errors.description}
                    onChange={formik.handleChange}
                    radius="md"
                    autosize
                    minRows={4}
                    maxRows={7}
                    value={formik.values.description}
                  />
                </InputWrapper>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <DatePicker
                    id="dateStart"
                    style={{ width: '250px' }}
                    label="Date starts"
                    placeholder="Select date"
                    radius="md"
                    required
                    inputFormat="DD-MM-YYYY"
                    // value={new Date(formik.values.dateStart)}
                    excludeDate={(date) => isHoliday(date)}
                    minDate={dayjs(new Date()).toDate()}
                    onChange={(date) => {
                      formik.setFieldValue('dateStart', date);
                    }}
                    value={formik.values.dateStart}
                  />
                  <ChevronsRight
                    size={28}
                    strokeWidth={2}
                    color={'black'}
                    style={{
                      margin: 'auto 40px',
                      position: 'relative',
                      top: 15,
                    }}
                  />
                  <DatePicker
                    id="dateEnd"
                    style={{ width: '250px' }}
                    label="Date ends"
                    placeholder="Select date"
                    radius="md"
                    required
                    inputFormat="DD-MM-YYYY"
                    excludeDate={(date) => isHoliday(date)}
                    // value={new Date(formik.values.dateEnd)}
                    minDate={dayjs(new Date()).toDate()}
                    onChange={(date) => {
                      formik.setFieldValue('dateEnd', date);
                    }}
                    value={formik.values.dateEnd}
                  />
                </div>
              </div>

              <div className={classes.modalFooter}>
                {isShowListRequest || (
                  <Button
                    color="green"
                    disabled={isUpdateDisabled}
                    onClick={() => formik.submitForm()}
                    leftIcon={<Pencil />}
                  >
                    Add
                  </Button>
                )}
              </div>
            </Form>
          </FormikProvider>
          {isShowListRequest && <ListRequest />}
        </div>
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
    justifyContent: 'flex-end',
    margin: 10,
    gap: 10,
  },
  modalInputDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    marginTop: 10,
  },
});

export default AddHolidayModal;
