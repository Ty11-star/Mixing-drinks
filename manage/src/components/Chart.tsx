import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  option: echarts.EChartsOption;
  height?: number | string;
  loading?: boolean;
}

/**
 * 通用 ECharts 图表容器（自动响应窗口尺寸变化）
 */
const Chart = ({ option, height = 320, loading }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (loading) {
      chart.showLoading('default', {
        text: '加载中...',
        color: '#5B8DEF',
        textColor: '#999',
      });
    } else {
      chart.hideLoading();
      chart.setOption(option, true);
    }
  }, [option, loading]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default Chart;
