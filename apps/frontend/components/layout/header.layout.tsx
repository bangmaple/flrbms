import React, {useEffect, useRef, useState} from 'react';
import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  Button,
  Text,
  Avatar,
} from '@mantine/core';
import {useBooleanToggle} from '@mantine/hooks';
import {Bell, ChevronDown, Logout, User} from 'tabler-icons-react';
import {
  BLACK,
  FPT_ORANGE_COLOR,
  GRAY,
  LIGHT_GRAY,
  WHITE,
} from '@app/constants';
import {useOuterClick} from '../../hooks/use-outer-clickk';
import PreferencesModal from '../preferences.modal.component';
import LogoutModal from '../logout.modal';
import {useRouter} from 'next/router';

interface UserInfoModel {
  avatar: string;
  fullname: string;
  role: string;
  phone: string;
  email: string;
  username: string;
  id: string;
  googleId: string;
  keycloakId: string;
  effdate: string;
  description: string;
  img: File;
}

interface HeaderSearchProps {
  // links: { link: string; label: string }[];
  toggleOpened(): void

  opened: boolean
}

const LayoutHeader: React.FC<HeaderSearchProps> = (props) => {
  // const [opened, toggleOpened] = useBooleanToggle(false);
  const router = useRouter();
  const {classes} = useStyles();

  // const [isNotificationShown, setNotificationShown] = useState<boolean>(false);
  const [isPreferencesShown, setPreferencesShown] = useState<boolean>(false);
  const [isLogoutModalShown, setLogoutModalShown] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);

  useEffect(() => {
    setUserInfo(JSON.parse(window.localStorage.getItem('user')));
  }, []);

  const handleLogoutSubmit = async () => {
    setLogoutModalShown(!isLogoutModalShown);
  };

  // const toggleNotificationShown = () => {
  //   setNotificationShown(!isNotificationShown);
  // };

  // const innerRef = useOuterClick((ev) => toggleNotificationShown());

  return (
    <Header height={56} className={classes.header} mb={20}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={props.opened} onClick={() => props.toggleOpened()} size="sm"/>
          <></>
        </Group>

        <Group>
          <Group ml={50} spacing={5}>
            <Button
              className={classes.avatarContainer}
              onClick={() => setPreferencesShown(!isPreferencesShown)}
            >
              <div className={classes.avatarImage}>
                <Avatar src={userInfo?.avatar} radius="md"/>
              </div>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                }}
              >
                {userInfo?.username}
              </Text>
            </Button>
            {/* <Button
              className={classes.button}
              onClick={() => toggleNotificationShown()}
            >
              <Bell className={classes.innerButton}/>
              {isNotificationShown ? (
                <div>
                  <div>
                    <div className={classes.notificationLayoutForm}>
                      <div>
                        <div
                          aria-label="Notification"
                          className={classes.notificationLayoutPosition}
                        >
                          <div>
                            <div className={classes.notificationLayoutSize}>
                              <div
                                ref={innerRef}
                                className={classes.notificationContainerForm}
                              >
                                <div
                                  className={
                                    classes.notificationContainerLayout
                                  }
                                >
                                  <div
                                    className={
                                      classes.notificationHeaderContainer
                                    }
                                  >
                                    <div
                                      className={classes.notificationHeaderForm}
                                    >
                                      <div
                                        className={
                                          classes.notificationHeaderLayout
                                        }
                                      >
                                        <div>
                                          <span
                                            className={
                                              classes.notificationHeaderContentFont
                                            }
                                          >
                                            <h1
                                              className={
                                                classes.notificationHeaderContentAttribute
                                              }
                                              tabIndex={-1}
                                            >
                                              Notification
                                            </h1>
                                          </span>
                                        </div>
                                        <div>
                                          <Button
                                            variant="default"
                                            aria-label="Action to notification"
                                            className={
                                              classes.notificationHeaderActionForm
                                            }
                                          >
                                            <i
                                              className={
                                                classes.notificationHeaderActionIcon
                                              }
                                            ></i>
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      aria-label="Notification Filter"
                                      className={classes.notificationFilterForm}
                                    >
                                      <div
                                        className={
                                          classes.notificationFilterLayout
                                        }
                                      >
                                        <Button
                                          variant="light"
                                          className={classes.notificationButton}
                                        >
                                          <span
                                            className={
                                              classes.notificationButtonContent
                                            }
                                          >
                                            All
                                          </span>
                                        </Button>
                                      </div>
                                      <div
                                        className={
                                          classes.notificationFilterLayout
                                        }
                                      >
                                        <Button
                                          variant="default"
                                          className={classes.notificationButton}
                                        >
                                          <span
                                            className={
                                              classes.notificationButtonContent
                                            }
                                          >
                                            Not Read
                                          </span>
                                        </Button>
                                      </div>
                                    </div>
                                    <div>
                                      <div aria-label="Notification List New">
                                        <div
                                          style={{
                                            marginTop: '-4px',
                                          }}
                                        >
                                          <div>
                                            <div
                                              className={
                                                classes.notificationListForm
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListLayout
                                                }
                                              >
                                                <div
                                                  className={
                                                    classes.notificationListHeaderFrom
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      classes.notificationListHeaderLayout
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        classes.notificationListHeaderSize
                                                      }
                                                    >
                                                      <span
                                                        className={
                                                          classes.notificationListContentForm
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            classes.notificationListContentLayout
                                                          }
                                                        >
                                                          <div
                                                            className={
                                                              classes.notificationListContentHeaderForm
                                                            }
                                                          >
                                                            <h2
                                                              className={
                                                                classes.notificationListContentHeaderLayout
                                                              }
                                                            >
                                                              New
                                                            </h2>
                                                          </div>
                                                          <div
                                                            className={
                                                              classes.notificationListContentLinkForm
                                                            }
                                                          >
                                                            <div
                                                              className={
                                                                classes.notificationListContentLinkLayout
                                                              }
                                                            >
                                                              <div>
                                                                <a
                                                                  className={
                                                                    classes.notificationListContentLinkAttribute
                                                                  }
                                                                  href="/Users/Admin/IdeaProjects/app2/apps/frontend/pages/notifications"
                                                                >
                                                                  <h2
                                                                    className={
                                                                      classes.notificationListContentLinkFont
                                                                    }
                                                                  >
                                                                    View all
                                                                    notifications
                                                                  </h2>
                                                                </a>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div aria-label="Notification List Readed">
                                        <div
                                          style={{
                                            marginTop: '-4px',
                                          }}
                                        >
                                          <div>
                                            <div
                                              className={
                                                classes.notificationListForm
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListLayout
                                                }
                                              >
                                                <div
                                                  className={
                                                    classes.notificationListHeaderFrom
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      classes.notificationListHeaderLayout
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        classes.notificationListHeaderSize
                                                      }
                                                    >
                                                      <span
                                                        className={
                                                          classes.notificationListContentForm
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            classes.notificationListContentLayout
                                                          }
                                                        >
                                                          <div
                                                            className={
                                                              classes.notificationListContentHeaderForm
                                                            }
                                                          >
                                                            <h2
                                                              className={
                                                                classes.notificationListContentHeaderLayout
                                                              }
                                                            >
                                                              Readed
                                                            </h2>
                                                          </div>
                                                        </div>
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      <div>
                                        <a
                                          className={
                                            classes.notificationListContainer
                                          }
                                          href="apps/frontend/components/layout/header.layout#"
                                        >
                                          <div
                                            className={
                                              classes.notificationListContainerLinkFrom
                                            }
                                          >
                                            <div
                                              className={
                                                classes.notificationListContainerLinkLayout
                                              }
                                            >
                                              <div
                                                className={
                                                  classes.notificationListContainerContenIconForm
                                                }
                                              >
                                                <Bell
                                                  className={
                                                    classes.innerButton
                                                  }
                                                />
                                              </div>
                                              <div
                                                className={
                                                  classes.notificationListContainerContenMessageForm
                                                }
                                              >
                                                <b>Ngô Ngyên Bằng </b> đã yêu
                                                cầu mượng phòng <b> LB12</b>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </Button> */}
            <Button className={classes.button}>
              <ChevronDown className={classes.innerButton}/>
            </Button>
            <Button
              className={classes.button}
              onClick={() => handleLogoutSubmit()}
            >
              <Logout color={BLACK}/>
            </Button>
          </Group>
        </Group>

        {isPreferencesShown ? (
          <PreferencesModal
            isShown={isPreferencesShown}
            toggleShown={() => setPreferencesShown(!isPreferencesShown)}
          />
        ) : null}

        {isLogoutModalShown ? (
          <LogoutModal
            isOpened={isLogoutModalShown}
            handleRouterReload={() => router.replace("/login")}
            handleClose={() => setLogoutModalShown(!isLogoutModalShown)}
          />
        ) : null}
      </div>
    </Header>
  );
}
const useStyles = createStyles((theme) => ({
  avatarContainer: {
    color: BLACK,
    height: 50,
    backgroundColor: WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 50,
    '&:hover': {
      backgroundColor: LIGHT_GRAY,
    },
  },
  avatarImage: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 50,
    marginRight: 10,
  },
  //-------------------------------------------START OF NOFITICATION---------------------------------------//
  //-------------------------------------------NOTIFICATION LAYOUT OUTSIDE-----------------------------------//
  notificationLayoutForm: {
    transform: 'translate(-172px, 48px)',
    marginRight: '-9999px',
    position: 'absolute',
    top: -2,
    left: 'calc(-2vw)',
    zIndex: 1,
  },

  notificationLayoutPosition: {
    marginRight: '8px',
    marginTop: '5px',
    borderRadius: '8px',
    boxShadow:
      '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
    overflowX: 'hidden',
    backgroundColor: WHITE,
  },

  notificationLayoutSize: {
    maxHeight: 'calc(100vh - 56px - 16px)',
    width: '360px',
    display: 'flex',
    backgroundColor: WHITE,
    maxWidth: 'calc(100vw - 24px)',
    flexDirection: 'column',
  },
  //---------------------------------NOTIFICATION HEADER 1---------------------------------------//
  notificationContainerForm: {
    minHeight: 0,
    perspectiveOrigin: 'right top',
    scrollbarWidth: 'none',
    overflowX: 'hidden',
    position: 'relative',
    perspective: '1px',
    transformStyle: 'preserve-3d',
    willChange: 'transform,scroll-position',
    display: 'flex',
    flexShrink: 1,
    overflowY: 'auto',
    flexBasis: '100%',
    flexDirection: 'column',
    overscrollBehaviorY: 'contain',
    flexGrow: 1,
  },

  notificationContainerLayout: {
    fontFamily: 'inherit',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  notificationHeaderForm: {
    boxSizing: 'border-box',
    flexBasis: '0px',
    position: 'relative',
    display: 'flex',
    minWidth: 0,
    flexShrink: 1,
    zIndex: 0,
    maxWidth: '100%',
    flexDirection: 'column',
    flexGrow: 1,
  },

  notificationHeaderLayout: {
    boxSizing: 'border-box',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationHeaderContentFont: {
    wordBreak: 'break-word',
    color: BLACK,
    fontSize: '1.5rem',
    textAlign: 'left',
    minWidth: 0,
    fontWeight: 700,
    lineHeight: 1.1667,
    maxWidth: '100%',
    wordWrap: 'break-word',
    display: 'block',
    unicodeBidi: 'isolate',
  },

  notificationHeaderContentAttribute: {
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    outline: 'none',
    margin: 0,
    padding: 0,
    display: 'block',
    marginBlockStart: '0.67em',
    marginBlockEnd: '0.67em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
    wordBreak: 'break-word',
    textAlign: 'left',
    lineHeight: 1.1667,
    wordWrap: 'break-word',
  },

  notificationHeaderActionForm: {
    justifyContent: 'center',
    padding: '0 0 0 0',
    margin: '0 0 0 0',
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    height: '32px',
    display: 'flex',
    backgroundColor: 'transparent',
    touchAction: 'manipulation',
    borderRadius: '50%',
    width: '32px',
    alignItems: 'center',
    borderWidth: 0,
    border: 0,
    listStyle: 'none',
    outline: 'none',
    textDecoration: 'none',
  },
  //------------------------------------NOTIFICATION ACTION---------------------------------------//
  notificationHeaderActionIcon: {
    backgroundImage:
      'url(https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/GBw_R_G5XHi.png)',
    backgroundPosition: '-147px -67px',
    backgroundSize: 'auto',
    width: '20px',
    height: '20px',
    backgroundRepeat: 'no-repeat',
    display: 'inline-block',
    verticalAlign: '-0.25em',
    fontStyle: 'italic',
  },

  notificationHeaderContainer: {
    fontFamily: 'inherit',
    marginRight: '16px',
    boxSizing: 'border-box',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    marginBottom: '12px',
    marginTop: '20px',
    display: 'flex',
    zIndex: 0,
    justifyContent: 'space-between',
    marginLeft: '16px',
    flexDirection: 'row',
    alignItems: 'center',
  },
  //-----------------------------------NOTIFICATION FILTER---------------------------------------//
  notificationFilterForm: {
    flexShrink: 0,
    flexWrap: 'wrap',
    display: 'flex',
    paddingLeft: '16px',
    flexDirection: 'row',
  },

  notificationFilterLayout: {
    boxSizing: 'border-box',
    paddingRight: '8px',
    height: '100%',
  },

  notificationButton: {
    boxSizing: 'border-box',
    paddingBottom: 0,
    borderRadius: '18px',
    margin: 0,
    paddingTop: 0,
    border: 0,
  },

  notificationButtonContent: {
    fontFamily: 'inherit',
    wordBreak: 'break-word',
    fontWeight: 600,
    fontSize: '.9375rem',
    minWidth: 0,
    maxWidth: '100%',
    wordWrap: 'break-word',
    display: 'block',
    lineHeight: 1.3333,
    unicodeBidi: 'isolate',
  },
  //-----------------------------------NOTIFICATION LIST LAYOUT OUTSIDE----------------------------------------//
  notificationListForm: {
    boxSizing: 'border-box',
    flexShrink: 0,
    position: 'relative',
    display: 'flex',
    paddingBottom: '4px',
    zIndex: 0,
    maxWidth: '100%',
    flexDirection: 'column',
    paddingTop: '20px',
  },

  notificationListLayout: {
    minHeight: 0,
    boxSizing: 'border-box',
    position: 'relative',
    display: 'flex',
    zIndex: 0,
    flexDirection: 'column',
    flexGrow: 1,
  },

  notificationListHeaderFrom: {
    boxSizing: 'border-box',
    flexShrink: 0,
    position: 'relative',
    display: 'flex',
    paddingRight: '16px',
    zIndex: 0,
    paddingLeft: '16px',
    maxWidth: '100%',
    flexDirection: 'column',
  },

  notificationListHeaderLayout: {
    display: 'flex',
    marginTop: '-5px',
    marginBottom: '-5px',
    flexDirection: 'column',
  },

  notificationListHeaderSize: {
    marginBottom: '5px',
    marginTop: '5px',
  },
  //----------------------------------------NOTIFICATINO LIST CONTENT LAYOUT-------------------------------------//
  notificationListContentForm: {
    wordBreak: 'break-word',
    color: BLACK,
    fontWeight: 600,
    minWidth: 0,
    maxWidth: '100%',
    lineHeight: 1.1765,
    wordWrap: 'break-word',
    display: 'block',
    fontSize: '1.0625rem',
    unicodeBidi: 'isolate',
  },

  notificationListContentLayout: {
    boxSizing: 'border-box',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    direction: 'ltr',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  //---------------------------------NOTIFICATION LIST CONTENT HEADER 2------------------------------------------//
  notificationListContentHeaderForm: {
    boxSizing: 'border-box',
    flexBasis: '0px',
    position: 'relative',
    display: 'flex',
    minWidth: 0,
    flexShrink: 1,
    zIndex: 0,
    maxWidth: '100%',
    flexDirection: 'column',
    flexGrow: 1,
  },

  notificationListContentHeaderLayout: {
    textAlign: 'left',
    fontWeight: 'inherit',
    fontSize: 'inherit',
    minWidth: 0,
    color: 'inherit',
    maxWidth: '100%',
    outline: 'none',
    margin: 0,
    padding: 0,
    marginBlockStart: '0.83em',
    marginBlockEnd: '0.83em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
  },
  //-------------------------------------------NOTICATION LIST CONTENT LINK-----------------------------------------------//
  notificationListContentLinkForm: {
    fontFamily: 'inherit',
    justifyContent: 'center',
    boxSizing: 'border-box',
    flexShrink: 0,
    alignSelf: 'flex-start',
    position: 'relative',
    display: 'flex',
    minWidth: 0,
    marginLeft: '8px',
    zIndex: 0,
    maxWidth: '100%',
    flexDirection: 'column',
  },

  notificationListContentLinkLayout: {
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationListContentLinkAttribute: {
    fontFamily: 'inherit',
    minHeight: 0,
    padding: 0,
    boxSizing: 'border-box',
    borderBottomLeftRadius: '4px',
    display: 'inline-block',
    verticalAlign: 'bottom',
    color: '#216FDB',
    flexShrink: 0,
    margin: 0,
    WebkitTapHighlightColor: 'transparent',
    cursor: 'pointer',
    flexBasis: 'auto',
    position: 'relative',
    borderRadius: '4px',
    textAlign: 'inherit',
    minWidth: 0,
    alignItems: 'stretch',
    touchAction: 'manipulation',
    zIndex: 0,
    flexDirection: 'row',
    WebkitUserSelect: 'none',
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 0,
    borderStyle: 'solid',
    listStyle: 'none',
    textDecoration: 'none!important',
    outline: 'none',
  },

  notificationListContentLinkFont: {
    textAlign: 'right',
    fontFamily: 'inherit',
    overflowY: 'hidden',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
    whiteSpace: 'nowrap',
    display: 'block',
    marginBlockStart: '0.83em',
    marginBlockEnd: '0.83em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
    unicodeBidi: 'isolate',
  },
  //----------------------------------------NOTIFICATION LIST MESSAGE-------------------------------//
  notificationListContainer: {
    borderRadius: '8px',
    padding: '0 0 0 0',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'transparent',
    cursor: 'pointer',
    flexBasis: 'auto',
    position: 'relative',
    margin: '0 0 0 0',
    textAlign: 'inherit',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    touchAction: 'manipulation',
    flexDirection: 'row',
    userSelect: 'none',
    display: 'block',
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderStyle: 'solid',
    listStyle: 'none',
    outline: 'none',
    textDecoration: 'none',
    color: '#385898',
  },

  notificationListContainerLinkFrom: {
    color: BLACK,
    margin: 10,
  },

  notificationListContainerLinkLayout: {
    display: 'flex',
    alignItems: 'center',
  },

  notificationListContainerContenIconForm: {
    width: 60,
    height: 50,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY,
  },

  notificationListContainerContenMessageForm: {
    display: 'flex',
    flexWrap: 'wrap',
    lineHeight: 1.5,
    marginLeft: 10,
  },
  //------------------------------END OF NOTIFICATION-------------------------------------//

  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 50,
    '&:hover': {
      backgroundColor: theme.fn.darken(FPT_ORANGE_COLOR, 0.01),
    },
  },
  innerButton: {
    color: GRAY,
    '&:hover': {
      color: WHITE,
    },
  },
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

export default LayoutHeader
