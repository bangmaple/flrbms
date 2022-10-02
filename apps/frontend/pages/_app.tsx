import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { MantineProvider } from '@mantine/core';
import { wrapper } from '../redux/store';
import {  useState } from 'react';
import { useRouter } from 'next/router';
import SystemErrorModal from '../components/generic/system-error.modal';
import Spinner from '../components/generic/spinner';
import { NotificationsProvider } from '@mantine/notifications';
import 'firebase/messaging';
import {
  firebaseConfig,
} from '../utils/webpush';
import { initializeApp } from 'firebase/app';
import PopupNotification from '../components/layout/popup-notification';
initializeApp(firebaseConfig);

function CustomApp({ Component, pageProps }: AppProps) {
  const [isSystemErrorModalShown, setSystemErrorModalShown] =
    useState<boolean>(false);
  const router = useRouter();

  PopupNotification()
  
  return (
    <NotificationsProvider>
      <Head>
        <title>FPTU Library Room Booking</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <main className="app">
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
          }}
        >
          <Spinner />
          <Component {...pageProps} />
          <SystemErrorModal
            opened={isSystemErrorModalShown}
            handleClose={async () => {
              setSystemErrorModalShown(!isSystemErrorModalShown);
              await router.replace('/');
            }}
          />
        </MantineProvider>
      </main>
    </NotificationsProvider>
  );
}

export default wrapper.withRedux(CustomApp);
