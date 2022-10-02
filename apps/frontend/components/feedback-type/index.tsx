import React, {useEffect, useState} from 'react';
import {Button, createStyles} from '@mantine/core';
import AdminLayout from '../../components/layout/admin.layout';
import Header from '../../components/common/header.component';
import {
  Archive, ArchiveOff,
  BuildingWarehouse,
  Check, MessageCode,
  Plus,
  TrashOff,
  X,
} from 'tabler-icons-react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  defaultPaginationParams,
  PaginationParams,
} from '../../models/pagination-params.model';
import {useDebouncedValue} from '@mantine/hooks';
import TableHeader from '../../components/actions/table-header.component';
import {TableBody} from '../../components/actions/table-body.component';
import TableFooter from '../../components/actions/table-footer.component';
import * as Yup from 'yup';
import AddModal from '../../components/actions/modal/add-modal.component';
import {FormikValues, useFormik} from 'formik';
import {InputAddProps} from '../../components/actions/models/input-add-props.model';
import {InputTypes} from '../../components/actions/models/input-type.constant';
import InfoModal from '../../components/actions/modal/info-modal.component';
import UpdateModal from '../../components/actions/modal/update-modal.component';
import {InputUpdateProps} from '../../components/actions/models/input-update-props.model';
import RestoreDeletedModal from './restore-disabled.modal.component';
import DeleteModal from './disable-modal.component';
import {showNotification} from '@mantine/notifications';
import dayjs from 'dayjs';
import {fetchFeedbackTypes} from '../../redux/features/feedback-type/thunk/fetch-feedback-types.thunk'
import {fetchFeedbackTypeNames} from "../../redux/features/feedback-type/thunk/fetch-feedback-type-names.thunk";
import {updateFeedbackTypeById} from "../../redux/features/feedback-type/thunk/update-feedback-type-by-id.thunk";
import {fetchFeedbackTypeById} from "../../redux/features/feedback-type/thunk/fetch-feedback-type-by-id.thunk";
import {addFeedbackType} from "../../redux/features/feedback-type/thunk/add-feedback-type.thunk";
import NoDataFound from '../no-data-found';


const AddFeedbackTypeValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum feedback type name is 1 character')
    .max(100, 'Maximum feedback type name is 100 characters.')
    .required('Feedback type name is required'),
  description: Yup.string().max(
    500,
    'Maximum Feedback type description is 500 characters'
  ),
});

const UpdateFeedbackTypeValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Minimum feedback type name is 1 character')
    .max(100, 'Maximum feedback type name is 100 characters.')
    .required('Feedback type name is required'),
  description: Yup.string()
    .max(500, 'Maximum feedback type description is 500 characters')
    .nullable(),
});

const ManageFeedbackType: React.FC<any> = () => {
  const styles = useStyles();
  const feedbackTypes = useAppSelector((state) => state.feedbackType.feedbackTypes);
  const [pagination, setPagination] = useState<PaginationParams>(
    defaultPaginationParams
  );

  const [debounceSearchValue] = useDebouncedValue(pagination.search, 400);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFeedbackTypes(pagination));
  }, [
    pagination.page,
    pagination.limit,
    pagination.dir,
    pagination.sort,
    debounceSearchValue,
    pagination,
    dispatch,
  ]);

  const toggleSortDirection = () => {
    setPagination({
      ...pagination,
      dir: pagination.dir === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleSearchValue = (val: string) => {
    setPagination({
      ...defaultPaginationParams,
      search: val,
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

  const handleFetchById = (idVal) => {
    return dispatch(fetchFeedbackTypeById(idVal));
  };

  const [id, setId] = useState<string>('');
  const [isInfoShown, setInfoShown] = useState<boolean>(false);
  const [isAddShown, setAddShown] = useState<boolean>(false);
  const [isUpdateShown, setUpdateShown] = useState<boolean>(false);
  const [isDeleteShown, setDeleteShown] = useState<boolean>(false);
  const [isRestoreDeletedShown, setRestoreDeletedShown] =
    useState<boolean>(false);
  const [feedbackTypeNames, setFeedbackTypeNames] = useState([]);

  const feedbackType = useAppSelector((state) => state.feedbackType.feedbackType);
  console.log(JSON.stringify(feedbackType) + " ok nè")
  useEffect(() => {
    if (!isUpdateShown) {
      updateFormik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateShown]);

  useEffect(() => {
    dispatch(fetchFeedbackTypeNames())
      .unwrap()
      .then((feedbackTypes) => setFeedbackTypeNames(feedbackTypeNames));
  }, []);

  const ActionsFilter: React.FC = () => {
    return (
      <div>
        <Button
          leftIcon={<Plus/>}
          color="green"
          onClick={() => setAddShown(!isAddShown)}
          style={{marginRight: 10}}
        >
          Add
        </Button>

        <Button
          variant="outline"
          color="red"
          onClick={() => setRestoreDeletedShown(true)}
        >
          <ArchiveOff color={'red'}/>
        </Button>
      </div>
    );
  };

  const handleActionsCb = {
    info: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setInfoShown(!isInfoShown));
    },
    update: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setUpdateShown(!isUpdateShown));
    },
    delete: (id) => {
      setId(id);
      handleFetchById(id)
        .unwrap()
        .then(() => setDeleteShown(!isDeleteShown));
    },
  };

  const infoFields = [
    {
      label: 'Name',
      id: 'name',
      name: 'name',
      value: feedbackType.name,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      id: 'description',
      name: 'description',
      value: feedbackType.description,
      readOnly: true,
      inputtype: InputTypes.TextArea,
    },
    {
      label: 'Created at',
      id: 'createdAt',
      name: 'createdAt',
      value: dayjs(feedbackType.createdAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Created By',
      id: 'createdBy',
      name: 'createdBy',
      value: feedbackType.createdBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated At',
      id: 'updatedAt',
      name: 'updatedAt',
      value: dayjs(feedbackType.updatedAt).format('HH:mm DD/MM/YYYY'),
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Updated By',
      id: 'updatedBy',
      name: 'updatedBy',
      value: feedbackType.updatedBy,
      readOnly: true,
      inputtype: InputTypes.TextInput,
    },
  ];

  const addFields: InputAddProps[] = [
    {
      label: 'Name',
      description:
        'Feedback type name must be unique between others (Max 100 char.)',
      id: 'name',
      name: 'name',
      required: true,
      inputtype: InputTypes.TextInput,
    },
    {
      label: 'Description',
      description:
        'Feedback type description describe additional information (Max 500 char.)',
      id: 'description',
      name: 'description',
      required: false,
      inputtype: InputTypes.TextArea,
    },
  ];

  const updateFields: InputUpdateProps[] = [
    {
      id: 'id',
      name: 'id',
      inputtype: InputTypes.TextInput,
      label: 'Id',
      readOnly: true,
      required: false,
      value: feedbackType.id,
      disabled: true,
    },
    {
      id: 'name',
      name: 'name',
      inputtype: InputTypes.TextInput,
      label: 'Feedback type name',
      readOnly: false,
      required: true,
      value: feedbackType.name,
      disabled: false,
    },
    {
      id: 'description',
      name: 'description',
      inputtype: InputTypes.TextArea,
      label: 'Description',
      readOnly: false,
      required: false,
      disabled: false,
      value: feedbackType.description,
    },
  ];
  const handleAddModalClose = () => {
    setAddShown(!isAddShown);
    addFormik.resetForm();
  };
  const handleAddSubmit = (values: FormikValues) => {
    dispatch(
      addFeedbackType({
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'Add-feedback-type',
          color: 'teal',
          title: 'Feedback type was added',
          message: 'Feedback type was successfully added',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then((e) => handleAddModalClose())
      .catch((e) => {
        showNotification({
          id: 'Add-feedback-type',
          color: 'red',
          title: 'Error while adding feedback type',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
  };

  const handleUpdateSubmit = (values: FormikValues) => {
    dispatch(
      updateFeedbackTypeById({
        id: values.id,
        name: values.name,
        description: values.description,
      })
    )
      .unwrap()
      .then(() =>
        showNotification({
          id: 'Update-feedback-type',
          color: 'teal',
          title: 'Feedback type was updated',
          message: 'Feedback type was successfully updated',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
      .then((e) => handleUpdateModalClose())
      .catch((e) => {
        showNotification({
          id: 'Update-feedback-type',
          color: 'red',
          title: 'Error while updating feedback type',
          message: `${e.message}`,
          icon: <X/>,
          autoClose: 3000,
        });
      });
  };

  const updateFormik = useFormik({
    validationSchema: UpdateFeedbackTypeValidation,
    initialValues: {
      id: feedbackType.id,
      name: feedbackType.name,
      description: feedbackType.description,
    },
    enableReinitialize: true,
    onSubmit: (e) => handleUpdateSubmit(e),
  });

  const handleUpdateModalClose = () => {
    setUpdateShown(!isUpdateShown);
    updateFormik.resetForm();
  };

  const addFormik = useFormik({
    validationSchema: AddFeedbackTypeValidation,
    initialValues: {
      name: '',
      description: '',
    },
    enableReinitialize: true,
    onSubmit: (e) => handleAddSubmit(e),
  });

  return (
    <AdminLayout>
      <Header title="Feedback Types Management" icon={<MessageCode size={50}/>}/>
      <TableHeader
        handleResetFilter={() => handleResetFilter()}
        actions={<ActionsFilter/>}
        actionsLeft={null}
        setSearch={(val) => handleSearchValue(val)}
        search={pagination.search}
      />

      <RestoreDeletedModal
        isShown={isRestoreDeletedShown}
        toggleShown={() => setRestoreDeletedShown(!isRestoreDeletedShown)}
        pagination={pagination}
      />
      {feedbackTypes.items ? (

        <>
          <TableBody
            actionButtonCb={handleActionsCb}
            toggleSortDirection={() => toggleSortDirection()}
            data={feedbackTypes.items}
            page={pagination.page}
            itemsPerPage={pagination.limit}
            search={pagination.search}
          />
          <InfoModal

            header="Feedback Type Information"
            fields={infoFields}
            toggleShown={() => setInfoShown(!isInfoShown)}
            // toggleDisableModalShown={() => setDisableShown(!isDisableShown)}
            isShown={isInfoShown}
            itemsOfDataButton={null}
            isShowListItems={null}
            itemsOfData={null}
            title={null}
          />

          <UpdateModal
            fields={updateFields}
            formik={updateFormik}
            handleSubmit={() => updateFormik.handleSubmit()}
            header="Update current feedback type"
            isShown={isUpdateShown}
            toggleShown={() => setUpdateShown(!isUpdateShown)}
          />
          <DeleteModal
            isShown={isDeleteShown}
            toggleShown={() => setDeleteShown(!isDeleteShown)}
            pagination={pagination}
            feedbackTypes={feedbackTypeNames}
          />
        </>
      ) : <NoDataFound/>}
      <AddModal
        header="Add new feedback type"
        isShown={isAddShown}
        toggleShown={() => handleAddModalClose()}
        formik={addFormik}
        fields={addFields}
        handleSubmit={() => addFormik.handleSubmit()}
      />
      {feedbackTypes.meta ? (
        <TableFooter
          handlePageChange={(val) => handlePageChange(val)}
          handleLimitChange={(val) => handleLimitChange(val)}
          metadata={feedbackTypes.meta}
        />
      ) : null}
    </AdminLayout>
  );
};

const useStyles = createStyles((theme) => {
  return {
    container: {},
  };
});

export default ManageFeedbackType;
