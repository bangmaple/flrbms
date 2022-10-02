import {ThProps} from "../../models/table/th-props.model";
import {ChevronDown, ChevronUp, Selector} from "tabler-icons-react";
import {Center, createStyles, Group, Text, UnstyledButton} from "@mantine/core";
import React from "react";

function Th(props?: ThProps) {
  const {style, children, reversed, sorted, onSort} = props;

  const {classes} = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th style={style} className={classes.th}>
      {onSort === null
        ? <Text weight={500} size="sm" className={classes.control}>
          {children}
          </Text>
        : <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            <Text weight={500} size="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon size={14}/>
            </Center>
          </Group>
        </UnstyledButton>}

    </th>
  );
}

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

export default Th;
