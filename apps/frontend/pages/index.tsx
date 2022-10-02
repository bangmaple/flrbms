import styles from './index.module.scss';
import { GetServerSideProps } from 'next';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <>
      <div className={styles.page}></div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/login',
      permanent: true,
    },
  };
};

export default Index;
