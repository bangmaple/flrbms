import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  InputWrapper,
  Modal,
  ScrollArea,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  ArrowBack,
  Calendar,
  Check,
  ChevronsRight,
  ClipboardText,
  FileDescription,
  Id,
  Pencil,
  X,
} from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import { fetchHolidays } from '../../redux/features/holidays/thunk/fetch-holidays.thunk';
import { updateHolidayById } from '../../redux/features/holidays/thunk/update-holiday-by-id.thunk';
import dayjs from 'dayjs';
import { DatePicker } from '@mantine/dates';
import { fetchHolidaysMini } from '../../redux/features/holidays/thunk/fetch-holidays-mini.thunk';
import { fetchRequestsInDateRange } from '../../redux/features/room-booking/thunk/fetch-request-in-date-range';

interface UpdateModalProps {
  isShown: boolean;

  toggleShown(): void;

  pagination: PagingParams;
}

const UpdateHolidayValidation = Yup.object().shape({
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

const HolidayUpdateModal: React.FC<UpdateModalProps> = (props) => {
  const { classes } = useStyles();
  const holiday = useAppSelector((state) => state.holiday.holiday);
  const [isUpdateDisabled, setUpdateDisabled] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isShowListRequest, setShowListRequest] = useState<boolean>(false);
  const [listRequest, setListRequest] = useState([]);
  const holidays = useAppSelector((state) => state.holiday.holidaysMini);

  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  useEffect(() => {
    if (holiday) {
      setDateStart(new Date(holiday.dateStart));
      setDateEnd(new Date(holiday.dateEnd));
    }
  }, [holiday]);

  const isHoliday = (date) => {
    const dateFormat = dayjs(date).format('YYYY-MM-DD');
    for (let i = 0; i < holidays.length; i++) {
      if (
        holidays[i].dateStart <= dateFormat &&
        holidays[i].dateEnd >= dateFormat &&
        !(dayjs(holiday.dateStart).format('YYYY-MM-DD') <= dateFormat &&
        dayjs(holiday.dateEnd).format('YYYY-MM-DD') >= dateFormat)
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
            update these holidays?
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
              formik.setFieldValue('dateEnd', dateEnd);
              formik.setFieldValue('dateStart', holiday.dateStart);
            }}
            leftIcon={<ArrowBack />}
          >
            Cancel
          </Button>
          <Button
            color="green"
            disabled={isUpdateDisabled}
            onClick={() => update(formik.values)}
            leftIcon={<Pencil />}
          >
            Update
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

  const handleUpdateSubmit = async (values) => {
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
          update(values);
        }
      })
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while updating holiday',
          message: e.message ?? 'Failed to update holiday',
          icon: <X />,
          autoClose: 3000,
        })
      );

    // .then(() => props.toggleShown())
    // .then(() => dispatch(fetchHolidays(props.pagination)))
    // .finally(() => {
    //   formik.resetForm();
    // });
  };

  const update = async (values) => {
    dispatch(
      updateHolidayById({
        id: values.id,
        name: values.name,
        description: values.description,
        dateStart: values.dateStart,
        dateEnd: values.dateEnd,
      })
    )
      .unwrap()
      .catch((e) =>
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'Error while updating holiday',
          message: e.message ?? 'Failed to update holiday',
          icon: <X />,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'load-data',
          color: 'teal',
          title: 'Holiday was updated',
          message: 'Holiday was successfully updated',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then(() => props.toggleShown())
      .then(() => dispatch(fetchHolidays(props.pagination)))
      .finally(() => {
        formik.resetForm();
      });
  };

  const formik = useFormik({
    initialValues: {
      id: holiday.id,
      name: holiday.name,
      description: holiday.description,
      dateStart: dateStart,
      dateEnd: dateEnd,
    },
    enableReinitialize: true,
    onSubmit: (values) => handleUpdateSubmit(values),
    validationSchema: UpdateHolidayValidation,
  });

  useEffect(() => {
    setShowListRequest(false);
  }, [formik.values.dateStart, formik.values.dateEnd]);

  useEffect(() => {
    if (
      formik.initialValues.name === formik.values.name &&
      formik.initialValues.description === formik.values.description &&
      formik.initialValues.dateStart === formik.values.dateStart &&
      formik.initialValues.dateEnd === formik.values.dateEnd
    ) {
      setUpdateDisabled(true);
    } else {
      if (formik.values.dateStart > formik.values.dateEnd) {
        setUpdateDisabled(true);
      } else {
        setUpdateDisabled(false);
      }
    }
  }, [
    formik.values.name,
    formik.values.description,
    formik.initialValues.name,
    formik.initialValues.description,
    formik.initialValues.dateStart,
    formik.initialValues.dateEnd,
    formik.values.dateStart,
    formik.values.dateEnd,
  ]);

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text className={classes.modalHeaderTitle}>
        Update Holiday Information
      </Text>
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
                    minDate={dayjs(new Date()).toDate()}
                    excludeDate={(date) => isHoliday(date)}
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
                    excludeDate={(date) => isHoliday(date)}
                    inputFormat="DD-MM-YYYY"
                    value={formik.values.dateEnd}
                    minDate={dayjs(new Date()).toDate()}
                    onChange={(date) => {
                      formik.setFieldValue('dateEnd', date);
                    }}
                  />
                </div>
              </div>

              <div className={classes.modalFooter}>
                {isShowListRequest || (
                  <Button
                    color="cyan"
                    disabled={isUpdateDisabled}
                    onClick={() => formik.submitForm()}
                    leftIcon={<Pencil />}
                  >
                    Update
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
    gap: 5,
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

export default HolidayUpdateModal;
