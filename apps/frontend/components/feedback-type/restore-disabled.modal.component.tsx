import React, {useEffect, useState} from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Modal,
  Text,
  Button,
  InputWrapper,
  TextInput, Highlight,
} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import { Check, RotateClockwise, Search, X} from 'tabler-icons-react';
import {PaginationParams} from '../../models/pagination-params.model';
import dayjs from 'dayjs';
import {showNotification} from '@mantine/notifications';
import NoDataFound from "../no-data-found";
import {useDebouncedValue} from '@mantine/hooks';
import {fetchDisabledFeedbackTypes} from "../../redux/features/feedback-type/thunk/fetch-disabled-feedback-types";
import {
  restoreDisabledFeedbackTypeById
} from "../../redux/features/feedback-type/thunk/restore-disabled-feedback-type-by-id.thunk";
import {fetchFeedbackTypes} from '../../redux/features/feedback-type/thunk/fetch-feedback-types.thunk'


interface RestoreDisabledModalProps {
  isShown: boolean;

  toggleShown(): void;


  pagination: PaginationParams;
}

const RestoreDisabledModal: React.FC<RestoreDisabledModalProps> = (
  props
) => {
  const {classes, cx} = useStyles();
  const disabledFeedbackTypes = useAppSelector((state) => state.feedbackType.disabledFeedbackTypes);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searchDebounced] = useDebouncedValue<string>(search, 400);

  useEffect(() => {
    dispatch(fetchDisabledFeedbackTypes(search));
  }, [searchDebounced]);


  const handleRestoreDisabledFeedbackTypes = (id: string) => {
    dispatch(restoreDisabledFeedbackTypeById(id))
      .unwrap()
      .then(() => dispatch(fetchDisabledFeedbackTypes('')))
      .then(() => dispatch(fetchFeedbackTypes(props.pagination)))
      .catch((e) =>
        showNotification({
          id: 'restore-data',
          color: 'red',
          title: 'Error while restoring feedback type',
          message: e.message ?? 'Failed to restore feedback type',
          icon: <X/>,
          autoClose: 3000,
        })
      )
      .then(() =>
        showNotification({
          id: 'restore-data',
          color: 'teal',
          title: 'Feedback type was restored',
          message: 'Feedback type was successfully restored',
          icon: <Check/>,
          autoClose: 3000,
        })
      )
  };


  const rows = disabledFeedbackTypes?.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>
      <td>
        <Highlight highlight={search}>
          {row.name}
        </Highlight>

      </td>
      <td>{dayjs(row.deletedAt).format('HH:mm DD/MM/YYYY')}</td>
      <td>{row.deletedBy}</td>
      <td
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() => handleRestoreDisabledFeedbackTypes(row.id)}
          style={{
            margin: 5,
          }}
          variant="outline"
          color="green"
          leftIcon={<RotateClockwise/>}
        >
          Restore
        </Button>
      </td>
    </tr>
  ));

  const ModalHeaderTitle: React.FC = () => {
    return (
      <Text
        style={{
          fontWeight: '600',
          fontSize: 22,
        }}
      >
        Restore Disabled Feedback Type
      </Text>
    );
  };

  return (
    <div>
      <Modal
        opened={props.isShown}
        onClose={() => props.toggleShown()}
        centered
        size="70%"
        title={<ModalHeaderTitle/>}
        closeOnClickOutside={true}
        closeOnEscape={false}
      >
        <InputWrapper label="Search">
          <TextInput
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search/>}
          />
        </InputWrapper>
        {disabledFeedbackTypes?.length > 0 ? (
          <ScrollArea
            sx={{height: 500}}
            onScrollPositionChange={({y}) => setScrolled(y !== 0)}
          >
            <Table>
              <thead
                className={cx(classes.header, {[classes.scrolled]: scrolled})}
              >
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Disabled At</th>
                <th>Disabled By</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        ) : <NoDataFound/>}
      </Modal>

    </div>
  );
};

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export default RestoreDisabledModal;



