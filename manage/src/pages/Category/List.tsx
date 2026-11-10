import { useEffect, useState } from 'react';
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
  Tabs,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/category';
import type { Category } from '../../api/category';
import IconPicker from '../../theme/IconPicker';

const CategoryList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('base_spirit');
  const [statusFilter, setStatusFilter] = useState<number | string>('all');
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [activeTab, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getCategoryList({ type: activeTab, status: statusFilter });
      setDataSource(res.data || []);
    } catch (error: any) {
      message.error(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ type: activeTab });
    setModalVisible(true);
  };

  const handleEdit = (record: Category) => {
    setEditingId(record.id!);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个分类吗？',
      onOk: async () => {
        try {
          await deleteCategory(id);
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
        await updateCategory(editingId, values);
        message.success('更新成功');
      } else {
        await createCategory(values);
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

  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '示例图片',
      dataIndex: 'icon',
      width: 100,
      render: (icon: string) =>
        icon ? (
          <img
            src={icon}
            alt="示例图片"
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          '-'
        ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (type) => {
        const typeMap: Record<string, string> = {
          base_spirit: '基酒分类',
          taste: '口味分类',
          occasion: '场合分类',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 80,
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

  const tabItems = [
    { key: 'base_spirit', label: '基酒分类' },
    { key: 'taste', label: '口味分类' },
    { key: 'occasion', label: '场合分类' },
  ];

  return (
    <div>
      <div
        style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}
      >
        <Space size={12}>
          <h2 style={{ margin: 0 }}>分类管理</h2>
          <Select
            style={{ width: 120 }}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value ?? 'all')}
          >
            <Select.Option value="all">全部状态</Select.Option>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加分类
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        items={tabItems}
        onChange={setActiveTab}
      />

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingId ? '编辑分类' : '添加分类'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="如：朗姆酒、清爽" />
          </Form.Item>

          <Form.Item
            label="分类类型"
            name="type"
            rules={[{ required: true, message: '请选择分类类型' }]}
          >
            <Select disabled={!!editingId}>
              <Select.Option value="base_spirit">基酒分类</Select.Option>
              <Select.Option value="taste">口味分类</Select.Option>
              <Select.Option value="occasion">场合分类</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="分类图标" name="icon" trigger="onChange" valuePropName="value">
            <IconPicker />
          </Form.Item>

          <Form.Item label="排序" name="sortOrder" initialValue={0}>
            <Input type="number" placeholder="数字越小越靠前" />
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

export default CategoryList;
