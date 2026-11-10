import { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Tag, message, Spin, Button } from 'antd';
import { ReloadOutlined, RiseOutlined, UserOutlined } from '@ant-design/icons';
import type * as echarts from 'echarts';
import Chart from '../../components/Chart';
import { getDashboardStats } from '../../api/stats';
import type { DashboardStats } from '../../api/stats';
import {
  CocktailGlassIcon,
  JiggerIcon,
  CoasterIcon,
} from '../../theme/icons/SpiritIcons';

const methodMap: Record<string, string> = {
  shake: '摇和法 (Shake)',
  stir: '搅拌法 (Stir)',
  build: '兑和法 (Build)',
};

const categoryMap: Record<string, string> = {
  base_spirit: '基酒',
  liqueur: '利口酒',
  juice: '果汁饮料',
  syrup: '糖浆',
  soda: '苏打类',
  garnish: '装饰物',
  other: '其他',
};

/** 主题化图表配色（威士忌棕 / 冰蓝 / 低饱和点缀） */
const PALETTE = {
  rum: '#C08E57',
  vodka: '#6FB3D6',
  gin: '#7BC8A4',
  whiskey: '#A8743D',
  tequila: '#D9A441',
  brandy: '#C97B84',
  fallback: '#B0B8C4',
  easy: '#7BC8A4',
  medium: '#D4A574',
  hard: '#C97B6B',
};

const spiritColorMap: Record<string, string> = {
  朗姆酒: PALETTE.rum,
  伏特加: PALETTE.vodka,
  金酒: PALETTE.gin,
  威士忌: PALETTE.whiskey,
  龙舌兰: PALETTE.tequila,
  白兰地: PALETTE.brandy,
};

const pieBase = {
  type: 'pie' as const,
  radius: ['48%', '72%'],
  center: ['50%', '46%'] as [string, string],
  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
  label: { show: false },
  emphasis: {
    label: { show: true, fontSize: 13, fontWeight: 600 as const, formatter: '{b}\n{c}' },
  },
};

const hbarBase = {
  type: 'bar' as const,
  barWidth: 14,
  itemStyle: { borderRadius: [0, 8, 8, 0] },
  label: { show: true, position: 'right' as const, formatter: '{c}' },
};

const hbarAxis = {
  type: 'category' as const,
  inverse: true,
  axisTick: { show: false },
  axisLine: { show: false },
};

/** 暗调图表通用样式 */
const chartText = '#D8CDBE';
const axisLineColor = 'rgba(224,176,121,0.15)';
const splitColor = 'rgba(224,176,121,0.08)';
const tooltipDark: echarts.EChartsOption['tooltip'] = {
  backgroundColor: 'rgba(28,20,13,0.92)',
  borderColor: 'rgba(224,176,121,0.30)',
  textStyle: { color: '#E7DCCB' },
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error: any) {
      message.error(error.message || '加载看板数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const overview = stats?.overview || {
    cocktailCount: 0,
    ingredientCount: 0,
    categoryCount: 0,
    adminCount: 0,
    newCocktailCount: 0,
  };

  // ===== 图表配置 =====
  const baseSpiritOption: echarts.EChartsOption = {
    tooltip: { ...tooltipDark, trigger: 'item', formatter: '{b}: {c} 款 ({d}%)' },
    legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { color: chartText } },
    series: [
      {
        ...pieBase,
        data: (stats?.byBaseSpirit || []).map((item) => ({
          name: item.name,
          value: item.count,
          itemStyle: { color: spiritColorMap[item.name] || PALETTE.fallback },
        })),
      },
    ],
  };

  const difficultyOption: echarts.EChartsOption = {
    tooltip: { ...tooltipDark, trigger: 'axis' },
    grid: { left: 40, right: 16, top: 28, bottom: 28 },
    textStyle: { color: chartText },
    xAxis: {
      type: 'category',
      data: ['简单', '中等', '困难'],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: axisLineColor } },
      axisLabel: { color: chartText },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { type: 'dashed', color: splitColor } },
      axisLabel: { color: chartText },
    },
    series: [
      {
        type: 'bar',
        barWidth: 36,
        itemStyle: { borderRadius: [6, 6, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c} 款', color: chartText },
        data: [1, 2, 3].map((level) => ({
          value: stats?.byDifficulty.find((d) => d.difficulty === level)?.count || 0,
          itemStyle: {
            color: level === 1 ? PALETTE.easy : level === 2 ? PALETTE.medium : PALETTE.hard,
          },
        })),
      },
    ],
  };

  const methodOption: echarts.EChartsOption = {
    tooltip: { ...tooltipDark, trigger: 'item', formatter: '{b}: {c} 款 ({d}%)' },
    legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { color: chartText } },
    color: [PALETTE.medium, PALETTE.vodka, PALETTE.gin],
    series: [
      {
        ...pieBase,
        data: (stats?.byMethod || []).map((item) => ({
          name: methodMap[item.name] || item.name,
          value: item.count,
        })),
      },
    ],
  };

  const ingredientCategoryOption: echarts.EChartsOption = {
    tooltip: { ...tooltipDark, trigger: 'item', formatter: '{b}: {c} 种 ({d}%)' },
    legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { color: chartText } },
    color: [PALETTE.vodka, PALETTE.rum, '#A78BDA', PALETTE.gin, PALETTE.tequila, PALETTE.brandy, PALETTE.fallback],
    series: [
      {
        ...pieBase,
        data: (stats?.ingredientsByCategory || []).map((item) => ({
          name: categoryMap[item.name] || item.name,
          value: item.count,
        })),
      },
    ],
  };

  const topIngredientsOption: echarts.EChartsOption = {
    tooltip: { ...tooltipDark, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 88, right: 36, top: 8, bottom: 20 },
    textStyle: { color: chartText },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { type: 'dashed', color: splitColor } },
      axisLabel: { color: chartText },
    },
    yAxis: { ...hbarAxis, data: (stats?.topIngredients || []).map((i) => i.name) },
    series: [
      {
        ...hbarBase,
        itemStyle: { borderRadius: [0, 8, 8, 0], color: PALETTE.vodka },
        data: (stats?.topIngredients || []).map((i) => i.count),
      },
    ],
  };

  const categoryCocktailsOption: echarts.EChartsOption = {
    tooltip: { ...tooltipDark, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 88, right: 36, top: 8, bottom: 20 },
    textStyle: { color: chartText },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { type: 'dashed', color: splitColor } },
      axisLabel: { color: chartText },
    },
    yAxis: { ...hbarAxis, data: (stats?.cocktailsPerCategory || []).map((c) => c.name) },
    series: [
      {
        ...hbarBase,
        itemStyle: { borderRadius: [0, 8, 8, 0], color: PALETTE.rum },
        data: (stats?.cocktailsPerCategory || []).map((c) => c.count),
      },
    ],
  };

  const recentColumns = [
    { title: '酒谱名称', dataIndex: 'name' },
    {
      title: '基酒',
      dataIndex: 'base_spirit',
      render: (v: string | null) =>
        v ? <Tag color="orange">{v}</Tag> : <Tag>未设置</Tag>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 90,
      render: (v: number) => (
        <Tag color={v === 1 ? 'green' : v === 2 ? 'gold' : 'red'}>
          {v === 1 ? '简单' : v === 2 ? '中等' : '困难'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: number) => (
        <Tag color={v === 1 ? 'success' : 'default'}>{v === 1 ? '已上架' : '未上架'}</Tag>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'create_time',
      width: 170,
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
  ];

  const statCards = [
    {
      title: '酒谱总数',
      value: overview.cocktailCount,
      icon: <CocktailGlassIcon size={22} />,
      tint: '#C08E57',
    },
    {
      title: '材料总数',
      value: overview.ingredientCount,
      icon: <JiggerIcon size={22} />,
      tint: '#4A98C0',
    },
    {
      title: '分类总数',
      value: overview.categoryCount,
      icon: <CoasterIcon size={22} />,
      tint: '#4CAF7D',
    },
    {
      title: '近7天新增酒谱',
      value: overview.newCocktailCount,
      icon: <RiseOutlined style={{ fontSize: 20 }} />,
      tint: '#C97B6B',
    },
    {
      title: '管理员数量',
      value: overview.adminCount,
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      tint: '#A78BDA',
    },
  ];

  return (
    <div>
      {/* 页头：左标题 + 右刷新 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <h1>数据看板</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            酒谱与材料库的数据总览 · {new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>
        <Button icon={<ReloadOutlined />} onClick={loadStats} loading={loading}>
          刷新数据
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} md={8} xl={Math.floor(24 / statCards.length)} key={card.title}>
            <Card styles={{ body: { padding: '20px 20px' } }} style={{ height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 12,
                    background: `${card.tint}1A`,
                    color: card.tint,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.2 }}>
                    {card.value}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区 */}
      <Spin spinning={loading && !stats}>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="酒谱基酒分布" size="small" styles={{ header: { borderBottom: 'none' } }}>
              <Chart option={baseSpiritOption} height={300} loading={loading} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="酒谱难度分布" size="small" styles={{ header: { borderBottom: 'none' } }}>
              <Chart option={difficultyOption} height={300} loading={loading} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="调制方法分布" size="small" styles={{ header: { borderBottom: 'none' } }}>
              <Chart option={methodOption} height={280} loading={loading} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="材料库分类构成" size="small" styles={{ header: { borderBottom: 'none' } }}>
              <Chart option={ingredientCategoryOption} height={280} loading={loading} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="材料使用频次 TOP10" size="small" styles={{ header: { borderBottom: 'none' } }}>
              <Chart option={topIngredientsOption} height={300} loading={loading} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="各分类下酒谱数量" size="small" styles={{ header: { borderBottom: 'none' } }}>
              <Chart option={categoryCocktailsOption} height={300} loading={loading} />
            </Card>
          </Col>
        </Row>

        {/* 最新酒谱 */}
        <Card title="最新添加的酒谱" size="small" style={{ marginTop: 16 }}>
          <Table
            columns={recentColumns}
            dataSource={stats?.recentCocktails || []}
            rowKey="id"
            size="small"
            loading={loading}
            pagination={false}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default Dashboard;
