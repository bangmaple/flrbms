import React, { useEffect, useState } from 'react';
import {
  Button,
  createStyles,
  Divider,
  Modal,
  ScrollArea,
  Table,
  Text,
  // FileButton,
} from '@mantine/core';
import { Check, Upload, X } from 'tabler-icons-react';
import { importHoliday } from '../../redux/features/holidays/thunk/import-holiday';
import { useAppDispatch } from '../../redux/hooks';
import readXlsxFile from 'read-excel-file';
import { showNotification } from '@mantine/notifications';
import { fetchHolidays } from '../../redux/features/holidays/thunk/fetch-holidays.thunk';
import { PagingParams } from '../../models/pagination-params/paging-params.model';
import dayjs from 'dayjs';

interface UploadModalProps {
  isShown: boolean;
  toggleShown(): void;
  pagination: PagingParams;
}

const UploadModal: React.FC<UploadModalProps> = (props) => {
  const { classes, cx } = useStyles();
  const [tableData, setTableData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [isDisableButton, setDisableButton] = useState(true)

  useEffect(() => {
    if (tableData.length > 0) {
      if (
        tableData[0][0] !== 'holiday_name' ||
        tableData[0][1] !== 'date_start' ||
        tableData[0][2] !== 'date_end' ||
        tableData[0][3] !== 'description'
      ) {
        setDisableButton(true)
        showNotification({
          id: 'load-data',
          color: 'red',
          title: 'The excel file is not in the correct format',
          message: 'Please try another file',
          icon: <X />,
          autoClose: 3000,
        })
      } else {
        setDisableButton(false)
      }
    } else {
      setDisableButton(true)
    }
  }, [tableData]);

  const importexcel = (e) => {
    const file = e.target.files[0];
    readXlsxFile(file).then((rows) => {
      setTableData(rows);
    });
  };

  const dispatch = useAppDispatch();

  const handleAddSubmit = async (values) => {
    dispatch(importHoliday(tableData))
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
      .then(() => dispatch(fetchHolidays(props.pagination)));
  };

  const rowsTable = tableData?.map((row, index) => {
    if (index > 0) {
      return (
        <tr key={index} style={{ height: 60 }}>
          <td>{index}</td>
          <td>{row[0]}</td>
          <td>{dayjs(row[1]).format('YYYY-MM-DD')}</td>
          <td>{dayjs(row[2]).format('YYYY-MM-DD')}</td>
          <td>{row[3]}</td>
        </tr>
      );
    }
  });

  const ModalHeaderTitle: React.FC = () => {
    return <Text className={classes.modalTitleText}>Import file Excel</Text>;
  };

  return (
    <Modal
      centered
      title={<ModalHeaderTitle />}
      closeOnClickOutside={true}
      opened={props.isShown}
      onClose={() => props.toggleShown()}
      size={tableData.length > 0 ? 600 : null}
    >
      <div className={classes.buttonContainer}>
        {/* <FileButton onChange={setFile} accept="xlsx,xlsm" leftIcon={<Upload />}>
          {(props) => <Button {...props}>Upload image</Button>}
        </FileButton>
        {file && (
          <Text size="sm" align="center" mt="sm">
            Picked file: {file.name}
          </Text>
        )} */}
        {/* <Button color="orange" className={classes.button} leftIcon={<Upload />}>
          Import multi excel files
        </Button> */}
        <input required type="file" onChange={importexcel} />
        <Button
          color="green"
          className={classes.button}
          leftIcon={<Upload />}
          onClick={handleAddSubmit}
          disabled={isDisableButton}
        >
          Upload
        </Button>

        {tableData.length > 0 && (
          <>
            <ScrollArea
              sx={{ maxHeight: 500 }}
              onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
            >
              <Table sx={{ minWidth: 500 }}>
                <thead
                  className={cx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
                >
                  <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Date start</th>
                    <th>Date end</th>
                  </tr>
                </thead>
                <tbody>{rowsTable}</tbody>
              </Table>
            </ScrollArea>
          </>
        )}
      </div>
      <Divider className={classes.divider} />
    </Modal>
  );
};

const useStyles = createStyles((theme) => ({
  modalTitleText: {
    fontWeight: 600,
    fontSize: 22,
  },
  buttonContainer: {
    margin: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: 600,
  },
  button: {
    marginTop: 10,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  switch: {
    margin: 5,
  },
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

export default UploadModal;
