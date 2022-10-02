import React, { useEffect, useMemo, useState } from 'react';
import { Button, createStyles } from '@mantine/core';
import Header from '../common/header.component';
import {BrandHipchat, Check, Download, MessageShare, Plus, X} from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useDebouncedValue } from '@mantine/hooks';
import TableHeader from '../actions/table-header.component';
import { TableBody } from './table-body.component';
import TableFooter from '../actions/table-footer.component';
import InfoModal from './info-modal.component';
import * as Yup from 'yup';
import { FormikValues, useFormik } from 'formik';
import AdminLayout from '../layout/admin.layout';
import { showNotification } from '@mantine/notifications';
import NoDataFound from '../no-data-found';
import { fetchFeedbacks } from '../../redux/features/feedback/thunk/fetch-feedback';
import { fetchFeedbackById } from '../../redux/features/feedback/thunk/fetch-feedback-by-id.thunk';
import RejectFeedbackModal from './reject-feedback.component';
import ResolveFeedbackModal from './resolve-feedback.component';
import { FeedbackPaginationParams } from '../../models/pagination-params/feedback-paging-params.model';
import { sendFeedback } from '../../redux/features/feedback/thunk/send-feedback.thunk';
import { fetchFeedbackTypeNames } from '../../redux/features/feedback-type/thunk/fetch-feedback-type-names.thunk';
import AddFeedbackModal from './add-modal.component';
import { fetchCountRequestFeedbacks } from '../../redux/features/feedback/thunk/fetch-count-feedbacks';
import { io } from 'socket.io-client';
import { UserInfoModel } from '../../models/user/user-info.model';

const SendFeedbackValidation = Yup.object().shape({
  feedback: Yup.string()
    .max(500, 'Maximum room type description is 500 characters')
    .required('Feedback is required'),
});

const defaultPaginationParams = {
  page: 1,
  limit: 5,
  search: '',
  dir: 'DESC',
  sort: 'created_at',
  status: '',
};

const ManageFeedback: React.FC<any> = () => {
  const { classes } = useStyles();
  const socket = useMemo(() => {
    return io('ws://localhost:5000/feedback');
  }, []);
  const [isRejectShown, setRejectShown] = useState<boolean>(false);
  const [isResolveShown, setResolveShown] = useState<boolean>(false);
  const [feedbackTypeNames, setFeedbackTypeNames] = useState<any[]>(null);
  const feedbacks = useAppSelector((state) => state.feedback.feedbacks);
  const [pagination, setPagination] = useState<FeedbackPaginationParams>(
    defaultPaginationParams
  );
  const [count, setCount] = useState<{ count: number }[]>([]);

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  useEffect(() => {
    socket.on('sendFeedback', (createdBy) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        createdBy &&
        createdBy !== _userInfor.id &&
        _userInfor.role !== 'Staff'
      ) {
        dispatch(fetchFeedbacks(pagination));
        dispatch(fetchCountRequestFeedbacks()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('resolveFeedback', (createdBy) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        createdBy &&
        (createdBy === _userInfor.id || _userInfor.role !== 'Staff')
      ) {
        dispatch(fetchFeedbacks(pagination));
        dispatch(fetchCountRequestFeedbacks()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('rejectFeedback', (createdBy) => {
      const _userInfor = JSON.parse(window.localStorage.getItem('user'));

      if (
        createdBy &&
        (createdBy === _userInfor.id || _userInfor.role !== 'Staff')
      ) {
        dispatch(fetchFeedbacks(pagination));
        dispatch(fetchCountRequestFeedbacks()).unwrap().then(setCount);
      }
    });
  }, [socket]);

  useEffect(() => {
    dispatch(fetchCountRequestFeedbacks()).unwrap().then(setCount);
  }, []);
  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFeedbacks(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.dir,
    pagination.sort,
    pagination.status,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(fetchFeedbackTypeNames())
      .unwrap()
      .then((feedbackTypes) => setFeedbackTypeNames(feedbackTypes));
  }, []);

  const toggleSortDirection = () => {
    setPagination({
      ...pagination,
      dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleSearchValue = (val: string) => {
    setPagination({
      ...pagination,
      search: val,
    });
  };

  const handleChangeStatus = (val: string) => {
    setPagination({
      ...pagination,
      status: `["${val}"]`,
    });
  };

  const handleLimitChange = (val: number) => {
    setPagination({
      ...pagination,
      limit: val,
    });
  };

  const handlePageChange = (val: number) => {
    setPagination({
      ...pagination,
      page: val,
    });
  };

  const handleResetFilter = () => {
    setPagination(defaultPaginationParams);
  };

  const [id, setId] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);

  const handleFetchById = (idVal) => {
    return dispatch(fetchFeedbackById(idVal));
  };

  const ActionsFilterLeft: React.FC = () => {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <Button
            variant="outline"
            color="blue"
            onClick={() => handleChangeStatus('PENDING')}
            style={{ marginRight: 10 }}
            size="xs"
          >
            Pending
            {count && count[0]?.count > 0 ? (
              <div
                className={classes.badge}
                style={{ backgroundColor: '#228be6' }}
              >
                {count[0].count}
              </div>
            ) : null}
          </Button>
          <Button
            variant="outline"
            color="green"
            onClick={() => handleChangeStatus('RESOLVED')}
            style={{ marginRight: 10 }}
            size="xs"
          >
            Resolved
            {count && count[1]?.count > 0 ? (
              <div
                className={classes.badge}
                style={{ backgroundColor: '#40c057' }}
              >
                {count[1].count}
              </div>
            ) : null}
          </Button>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleChangeStatus('REJECTED')}
            style={{ marginRight: 10 }}
            size="xs"
          >
            Rejected
            {count && count[2]?.count > 0 ? (
              <div
                className={classes.badge}
                style={{ backgroundColor: '#fa5252' }}
              >
                {count[2].count}
              </div>
            ) : null}
          </Button>
        </div>
      </>
    );
  };

  const ActionsFilter: React.FC = () => {
    if (userInfo.role !== 'System Admin') {
      return (
        <div>
          <Button
            leftIcon={<Plus />}
            color="green"
            onClick={() => setAddShown(!isAddShown)}
            style={{ marginRight: 10 }}
          >
            Add
          </Button>
        </div>
      );
    } else {
      return null;
    }
  };

  const handleActionsCb = {
    info: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
    delete: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setDeleteShown(!isDeleteShown));
    },
  };

  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
    addFormik.resetForm();
  };
  const handleAddSubmit = (values: FormikValues) => {
    dispatch(
      sendFeedback({
        feedback: values.feedback,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'Add-feedback',
          color: 'teal',
          title: 'Feedback was sent',
          message: 'Feedback was successfully sent',
          icon: <Check />,
          autoClose: 3000,
        })
      )
      .then((e) => handleAddModalClose())
      .catch((e) => {
        showNotification({
          id: 'Add-feedback',
          color: 'red',
          title: 'Error while sending feedback',
          message: `${e.message}`,
          icon: <X />,
          autoClose: 3000,
        });
      });
  };

  const addFormik = useFormik({
    validationSchema: SendFeedbackValidation,
    initialValues: {
      feedback: '',
      type: '',
    },
    enableReinitialize: true,
    onSubmit: (e) => handleAddSubmit(e),
  });

  return (
    <AdminLayout>
      <Header title="Feedbacks Management" icon={<MessageShare size={50} />} />
      <TableHeader
        handleResetFilter={() => handleResetFilter()}
        actionsLeft={<ActionsFilterLeft />}
        actions={<ActionsFilter />}
        setSearch={(val) => handleSearchValue(val)}
        search={pagination.search}
      />
      {feedbacks.items ? (
        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={() => toggleSortDirection()}
            data={feedbacks.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <InfoModal
            header="Feedback Information"
            toggleShown={() => setInfoShown(!isInfoShown)}
            isShown={isInfoShown}
            toggleRejectModalShown={() => setRejectShown(!isRejectShown)}
            toggleResolveModalShown={() => setResolveShown(!isResolveShown)}
          />

          <RejectFeedbackModal
            isShown={isRejectShown}
            toggleShown={() => setRejectShown(!isRejectShown)}
            toggleInforModalShown={() => setInfoShown(!isInfoShown)}
            setCount={(val) => setCount(val)}
            pagination={pagination}
          />

          <ResolveFeedbackModal
            isShown={isResolveShown}
            toggleShown={() => setResolveShown(!isResolveShown)}
            toggleInforModalShown={() => setInfoShown(!isInfoShown)}
            setCount={(val) => setCount(val)}
            pagination={pagination}
          />
        </>
      ) : (
        <NoDataFound />
      )}
      <AddFeedbackModal
        isShown={isAddShown}
        pagination={pagination}
        toggleShown={() => handleAddModalClose()}
        feedbackTypes={feedbackTypeNames}
        setCount={(val) => setCount(val)}
      />
      {feedbacks.meta ? (
        <TableFooter
          handlePageChange={(val) => handlePageChange(val)}
          handleLimitChange={(val) => handleLimitChange(val)}
          metadata={feedbacks.meta}
        />
      ) : null}
    </AdminLayout>
  );
};

const useStyles = createStyles((theme) => {
  return {
    container: {},
    badge: {
      borderRadius: 50,
      marginLeft: 10,
      height: 20,
      width: 25,
      color: 'white',
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
    },
  };
});

export default ManageFeedback;
