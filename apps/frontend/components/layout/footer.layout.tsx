import React from 'react';
import { createStyles, Container, Group, Anchor } from '@mantine/core';
import Logo from '../logo';
import { FPT_ORANGE_COLOR, WHITE } from '@app/constants';

interface FooterSimpleProps {
  links: { link: string; label: string }[];
}

function LayoutFooter({ links }: FooterSimpleProps) {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<'a'>
      color="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="xs"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        {/*<Group className={classes.links}>{items}</Group>*/}
        <div style={{ color: WHITE, fontWeight: '500' }}>
          FPTU Library Room Booking Management System
        </div>
      </div>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  footer: {
    backgroundColor: FPT_ORANGE_COLOR,
  },

  inner: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 15,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export default LayoutFooter;
