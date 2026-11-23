import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, Checkbox,
  InputNumber, Tag, Tabs, Switch, message, Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getConvDrinks, createConvDrink, updateConvDrink, deleteConvDrink, updateConvDrinkStatus,
  getConvMaterials, createConvMaterial, updateConvMaterial, deleteConvMaterial,
  getConvPitfalls, createConvPitfall, updateConvPitfall, deleteConvPitfall,
} from '../../api/convenience';
import type { ConvDrink, ConvMaterial, ConvPitfall } from '../../api/convenience';

const SCENE_OPTIONS = [
  { label: '微醺', value: 'tipsy' },
  { label: '无酒精', value: 'zero' },
  { label: '宿舍', value: 'dorm' },
  { label: '露营', value: 'camping' },
  { label: '下午茶', value: 'tea' },
];

const SCENE_LABEL: Record<string, string> = {
  tipsy: '微醺', zero: '无酒精', dorm: '宿舍', camping: '露营', tea: '下午茶',
};

const CATEGORY_OPTIONS = [
  '碳酸饮料', '果汁', '水果', '乳品', '茶饮咖啡', '功能饮料', '调味', '其他', '酒类',
].map(v => ({ label: v, value: v }));

const GRADIENT_OPTIONS = [
  { label: '柠檬黄', value: 'linear-gradient(135deg,#FFF8E1,#FFE082)' },
  { label: '蜜桃粉', value: 'linear-gradient(135deg,#FCE4EC,#F8BBD0)' },
  { label: '薄荷绿', value: 'linear-gradient(135deg,#E8F5E9,#A5D6A7)' },
  { label: '葡萄紫', value: 'linear-gradient(135deg,#F3E5F5,#CE93D8)' },
  { label: '可可棕', value: 'linear-gradient(135deg,#EFEBE9,#A1887F)' },
  { label: '橘子橙', value: 'linear-gradient(135deg,#FFF3E0,#FFCC80)' },
];

/* ==================== 配方管理 ==================== */
const DrinkPanel = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ConvDrink[]>([]);
  const [materials, setMaterials] = useState<ConvMaterial[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      const [drinkRes, matRes] = await Promise.all([getConvDrinks(), getConvMaterials()]);
      setDataSource(drinkRes.data || []);
      setMaterials(matRes.data || []);
    } catch (e: any) {
      message.error(e.message || '加载配方失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      emoji: '🍹', cost: 10, steps: 2, status: 1, sortOrder: 0,
      gradient: GRADIENT_OPTIONS[0].value,
      materials: [{ name: '', amount: '' }],
      instructions: [''],
      scenes: [],
    });
    setModalVisible(true);
  };

  const handleEdit = (record: ConvDrink) => {
    setEditingId(record.id!);
    form.setFieldsValue({
      ...record,
      materials: record.materials?.length ? record.materials : [{ name: '', amount: '' }],
      instructions: record.instructions?.length ? record.instructions : [''],
      scenes: record.scenes || [],
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后小程序端将不再展示该配方，确定继续吗？',
      onOk: async () => {
        try {
          await deleteConvDrink(id);
          message.success('删除成功');
          loadData();
        } catch (e: any) {
          message.error(e.message || '删除失败');
        }
      },
    });
  };

  const handleStatus = async (id: number, status: number) => {
    try {
      await updateConvDrinkStatus(id, status);
      message.success('状态已更新');
      loadData();
    } catch (e: any) {
      message.error(e.message || '状态更新失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload: ConvDrink = {
        ...values,
        materials: values.materials || [],
        instructions: values.instructions || [],
        scenes: values.scenes || [],
      };
      if (editingId) {
        await updateConvDrink(editingId, payload);
        message.success('更新成功');
      } else {
        await createConvDrink(payload);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadData();
    } catch (e: any) {
      message.error(e.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ConvDrink> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    {
      title: '配方', dataIndex: 'name', width: 160,
      render: (name: string, record) => <span>{record.emoji} {name}</span>,
    },
    { title: '英文名', dataIndex: 'nameEn', width: 150, ellipsis: true },
    { title: '成本', dataIndex: 'cost', width: 80, render: (v) => `¥${v}` },
    { title: '标签', dataIndex: 'tag', width: 100 },
    {
      title: '场景', dataIndex: 'scenes', width: 180,
      render: (scenes: string[]) => (scenes || []).map(s => (
        <Tag key={s} color="green" style={{ marginBottom: 2 }}>{SCENE_LABEL[s] || s}</Tag>
      )),
    },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (status: number, record) => (
        <Switch checked={status === 1} onChange={(checked) => handleStatus(record.id!, checked ? 1 : 0)} />
      ),
    },
    { title: '排序', dataIndex: 'sortOrder', width: 70 },
    {
      title: '操作', key: 'action', width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#888' }}>共 {dataSource.length} 款配方，禁用后小程序端不再展示</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加配方</Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1100 }} />

      <Modal title={editingId ? '编辑配方' : '添加配方'} open={modalVisible} width={760}
        onOk={handleSubmit} onCancel={() => setModalVisible(false)} confirmLoading={loading}
        destroyOnClose>
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 12 }}>
            <Form.Item label="配方名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder="如：柠檬茶炸弹" />
            </Form.Item>
            <Form.Item label="英文名" name="nameEn"><Input placeholder="Vita Vodka Tea" /></Form.Item>
            <Form.Item label="Emoji" name="emoji"><Input placeholder="🍋" /></Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12 }}>
            <Form.Item label="卡片配色" name="gradient">
              <Select options={GRADIENT_OPTIONS} allowClear placeholder="选择渐变" />
            </Form.Item>
            <Form.Item label="成本(元)" name="cost"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item label="步骤数" name="steps"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item label="排序" name="sortOrder"><InputNumber style={{ width: '100%' }} /></Form.Item>
          </div>
          <Form.Item label="标签" name="tag"><Input placeholder="如：人气、经典、零失败" /></Form.Item>
          <Form.Item label="适用场景" name="scenes">
            <Checkbox.Group options={SCENE_OPTIONS} />
          </Form.Item>
          <Form.Item label="材料清单">
            <Form.List name="materials">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(field => (
                    <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item name={[field.name, 'name']} rules={[{ required: true, message: '请选择材料' }]} style={{ marginBottom: 0 }}>
                        <Select style={{ width: 200 }} showSearch optionFilterProp="label"
                          placeholder="选择材料"
                          options={materials.map(m => ({ label: m.name, value: m.name }))} />
                      </Form.Item>
                      <Form.Item name={[field.name, 'amount']} style={{ marginBottom: 0 }}>
                        <Input placeholder="用量，如 1瓶 / 100ml" style={{ width: 200 }} />
                      </Form.Item>
                      <Button danger onClick={() => remove(field.name)}>删除</Button>
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add({ name: '', amount: '' })} block icon={<PlusOutlined />}>添加材料</Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label="制作步骤">
            <Form.List name="instructions">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(field => (
                    <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item name={field.name} style={{ marginBottom: 0, width: 520 }}>
                        <Input placeholder="步骤描述" />
                      </Form.Item>
                      <Button danger onClick={() => remove(field.name)}>删除</Button>
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>添加步骤</Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label="小贴士" name="tips"><Input.TextArea rows={3} placeholder="给玩家的提示" /></Form.Item>
          <Form.Item label="状态" name="status" initialValue={1}>
            <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

/* ==================== 材料库管理 ==================== */
const MaterialPanel = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ConvMaterial[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getConvMaterials();
      setDataSource(res.data || []);
    } catch (e: any) {
      message.error(e.message || '加载材料失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ emoji: '🥤', sortOrder: 0 });
    setModalVisible(true);
  };

  const handleEdit = (record: ConvMaterial) => {
    setEditingId(record.id!);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后请检查是否有配方仍在引用该材料。确定继续吗？',
      onOk: async () => {
        try {
          await deleteConvMaterial(id);
          message.success('删除成功');
          loadData();
        } catch (e: any) {
          message.error(e.message || '删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingId) {
        await updateConvMaterial(editingId, values);
        message.success('更新成功');
      } else {
        await createConvMaterial(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadData();
    } catch (e: any) {
      message.error(e.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ConvMaterial> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '材料名称', dataIndex: 'name', width: 160 },
    { title: 'Emoji', dataIndex: 'emoji', width: 80 },
    { title: '分类', dataIndex: 'category', width: 130 },
    { title: '排序', dataIndex: 'sortOrder', width: 80 },
    {
      title: '操作', key: 'action', width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#888' }}>共 {dataSource.length} 种材料，配方中的材料从这里选择</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加材料</Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }} />
      <Modal title={editingId ? '编辑材料' : '添加材料'} open={modalVisible}
        onOk={handleSubmit} onCancel={() => setModalVisible(false)} confirmLoading={loading}
        destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item label="材料名称" name="name" rules={[{ required: true, message: '请输入材料名称' }]}>
            <Input placeholder="如：维他柠檬茶" />
          </Form.Item>
          <Form.Item label="Emoji" name="emoji"><Input placeholder="🍋" /></Form.Item>
          <Form.Item label="分类" name="category">
            <Select options={CATEGORY_OPTIONS} allowClear placeholder="选择或留空" />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder"><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

/* ==================== 避坑指南管理 ==================== */
const PitfallPanel = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ConvPitfall[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getConvPitfalls();
      setDataSource(res.data || []);
    } catch (e: any) {
      message.error(e.message || '加载避坑指南失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ emoji: '⚠️', sortOrder: 0 });
    setModalVisible(true);
  };

  const handleEdit = (record: ConvPitfall) => {
    setEditingId(record.id!);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定删除这条避坑指南吗？',
      onOk: async () => {
        try {
          await deleteConvPitfall(id);
          message.success('删除成功');
          loadData();
        } catch (e: any) {
          message.error(e.message || '删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingId) {
        await updateConvPitfall(editingId, values);
        message.success('更新成功');
      } else {
        await createConvPitfall(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadData();
    } catch (e: any) {
      message.error(e.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ConvPitfall> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '图标', dataIndex: 'emoji', width: 70 },
    { title: '标题', dataIndex: 'title', width: 180 },
    { title: '说明', dataIndex: 'desc', ellipsis: true },
    { title: '排序', dataIndex: 'sortOrder', width: 80 },
    {
      title: '操作', key: 'action', width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#888' }}>共 {dataSource.length} 条避坑指南</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加指南</Button>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }} />
      <Modal title={editingId ? '编辑指南' : '添加指南'} open={modalVisible}
        onOk={handleSubmit} onCancel={() => setModalVisible(false)} confirmLoading={loading}
        destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="如：野格红牛别贪杯" />
          </Form.Item>
          <Form.Item label="Emoji" name="emoji"><Input placeholder="⚠️" /></Form.Item>
          <Form.Item label="说明" name="desc">
            <Input.TextArea rows={4} placeholder="写清楚为什么要避开这个组合" />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder"><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ConvenienceManage = () => {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>便利店调酒管理</h2>
        <p style={{ color: '#888', margin: '6px 0 0' }}>
          在这里维护小程序「便利店调酒」模式的内容，保存后小程序端会自动同步，无需修改代码。
        </p>
      </div>
      <Tabs items={[
        { key: 'drinks', label: '配方管理', children: <DrinkPanel /> },
        { key: 'materials', label: '材料库', children: <MaterialPanel /> },
        { key: 'pitfalls', label: '避坑指南', children: <PitfallPanel /> },
      ]} />
    </div>
  );
};

export default ConvenienceManage;
