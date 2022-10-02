import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Avatar,
  Button,
  createStyles,
  Group,
  Navbar,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  At,
  Key,
  Lock,
  PhoneCall,
  User,
  Check,
  X,
  Settings,
} from 'tabler-icons-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateProfile } from '../../redux/features/account/thunk/update-profile.thunk';
import { uploadAvatar } from '../../redux/features/account/thunk/upload-avatar.thunk';
import { fetchProfile } from '../../redux/features/account/thunk/fetch-profile.thunk';
import ChangePassword from './change-password.component';
import { useTransition, animated } from 'react-spring';
import { UserInfoModel } from '../../models/user/user-info.model';
import { fetchBackendConfig } from '../../redux/features/system/thunk/fetch-backend-config.thunk';
import { updateBackendConfig } from '../../redux/features/system/thunk/update-backend-config.thunk';
// interface UserInfoPreferneceProps {}


const data = [
  { link: '', label: 'Profile', icon: User },
  { link: '', label: 'Authentication', icon: Key },
];

const UserInfoPreference: React.FC = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Profile');

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const data = useMemo(() => {
    if (userInfo.role === 'Staff') {
      return [
        { link: '', label: 'Profile', icon: User },
        { link: '', label: 'Authentication', icon: Key },
      ];
    } else {
      return [
        { link: '', label: 'Profile', icon: User },
        { link: '', label: 'Authentication', icon: Key },
        { link: '', label: 'General', icon: Settings },
      ];
    }
  }, [userInfo]);

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span className={classes.displayLabelNav}>{item.label}</span>
    </a>
  ));

  // const [image, setImage] = useState<File>(null);
  const avatarInputRef = useRef<HTMLInputElement>();

  const dispatch = useAppDispatch();

  const General: React.FC = () => {
    const backendConfig = useAppSelector((state) => state.system.backendConfig);

    useEffect(() => {
      dispatch(fetchBackendConfig());
    }, []);
    const handleUpdateSubmit = async (values) => {
      dispatch(
        updateBackendConfig({
          maxBookingDateRange: values.maxBookingDateRange,
          maxDeviceBorrowQuantity: values.maxDeviceBorrowQuantity,
          maxBookingRequestPerWeek: values.maxBookingRequest,
          maxRoomCapacity: values.maxRoomCapacity
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchBackendConfig());
        })
        .then(() =>
          showNotification({
            id: 'load-data',
            color: 'teal',
            title: 'Data was updated',
            message: 'Global preferences were updated successfully',
            icon: <Check />,
            autoClose: 3000,
          })
        )
        .catch((e) => {
          showNotification({
            id: 'load-data',
            color: 'red',
            title: 'Have error',
            message: `${e.message}`,
            icon: <X />,
            autoClose: 3000,
          });
        });
    };

    const initialFormValues = {
      maxBookingRequest: backendConfig.maxBookingRequestPerWeek,
      maxDeviceBorrowQuantity: backendConfig.maxDeviceBorrowQuantity,
      maxBookingDateRange: backendConfig.maxBookingDateRange,
      maxRoomCapacity: backendConfig.maxRoomCapacity
    };

    const UpdateSchema = Yup.object().shape({
      maxBookingRequest: Yup.number()
        .min(1, 'Must be positive number!')
        .required('Required'),
      maxDeviceBorrowQuantity: Yup.number()
        .min(1, 'Must be positive number!')
        .required('Required'),
      maxBookingDateRange: Yup.number()
        .min(1, 'Must be positive number!')
        .required('Required'),
      maxRoomCapacity: Yup.number()
        .min(1, 'Must be positive number!')
        .required('Required'),
    });

    const formik = useFormik({
      initialValues: initialFormValues,
      enableReinitialize: true,
      validationSchema: UpdateSchema,
      onSubmit: (values) => handleUpdateSubmit(values),
    });

    return (
      <form onSubmit={formik.handleSubmit}>
        <Text size="lg" weight="bolder" mb="md">
          General Preferences
        </Text>
        <div className={classes.displayGrid}>
          <TextInput
            type="number"
            min="1"
            id="maxBookingRequest"
            description="Maximum room booking request per week for staff accounts"
            onChange={formik.handleChange('maxBookingRequest')}
            error={
              formik.touched.maxBookingRequest &&
              Boolean(formik.errors.maxBookingRequest)
            }
            value={formik.values.maxBookingRequest}
            label={'Maximum booking request per week'}
            required
            name="maxBookingRequest"
            className={classes.inputText}
          />
          <TextInput
            type="number"
            min="1"
            id="maxDeviceBorrowQuantity"
            description="Maximum quantity of devices can be borrowed each room booking request"
            onChange={formik.handleChange('maxDeviceBorrowQuantity')}
            error={
              formik.touched.maxDeviceBorrowQuantity &&
              Boolean(formik.errors.maxDeviceBorrowQuantity)
                ? formik.errors.maxDeviceBorrowQuantity
                : null
            }
            value={formik.values.maxDeviceBorrowQuantity}
            label={'Maximum quantity of devices can be borrowed'}
            required
            name="maxDeviceBorrowQuantity"
            className={classes.inputText}
          />
          <TextInput
            type="number"
            min="1"
            id="maxBookingDateRange"
            description="Maximum date range can be booked by staff accounts"
            onChange={formik.handleChange}
            error={
              formik.touched.maxBookingDateRange &&
              Boolean(formik.errors.maxBookingDateRange)
                ? formik.errors.maxBookingDateRange
                : null
            }
            value={formik.values.maxBookingDateRange}
            label={'Maximum date range can be booked (day)'}
            required
            name="maxBookingDateRange"
            className={classes.inputText}
          />
          <TextInput
            type="number"
            min="1"
            id="maxRoomCapacity"
            description="Maximum room capacity of each rooms"
            onChange={formik.handleChange}
            error={
              formik.touched.maxRoomCapacity &&
              Boolean(formik.errors.maxRoomCapacity)
                ? formik.errors.maxRoomCapacity
                : null
            }
            value={formik.values.maxRoomCapacity}
            label={'Maximum room capacity of each rooms'}
            required
            name="maxRoomCapacity"
            className={classes.inputText}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '230px',
            width: '100%',
          }}
        >
          <Button color="green" type="submit" name="update">
            Save Changes
          </Button>
        </div>
      </form>
    );
  };

  const UserProfile: React.FC = () => {
    const handleUpdateSubmit = async (values) => {
      dispatch(
        updateProfile({
          id: values.id,
          fullname: values.fullname,
          phone: values.phone,
          email: values.email,
          description: values.description,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchProfile());
        })
        .then(() =>
          showNotification({
            id: 'load-data',
            color: 'teal',
            title: 'Data was updated',
            message: 'Your profile was updated successfully',
            icon: <Check />,
            autoClose: 3000,
          })
        )
        .catch((e) => {
          showNotification({
            id: 'load-data',
            color: 'red',
            title: 'Have error',
            message: `${e.message}`,
            icon: <X />,
            autoClose: 3000,
          });
        });
    };

    const initialFormValues = {
      id: userInfo?.id,
      avatar: userInfo?.avatar,
      username: userInfo?.username,
      fullname: userInfo?.fullname,
      email: userInfo?.email,
      phone: userInfo?.phone,
      description: userInfo?.description,
    };

    const UpdateSchema = Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Required'),
      fullname: Yup.string()
        .min(5, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
      phone: Yup.string()
        .min(10, 'Invalid Phone Number')
        .max(10, 'Too long!')
        .required('Required'),
    });

    const formik = useFormik({
      initialValues: initialFormValues,
      enableReinitialize: true,
      validationSchema: UpdateSchema,
      onSubmit: (values) => handleUpdateSubmit(values),
    });

    const [avatarURL, setAvatarURL] = useState(formik.values.avatar);

    const uploadToServer = (event) => {
      if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setAvatarURL(URL.createObjectURL(i));

        dispatch(
          uploadAvatar({
            img: i,
          })
        )
          .unwrap()
          .then(() => dispatch(fetchProfile()))
          .then(() =>
            showNotification({
              id: 'load-avatar',
              color: 'teal',
              title: 'Avatar updated',
              message: 'Your avatar was updated successfully',
              icon: <Check />,
              autoClose: 3000,
            })
          )
          .catch((e) => {
            showNotification({
              id: 'load-data',
              color: 'red',
              title: 'Have error',
              message: `${e.message}`,
              icon: <X />,
              autoClose: 3000,
            });
          });
      }
    };
    return (
      <form onSubmit={formik.handleSubmit}>
        <Group className={classes.avatarAndInforArea}>
          <div>
            <Avatar src={avatarURL} size={150} radius="md" />
            <Button
              className={classes.control}
              size="xs"
              variant="outline"
              onClick={() => avatarInputRef.current.click()}
            >
              Upload
            </Button>
            <input
              type="file"
              ref={avatarInputRef}
              style={{
                display: 'none',
              }}
              id="avatar"
              onChange={uploadToServer}
              name="avatar"
              accept=".jpg, .png, jpeg"
            />
          </div>
          <div className={classes.inforArea}>
            <Text
              size="xs"
              sx={{ textTransform: 'uppercase' }}
              weight={700}
              color="dimmed"
            >
              {userInfo?.role}
            </Text>

            <Text size="lg" weight={500} className={classes.name}>
              {userInfo?.fullname ??
                userInfo?.username ??
                userInfo?.email ??
                userInfo?.id}
            </Text>

            <Group noWrap spacing={10} mt={3}>
              <At size={16} className={classes.icon} />
              <Text size="xs" color="dimmed">
                {userInfo?.email}
              </Text>
            </Group>

            <Group noWrap spacing={10} mt={5}>
              <PhoneCall size={16} className={classes.icon} />
              <Text size="xs" color="dimmed">
                {userInfo?.phone}
              </Text>
            </Group>
          </div>
        </Group>

        <div className={classes.displayGrid}>
          <TextInput
            id="username"
            description="This will be visible to other people"
            onChange={formik.handleChange('username')}
            error={formik.touched.username && Boolean(formik.errors.username)}
            value={formik.values.username}
            label={'Username'}
            required
            name="username"
            disabled
            className={classes.inputText}
          />
          <TextInput
            id="fullname"
            description="This will be visible to other people"
            onChange={formik.handleChange('fullname')}
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            value={formik.values.fullname}
            label={'Fullname'}
            required
            name="fullname"
            placeholder="Set your own fullname"
            className={classes.inputText}
          />
          <TextInput
            id="email"
            description="Your primary email address of FPT Education Org"
            onChange={formik.handleChange}
            error={
              formik.touched.email && Boolean(formik.errors.email)
                ? formik.errors.email
                : null
            }
            value={formik.values.email}
            label={'Email'}
            required
            name="email"
            placeholder="Set your own email address"
            className={classes.inputText}
          />
          <TextInput
            id="phone"
            description="Change your phone number"
            onChange={formik.handleChange}
            error={
              formik.touched.phone && Boolean(formik.errors.phone)
                ? formik.errors.phone
                : null
            }
            value={formik.values.phone}
            label={'Phone'}
            required
            name="phone"
            placeholder="Set your own phone number"
            className={classes.inputText}
          />
          <Textarea
            id="description"
            description="Change your description"
            onChange={formik.handleChange}
            placeholder="Description"
            label="Your description"
            name="description"
            autosize
            minRows={2}
            value={formik.values.description}
            className={classes.fullWidth}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '50px',
            width: '100%',
          }}
        >
          <Button color="green" type="submit" name="update">
            Save Changes
          </Button>
        </div>
      </form>
    );
  };

  const Authentication: React.FC = () => {
    const [isShowChangePass, setIsShowChangePass] = useState(false);
    const transition = useTransition(isShowChangePass, {
      from: { x: -100, y: 0, opacity: 0 },
      enter: { x: 0, y: 0, opacity: 1 },
      leave: { x: 100, y: 0, opacity: 0 },
    });
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button
            leftIcon={<Lock />}
            className={classes.marginTop10}
            onClick={() => {
              setIsShowChangePass((isShowChangePass) => !isShowChangePass);
            }}
          >
            Reset password
          </Button>
          {/*<Button className={classes.marginTop10}>
            Authenticate with username password
          </Button>
          <Button className={classes.marginTop10}>Link to Google</Button>
          */}
          {transition((style, item) =>
            item ? (
              <animated.div style={style}>
                <ChangePassword username={userInfo.username} />
              </animated.div>
            ) : (
              ''
            )
          )}
        </div>
      </div>
    );
  };

  const Renderer = ({ label }) => {
    switch (label) {
      case 'Profile':
        return <UserProfile />;
      case 'Authentication':
        return <Authentication />;
      case 'General':
        return <General />;
    }
  };

  return (
    <div className={classes.playoutModal}>
      <Navbar className={classes.displayNav} p="sm">
        <Navbar.Section grow className={classes.displayNavSestion}>
          {links}
        </Navbar.Section>
      </Navbar>
      <div className={classes.displayRightModal}>
        <Renderer label={active} />
      </div>
    </div>
  );
};

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    icon: {
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[5],
    },
    playoutModal: {
      display: 'flex',
      transition: 'height 0.25s ease-in',
      '@media (max-width: 540px)': {
        flexDirection: 'column',
      },
    },
    displayNav: {
      height: 'auto',
      minHeight: 500,
      width: 300,
      '@media (max-width: 920px)': {
        width: 'auto',
      },
      '@media (max-width: 540px)': {
        borderRight: '0px',
        borderBottom: '1px solid #e9ecef',
        marginBottom: '10px',
        minHeight: '45px',
        justifyContent: 'space-evenly',
      },
    },
    displayNavSestion: {
      '@media (max-width: 540px)': {
        display: 'flex',
        height: '45px',
        a: {
          flex: 1,
          justifyContent: 'center',
        },
      },
    },
    displayLabelNav: {
      '@media (max-width: 920px)': {
        display: 'none',
      },
    },
    avatarAndInforArea: {
      flexWrap: 'nowrap',
      '@media (max-width: 920px)': {
        flexDirection: 'column',
      },
    },
    inforArea: {
      marginTop: '-30px',
      '@media (max-width: 920px)': {
        textAlign: 'center',
      },
    },
    displayRightModal: {
      marginLeft: 20,
      width: '100%',
      minWidth: 0,
      '@media (max-width: 540px)': {
        margin: 0,
      },
    },
    displayGrid: {
      display: 'grid',
      gridTemplateColumns: '50% 50%',
      gap: '10px',
      width: '100%',
      '@media (max-width: 920px)': {
        gridTemplateColumns: '100%',
      },
    },
    inputText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    fullWidth: {
      gridColumnStart: 1,
      gridColumnEnd: 3,
      '@media (max-width: 920px)': {
        gridColumnEnd: 2,
      },
    },
    name: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
    control: {
      position: 'relative',
      width: 150,
      bottom: 30,
    },
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colorScheme === 'dark'
            ? theme.white
            : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === 'dark' ? 5 : 7
            ],
        },
      },
    },
    marginTop10: {
      marginTop: 10,
    },
  };
});

export default UserInfoPreference;
