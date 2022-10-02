import React, { useEffect } from 'react';
import {  Tabs, } from '@mantine/core';
import AdminLayout from '../../components/layout/admin.layout';
import { fetchStatistic } from '../../redux/features/room-booking/thunk/fetch-statistics.thunk';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ApexChart from './chart';

function Dashboard() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.roomBooking.bookingRoomStatistics
  );
  const { totalTime, month, week, day } = stats;

  useEffect(() => {
    dispatch(fetchStatistic()).unwrap();
  }, []);

  return (
    <AdminLayout>
      <Tabs defaultValue="gallery">
        <Tabs.Tab title="Total time" label="Total time" value="totalTime">
          {stats ? (
            <ApexChart
              cancelled={totalTime?.['cancelled']}
              booked={totalTime?.['booked']}
              total={totalTime?.['total']}
            />
          ) : null}
        </Tabs.Tab>
        <Tabs.Tab label="Month" value="month">
          {stats ? (
            <ApexChart
              cancelled={month?.['cancelled']}
              booked={month?.['booked']}
              total={month?.['total']}
            />
          ) : null}
        </Tabs.Tab>
        <Tabs.Tab label="Week" value="week">
          {stats ? (
            <ApexChart
              cancelled={week?.['cancelled']}
              booked={week?.['booked']}
              total={week?.['total']}
            />
          ) : null}
        </Tabs.Tab>
        <Tabs.Tab label="Day" value="day">
          {stats ? (
            <ApexChart
              cancelled={day?.['cancelled']}
              booked={day?.['booked']}
              total={day?.['total']}
            />
          ) : null}
        </Tabs.Tab>
      </Tabs>
    </AdminLayout>
  );
}

export default Dashboard;
