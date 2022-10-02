import React, { useEffect, useState } from 'react';
import { createStyles, Navbar, Group, Code, Image, Text } from '@mantine/core';
import {
  BuildingWarehouse,
  Users,
  Devices,
  Dashboard,
  Bell,
  Ticket,
  Door,
  DeviceTablet,
  BarrierBlock,
  BrandHipchat,
  MessageShare,
  MessageCode,
  Clock2, Calendar, Bookmark, Message, UserCircle,
} from 'tabler-icons-react';
import { FPT_ORANGE_COLOR } from '@app/constants';
import { BLACK, WHITE } from '@app/constants';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../../redux/hooks';
import { UserInfoModel } from '../../models/user/user-info.model';

interface SideBarProps {
  opened: boolean;
}

const LayoutSidebar: React.FC<SideBarProps> = (props) => {
  const { classes, cx } = useStyles();

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const isAdmin = userInfo?.role === 'System Admin';
  const isLibrarian = userInfo?.role === 'Librarian';
  const isStaff = userInfo?.role === 'Staff';

  const data = [
    {
      link: '/dashboard',
      label: 'Dashboard',
      icon: Dashboard,
      isRender: isAdmin || isLibrarian,
    },
    {
      link: '/rooms',
      label: 'Rooms',
      icon: BuildingWarehouse,
      isRender: isAdmin || isLibrarian || isStaff,
    },
    {
      link: '/room-type',
      label: 'Room Type',
      icon: Door,
      isRender: isAdmin || isLibrarian,
    },
    {
      link: '/devices',
      label: 'Devices',
      icon: Devices,
      isRender: isAdmin || isLibrarian,
    },
    {
      link: '/device-type',
      label: 'Device Type',
      icon: DeviceTablet,
      isRender: isAdmin || isLibrarian,
    },
    { link: '/accounts', label: 'Accounts', icon: Users, isRender: isAdmin },
    { link: '/role', label: 'Roles', icon: UserCircle, isRender: isAdmin },
    {
      link: '/feedbacks',
      label: 'Feedbacks',
      icon: MessageShare,
      isRender: isAdmin || isLibrarian || isStaff,
    },
    {
      link: '/feedback-type',
      label: 'Feedback Type',
      icon: MessageCode,
      isRender: isAdmin || isLibrarian,
    },
    {
      link: '/booking-room-feedbacks',
      label: 'Room Booking Feedbacks',
      icon: MessageShare,
      isRender: isAdmin || isLibrarian || isStaff,
    },
    {
      link: '/booking-room',
      label: 'Room Booking',
      icon: Ticket,
      isRender: isAdmin || isLibrarian || isStaff,
    },
    {
      link: '/booking-reason',
      label: 'Room Booking Reason',
      icon: Message,
      isRender: isAdmin || isLibrarian,
    },
    {
      link: '/holidays',
      label: 'Holidays',
      icon: Calendar,
      isRender: isAdmin || isLibrarian,
    },
    {
      link: '/slot',
      label: 'Slots Configuration',
      icon: Bookmark,
      isRender: isAdmin
    },
    {
      link: '/notifications',
      label: 'Notification',
      icon: Bell,
      isRender: isAdmin || isLibrarian || isStaff,
    },

  ];

  const [active, setActive] = useState('Billing');
  const router = useRouter();

  const isMenuSelect = (item) => {
    return item.label === active || router.route === item.link;
  };

  const links = data.map((item, index) =>
    item.isRender ? (
      item.isRender ? (
        <a
          className={
            props.opened
              ? cx(classes.closeLink, {
                  [classes.linkActive]: isMenuSelect(item),
                })
              : cx(classes.link, { [classes.linkActive]: isMenuSelect(item) })
          }
          href={item.link}
          key={index}
          onClick={async (event) => {
            event.preventDefault();
            setActive(item.label);
            await router.push(item.link);
          }}
        >
          <item.icon
            className={cx(classes.linkIcon, {
              [classes.iconActive]: isMenuSelect(item),
            })}
          />
          <span className={cx({ [classes.labelActive]: isMenuSelect(item) })}>
            {item.label}
          </span>
        </a>
      ) : null
    ) : null
  );

  return (
    <Navbar
      height={'full'}
      p="md"
      className={props.opened ? classes.closeNavBar : classes.navbar}
    >
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          {props.opened ? (
            <div
              style={{ backgroundColor: '#fff', borderRadius: 10, padding: 5 }}
            >
              <Image alt="FPTU Logo" src="/logo.svg" height={60} width={60} />
              <Text className={classes.text}>FLRBMS</Text>
            </div>
          ) : (
            <Code className={classes.version}>FPTU Library Room Booking</Code>
          )}
        </Group>
        {links}
      </Navbar.Section>

      {/* <Navbar.Section className={classes.footer}>
        <a
          href="apps/frontend/components/layout/NavBar#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            setPreferencesShown(!isPreferencesShown);
          }}
        >
          <User className={classes.linkIcon} />
          <span>Profile</span>
        </a>
        {isPreferencesShown ? (
          <PreferencesModal
            isShown={isPreferencesShown}
            toggleShown={() => setPreferencesShown(!isPreferencesShown)}
          />
        ) : null}

        <>
          <a
            href="apps/frontend/components/layout/NavBar#"
            className={classes.link}
            onClick={(event) => handleLogoutSubmit(event)}
          >
            <Logout className={classes.linkIcon} />
            <span>Logout</span>
          </a>
          {isLogoutModalShown ? (
            <LogoutModal
              isOpened={isLogoutModalShown}
              handleRouterReload={router.reload}
              handleClose={() => setLogoutModalShown(!isLogoutModalShown)}
            />
          ) : null}
        </>
      </Navbar.Section> */}
    </Navbar>
  );
};

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    navbar: {
      maxWidth: 250,
      backgroundColor: FPT_ORANGE_COLOR,
      '@media (max-width: 780px)': {
        maxWidth: 100,
      },
      transition: 'max-width 1s',
    },
    text: {
      fontWeight: 'bold',
      color: FPT_ORANGE_COLOR,
      fontSize: 16,
      fontFamily: 'monospace',
      // marginTop: -10,
      textAlign: 'center',
    },
    closeNavBar: {
      backgroundColor: FPT_ORANGE_COLOR,
      maxWidth: 100,
      transition: 'max-width 1s',
    },
    version: {
      backgroundColor: WHITE,
      color: BLACK,
      fontWeight: 700,
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${WHITE}`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${WHITE}`,
    },

    closeLink: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.white,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      span: {
        display: 'none',
      },

      '&:hover': {
        backgroundColor: '#f2f2f2',
        span: {
          color: FPT_ORANGE_COLOR,
        },
        svg: {
          color: FPT_ORANGE_COLOR,
        },
      },
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.white,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      span: {
        '@media (max-width: 780px)': {
          display: 'none',
        },
      },

      '&:hover': {
        backgroundColor: '#f2f2f2',
        span: {
          color: FPT_ORANGE_COLOR,
        },
        svg: {
          color: FPT_ORANGE_COLOR,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.white,
      opacity: 0.75,
      marginRight: theme.spacing.sm,
    },

    linkRedIcon: {
      borderRadius: 10,
      ref: icon,
      color: theme.white,
      backgroundColor: 'red',
      opacity: 0.75,
      marginRight: theme.spacing.sm,
    },

    iconActive: {
      color: FPT_ORANGE_COLOR,
    },
    labelActive: { color: FPT_ORANGE_COLOR },

    linkActive: {
      '&, &:hover': {
        backgroundColor: '#f2f2f2',
        [`& .${icon}`]: {
          opacity: 0.9,
        },
      },
    },
  };
});

export default LayoutSidebar;
