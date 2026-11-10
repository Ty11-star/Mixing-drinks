import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getIngredientList,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../../api/ingredient';
import type { Ingredient } from '../../api/ingredient';
import {
  CocktailGlassIcon,
  JiggerIcon,
  CoasterIcon,
} from '../../theme/icons/SpiritIcons';

const { Search } = Input;

const IngredientList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Ingredient[]>([]);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    name: '',
    category: '',
    status: 'all' as number | string,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getIngredientList(searchParams);
      setDataSource(res.data?.list || res.data || []);
      setTotal(res.data?.total || res.data?.length || 0);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Ingredient) => {
    setEditingId(record.id!);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个材料吗？',
      onOk: async () => {
        try {
          await deleteIngredient(id);
          message.success('删除成功');
          loadData();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingId) {
        await updateIngredient(editingId, values);
        message.success('更新成功');
      } else {
        await createIngredient(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const categoryMap: Record<string, { text: string; color: string; icon: ReactNode }> = {
    base_spirit: { text: '基酒', color: 'blue', icon: <CocktailGlassIcon size={20} style={{ color: 'var(--whisky-300)' }} /> },
    liqueur: { text: '利口酒', color: 'purple', icon: <CocktailGlassIcon size={20} style={{ color: '#b99ad9' }} /> },
    juice: { text: '果汁/饮料', color: 'green', icon: <JiggerIcon size={20} style={{ color: 'var(--ice-300)' }} /> },
    syrup: { text: '糖浆', color: 'orange', icon: <JiggerIcon size={20} style={{ color: 'var(--whisky-300)' }} /> },
    garnish: { text: '装饰', color: 'cyan', icon: <CoasterIcon size={20} style={{ color: '#5bc08a' }} /> },
    other: { text: '其他', color: 'default', icon: <CoasterIcon size={20} style={{ color: 'var(--text-muted)' }} /> },
  };

  const columns: ColumnsType<Ingredient> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '材料名称',
      dataIndex: 'name',
      render: (text, record) => {
        const categoryInfo =
          categoryMap[record.category] ||
          { icon: <CoasterIcon size={20} style={{ color: 'var(--text-muted)' }} /> };
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{categoryInfo.icon}</span>
            <div>
              <div>{text}</div>
              {record.nameEn && (
                <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{record.nameEn}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      render: (category) => {
        const info = categoryMap[category] || { text: category, color: 'default' };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '常用单位',
      dataIndex: 'commonUnit',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
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
            onClick={() => handleEdit(record)}
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
      <div
        style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}
      >
        <Space>
          <Search
            placeholder="搜索材料名称"
            allowClear
            onSearch={(value) =>
              setSearchParams({ ...searchParams, name: value, page: 1 })
            }
            style={{ width: 250 }}
          />
          <Select
            placeholder="选择分类"
            allowClear
            style={{ width: 150 }}
            onChange={(value) =>
              setSearchParams({ ...searchParams, category: value, page: 1 })
            }
          >
            <Select.Option value="base_spirit">基酒</Select.Option>
            <Select.Option value="liqueur">利口酒</Select.Option>
            <Select.Option value="juice">果汁/饮料</Select.Option>
            <Select.Option value="syrup">糖浆</Select.Option>
            <Select.Option value="garnish">装饰</Select.Option>
            <Select.Option value="other">其他</Select.Option>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加材料
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

      <Modal
        title={editingId ? '编辑材料' : '添加材料'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="材料名称"
            name="name"
            rules={[{ required: true, message: '请输入材料名称' }]}
          >
            <Input placeholder="如：白朗姆酒" />
          </Form.Item>

          <Form.Item label="英文名称" name="nameEn">
            <Input placeholder="如：White Rum" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select>
              <Select.Option value="base_spirit">基酒</Select.Option>
              <Select.Option value="liqueur">利口酒</Select.Option>
              <Select.Option value="juice">果汁/饮料</Select.Option>
              <Select.Option value="syrup">糖浆</Select.Option>
              <Select.Option value="garnish">装饰</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="常用单位" name="commonUnit" initialValue="ml">
            <Input placeholder="如：ml, 片, 个" />
          </Form.Item>

          <Form.Item label="材料说明" name="description">
            <Input.TextArea rows={3} placeholder="材料的介绍或说明" />
          </Form.Item>

          <Form.Item label="状态" name="status" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IngredientList;
