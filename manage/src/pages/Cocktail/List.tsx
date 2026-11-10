import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Input,
  Select,
  Image,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getCocktailList,
  deleteCocktail,
} from '../../api/cocktail';
import type { Cocktail, CocktailListParams } from '../../api/cocktail';
import { spiritIconMap, CocktailGlassIcon, type SpiritName } from '../../theme/icons/SpiritIcons';

const { Search } = Input;

/** 封面临时预览用的后端静态资源地址 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const STATIC_BASE = API_BASE.replace(/\/api\/v1\/?$/, '');

const CocktailList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Cocktail[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<CocktailListParams>({
    page: 1,
    pageSize: 10,
    status: 'all',
  });

  // 基酒线性图标
  const getBaseSpiritIcon = (baseSpirit?: string) => {
    const Icon = baseSpirit ? spiritIconMap[baseSpirit as SpiritName] : undefined;
    const Cmp = Icon || CocktailGlassIcon;
    return <Cmp size={20} style={{ color: 'var(--whisky-300)' }} />;
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getCocktailList(searchParams);
      setDataSource(res.data?.list || []);
      setTotal(res.data?.total || 0);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个酒谱吗？',
      onOk: async () => {
        try {
          await deleteCocktail(id);
          message.success('删除成功');
          loadData();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const columns: ColumnsType<Cocktail> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '封面',
      dataIndex: 'cover',
      width: 90,
      render: (cover) =>
        cover ? (
          <Image
            src={STATIC_BASE + cover}
            width={56}
            height={56}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        ) : (
          <span style={{ color: '#bbb' }}>—</span>
        ),
    },
    {
      title: '酒谱名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{getBaseSpiritIcon(record.baseSpirit)}</span>
          <div>
            <div>{text}</div>
            {record.nameEn && (
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{record.nameEn}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '基酒',
      dataIndex: 'baseSpirit',
      width: 100,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 100,
      render: (difficulty) => {
        const difficultyMap: Record<number, { text: string; color: string }> = {
          1: { text: '简单', color: 'green' },
          2: { text: '中等', color: 'orange' },
          3: { text: '困难', color: 'red' },
        };
        const info = difficultyMap[difficulty] || { text: '未知', color: 'default' };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '口味标签',
      dataIndex: 'tasteTags',
      width: 150,
      render: (tags) =>
        tags?.split(',').map((tag: string) => <Tag key={tag}>{tag}</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/cocktails/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id!)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Search
            placeholder="搜索酒谱名称"
            allowClear
            onSearch={(value) =>
              setSearchParams({ ...searchParams, name: value, page: 1 })
            }
            style={{ width: 250 }}
          />
          <Select
            placeholder="选择难度"
            allowClear
            style={{ width: 120 }}
            value={searchParams.difficulty}
            onChange={(value) =>
              setSearchParams({ ...searchParams, difficulty: value, page: 1 })
            }
          >
            <Select.Option value={1}>简单</Select.Option>
            <Select.Option value={2}>中等</Select.Option>
            <Select.Option value={3}>困难</Select.Option>
          </Select>
          <Select
            style={{ width: 120 }}
            value={searchParams.status ?? 'all'}
            onChange={(value) =>
              setSearchParams({ ...searchParams, status: value ?? 'all', page: 1 })
            }
          >
            <Select.Option value="all">全部状态</Select.Option>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/cocktails/create')}
        >
          添加酒谱
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          current: searchParams.page,
          pageSize: searchParams.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) =>
            setSearchParams({ ...searchParams, page, pageSize }),
        }}
      />
    </div>
  );
};

export default CocktailList;
