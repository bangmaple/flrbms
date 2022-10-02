import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ChartProps {
  total: number;
  booked: number;
  cancelled: number;
}

const ApexChart: React.FC<ChartProps> = (props) => {
  const state = useMemo(() => {
    return {
      series: [props?.booked, props?.cancelled],
      options: {
        chart: {
          width: 600,
          type: 'donut',
        },
        labels: ['Booked', 'Cancelled'],
        colors: ['#13bd00', '#ff0000'],
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter: function (val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
          },
        },
        title: {
          text: 'Statistics of the number of requests',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      } as any,
    };
  }, [props?.booked, props?.cancelled, props?.total]);

  if (props?.booked && props?.cancelled && props?.total) {
    return (
      <div id="chart" style={{ display: 'flex', justifyContent: 'center' }}>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
          width={600}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default ApexChart;
