import React, { useState } from 'react';
import { Button, createStyles, InputWrapper, TextInput } from '@mantine/core';
import { RotateClockwise, Search } from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import Filter from './drawer/filter.drawer';

interface TableHeaderProps {
  handleResetFilter(): void;
  actionsLeft: React.ReactNode;
  actions: React.ReactNode;
  setSearch(val: string): void;
  search: string;
}

const TableHeader: React.FC<TableHeaderProps> = (props) => {
  const [isFilterShown, setFilterShown] = useState<boolean>(false);
  const { classes } = useStyles();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    props.setSearch(value);
  };

  return (
    <div className={classes.container}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div className={classes.leftNav}>
          <div className={classes.leftNav}>
            <InputWrapper label="Search">
              <TextInput
                placeholder="Search by name..."
                mb="md"
                icon={<Search size={14} />}
                value={props.search}
                onChange={handleSearchChange}
              />
            </InputWrapper>

            <div className={classes.actions}>
              <Button
                onClick={() => props.handleResetFilter()}
                color="orange"
                variant="outline"
                style={{ marginRight: 10 }}
              >
                <RotateClockwise color={FPT_ORANGE_COLOR} />
              </Button>
            </div>
          </div>
        </div>
        <div className={classes.actions}>{props.actionsLeft}</div>
      </div>
      <div className={classes.actionRightDiv}>{props.actions}</div>
      <Filter
        isShown={isFilterShown}
        toggleShown={() => setFilterShown(!isFilterShown)}
      />
    </div>
  );
};

const useStyles = createStyles(() => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 10,
      marginLeft: 10,
    },
    leftNav: {
      display: 'flex',
    },
    actionRightDiv: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

export default TableHeader;
