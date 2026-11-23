import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Tabs, Upload, Image, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  getDrinks, createDrink, updateDrink, deleteDrink,
  getMaterials, createMaterial, updateMaterial, deleteMaterial,
  getPitfalls, createPitfall, updatePitfall, deletePitfall,
  uploadConvenienceImage,
  type ConvenienceDrink, type ConvenienceMaterial, type ConveniencePitfall,
} from '../../api/convenience';

const { TextArea } = Input;
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const STATIC_BASE = API_BASE.replace(/\/api\/v1\/?$/, '');

// 表格可用高度：扣掉顶栏、内边距、Tab、按钮区和分页
const getScrollY = () => Math.max(320, window.innerHeight - 420);

/** 图片上传：走带 token 的接口，表单存相对路径，预览拼后端域名 */
const ImageUpload: React.FC<{ value?: string; onChange?: (url: string) => void }> = ({ value, onChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFileList(value ? [{ uid: '-1', name: 'image', status: 'done', url: STATIC_BASE + value }] : []);
  }, [value]);

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      maxCount={1}
      accept="image/*"
      customRequest={async ({ file, onSuccess, onError }: any) => {
        try {
          setUploading(true);
          const res = await uploadConvenienceImage(file as File);
          const url = res.data?.url || res.data?.data?.url || '';
          if (!url) throw new Error('上传返回异常');
          setFileList([{ uid: '-1', name: (file as File).name, status: 'done', url: STATIC_BASE + url }]);
          onChange?.(url);
          onSuccess?.(res);
          message.success('图片上传成功');
        } catch (err: any) {
          message.error(err.message || '上传失败');
          onError?.(err);
        } finally {
          setUploading(false);
        }
      }}
      onChange={({ fileList: list }) => {
        if (list.every((f) => f.status === 'done')) setFileList(list);
      }}
      onRemove={() => {
        onChange?.('');
        return true;
      }}
    >
      {fileList.length === 0 && (
        <div>
          {uploading ? <span>上传中…</span> : <><PlusOutlined /><div style={{ marginTop: 8 }}>上传图片</div></>}
        </div>
      )}
    </Upload>
  );
};

const indexColumn = (page: number, pageSize: number) => ({
  title: '序号',
  key: 'index',
  width: 70,
  render: (_: unknown, __: unknown, index: number) => (page - 1) * pageSize + index + 1,
});

const imageColumn = (width = 100) => ({
  title: '图片',
  dataIndex: 'image',
  width,
  render: (image?: string) => image ? (
    <Image src={STATIC_BASE + image} width={56} height={56} preview={false} style={{ objectFit: 'cover' as const, borderRadius: 8 }} />
  ) : <span style={{ color: '#bbb' }}>—</span>,
});

const paginationOf = (page: number, pageSize: number, total: number, onChange: (p: number, s: number) => void) => ({
  current: page,
  pageSize,
  total,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
  onChange,
});

const ConvenienceManage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('drinks');
  const [scrollY, setScrollY] = useState(getScrollY());

  useEffect(() => {
    const onResize = () => setScrollY(getScrollY());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 配方
  const [drinks, setDrinks] = useState<ConvenienceDrink[]>([]);
  const [drinksLoading, setDrinksLoading] = useState(false);
  const [drinkPage, setDrinkPage] = useState(1);
  const [drinkPageSize, setDrinkPageSize] = useState(10);
  const [drinkTotal, setDrinkTotal] = useState(0);
  const [drinkModalVisible, setDrinkModalVisible] = useState(false);
  const [drinkForm] = Form.useForm();
  const [editingDrink, setEditingDrink] = useState<ConvenienceDrink | null>(null);

  // 材料
  const [materials, setMaterials] = useState<ConvenienceMaterial[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialPage, setMaterialPage] = useState(1);
  const [materialPageSize, setMaterialPageSize] = useState(10);
  const [materialTotal, setMaterialTotal] = useState(0);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [materialForm] = Form.useForm();
  const [editingMaterial, setEditingMaterial] = useState<ConvenienceMaterial | null>(null);

  // 避坑指南
  const [pitfalls, setPitfalls] = useState<ConveniencePitfall[]>([]);
  const [pitfallsLoading, setPitfallsLoading] = useState(false);
  const [pitfallPage, setPitfallPage] = useState(1);
  const [pitfallPageSize, setPitfallPageSize] = useState(10);
  const [pitfallTotal, setPitfallTotal] = useState(0);
  const [pitfallModalVisible, setPitfallModalVisible] = useState(false);
  const [pitfallForm] = Form.useForm();
  const [editingPitfall, setEditingPitfall] = useState<ConveniencePitfall | null>(null);

  const loadDrinks = async () => {
    setDrinksLoading(true);
    try {
      const res = await getDrinks({ page: drinkPage, pageSize: drinkPageSize });
      setDrinks(res.data?.list || []);
      setDrinkTotal(res.data?.total || 0);
    } catch {
      message.error('加载配方列表失败');
    } finally {
      setDrinksLoading(false);
    }
  };

  const loadMaterials = async () => {
    setMaterialsLoading(true);
    try {
      const res = await getMaterials({ page: materialPage, pageSize: materialPageSize });
      setMaterials(res.data?.list || []);
      setMaterialTotal(res.data?.total || 0);
    } catch {
      message.error('加载材料列表失败');
    } finally {
      setMaterialsLoading(false);
    }
  };

  const loadPitfalls = async () => {
    setPitfallsLoading(true);
    try {
      const res = await getPitfalls({ page: pitfallPage, pageSize: pitfallPageSize });
      setPitfalls(res.data?.list || []);
      setPitfallTotal(res.data?.total || 0);
    } catch {
      message.error('加载避坑指南列表失败');
    } finally {
      setPitfallsLoading(false);
    }
  };

  useEffect(() => { loadDrinks(); }, [drinkPage, drinkPageSize]);
  useEffect(() => { loadMaterials(); }, [materialPage, materialPageSize]);
  useEffect(() => { loadPitfalls(); }, [pitfallPage, pitfallPageSize]);

  // ===== 配方 =====

  const openDrinkForm = (record?: ConvenienceDrink) => {
    setEditingDrink(record || null);
    drinkForm.resetFields();
    if (record) {
      drinkForm.setFieldsValue({
        ...record,
        scenes: record.scenes?.join('\n') || '',
        materials: JSON.stringify(record.materials || [], null, 2),
        instructions: JSON.stringify(record.instructions || [], null, 2),
      });
    } else {
      drinkForm.setFieldsValue({ isActive: true, emoji: '🍹', cost: 0, steps: 0 });
    }
    setDrinkModalVisible(true);
  };

  const saveDrink = async () => {
    try {
      const values = await drinkForm.validateFields();
      const payload: ConvenienceDrink = {
        name: values.name,
        emoji: values.emoji || '🍹',
        cost: values.cost ?? 0,
        steps: values.steps ?? 0,
        nameEn: values.nameEn || '',
        gradient: values.gradient || '',
        tag: values.tag || '',
        tips: values.tips || '',
        image: values.image || '',
        isActive: values.isActive ? 1 : 0,
        scenes: values.scenes ? values.scenes.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
        materials: values.materials ? JSON.parse(values.materials) : [],
        instructions: values.instructions ? JSON.parse(values.instructions) : [],
      };
      if (editingDrink?.id) {
        await updateDrink(editingDrink.id, payload);
        message.success('更新成功');
      } else {
        await createDrink(payload);
        message.success('创建成功');
      }
      setDrinkModalVisible(false);
      loadDrinks();
    } catch (err: any) {
      message.error(err?.message?.includes('JSON') ? 'JSON 格式错误，请检查输入' : (editingDrink ? '更新失败' : '创建失败'));
    }
  };

  const removeDrink = (id?: number) => {
    if (!id) return;
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个配方吗？',
      onOk: async () => {
        try {
          await deleteDrink(id);
          message.success('删除成功');
          loadDrinks();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const drinkColumns: ColumnsType<ConvenienceDrink> = [
    indexColumn(drinkPage, drinkPageSize),
    imageColumn(),
    { title: '名称', dataIndex: 'name', width: 140 },
    { title: '英文名', dataIndex: 'nameEn', width: 140 },
    { title: 'Emoji', dataIndex: 'emoji', width: 70 },
    { title: '成本', dataIndex: 'cost', width: 80, render: (v: number) => `¥${v}` },
    { title: '步骤', dataIndex: 'steps', width: 70 },
    { title: '标签', dataIndex: 'tag', width: 100 },
    { title: '状态', dataIndex: 'isActive', width: 80, render: (v: number) => v === 1 ? '启用' : '停用' },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openDrinkForm(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeDrink(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  // ===== 材料 =====

  const openMaterialForm = (record?: ConvenienceMaterial) => {
    setEditingMaterial(record || null);
    materialForm.resetFields();
    if (record) materialForm.setFieldsValue(record);
    setMaterialModalVisible(true);
  };

  const saveMaterial = async () => {
    try {
      const values = await materialForm.validateFields();
      const payload: ConvenienceMaterial = {
        name: values.name,
        emoji: values.emoji || '🧊',
        category: values.category,
        image: values.image || '',
        sortOrder: values.sortOrder ?? 0,
      };
      if (editingMaterial?.id) {
        await updateMaterial(editingMaterial.id, payload);
        message.success('更新成功');
      } else {
        await createMaterial(payload);
        message.success('创建成功');
      }
      setMaterialModalVisible(false);
      loadMaterials();
    } catch {
      message.error(editingMaterial ? '更新失败' : '创建失败');
    }
  };

  const removeMaterial = (id?: number) => {
    if (!id) return;
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个材料吗？',
      onOk: async () => {
        try {
          await deleteMaterial(id);
          message.success('删除成功');
          loadMaterials();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const materialColumns: ColumnsType<ConvenienceMaterial> = [
    indexColumn(materialPage, materialPageSize),
    imageColumn(),
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: 'Emoji', dataIndex: 'emoji', width: 80 },
    { title: '分类', dataIndex: 'category', width: 120 },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openMaterialForm(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeMaterial(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  // ===== 避坑指南 =====

  const openPitfallForm = (record?: ConveniencePitfall) => {
    setEditingPitfall(record || null);
    pitfallForm.resetFields();
    if (record) pitfallForm.setFieldsValue(record);
    setPitfallModalVisible(true);
  };

  const savePitfall = async () => {
    try {
      const values = await pitfallForm.validateFields();
      const payload: ConveniencePitfall = {
        title: values.title,
        emoji: values.emoji || '⚠️',
        description: values.description,
        sortOrder: values.sortOrder ?? 0,
      };
      if (editingPitfall?.id) {
        await updatePitfall(editingPitfall.id, payload);
        message.success('更新成功');
      } else {
        await createPitfall(payload);
        message.success('创建成功');
      }
      setPitfallModalVisible(false);
      loadPitfalls();
    } catch {
      message.error(editingPitfall ? '更新失败' : '创建失败');
    }
  };

  const removePitfall = (id?: number) => {
    if (!id) return;
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条避坑指南吗？',
      onOk: async () => {
        try {
          await deletePitfall(id);
          message.success('删除成功');
          loadPitfalls();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const pitfallColumns: ColumnsType<ConveniencePitfall> = [
    indexColumn(pitfallPage, pitfallPageSize),
    { title: 'Emoji', dataIndex: 'emoji', width: 80 },
    { title: '标题', dataIndex: 'title', width: 200 },
    { title: '说明', dataIndex: 'description', ellipsis: true },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openPitfallForm(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removePitfall(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="配方管理" key="drinks">
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrinkForm()}>添加配方</Button>
          </div>
          <Table
            columns={drinkColumns}
            dataSource={drinks}
            rowKey="id"
            loading={drinksLoading}
            size="middle"
            scroll={{ y: scrollY, x: 1000 }}
            pagination={paginationOf(drinkPage, drinkPageSize, drinkTotal, (p, s) => {
              setDrinkPage(p); setDrinkPageSize(s);
            })}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="材料库" key="materials">
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openMaterialForm()}>添加材料</Button>
          </div>
          <Table
            columns={materialColumns}
            dataSource={materials}
            rowKey="id"
            loading={materialsLoading}
            size="middle"
            scroll={{ y: scrollY }}
            pagination={paginationOf(materialPage, materialPageSize, materialTotal, (p, s) => {
              setMaterialPage(p); setMaterialPageSize(s);
            })}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="避坑指南" key="pitfalls">
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openPitfallForm()}>添加避坑指南</Button>
          </div>
          <Table
            columns={pitfallColumns}
            dataSource={pitfalls}
            rowKey="id"
            loading={pitfallsLoading}
            size="middle"
            scroll={{ y: scrollY }}
            pagination={paginationOf(pitfallPage, pitfallPageSize, pitfallTotal, (p, s) => {
              setPitfallPage(p); setPitfallPageSize(s);
            })}
          />
        </Tabs.TabPane>
      </Tabs>

      {/* 配方编辑弹窗 */}
      <Modal
        title={editingDrink ? '编辑配方' : '添加配方'}
        open={drinkModalVisible}
        onOk={saveDrink}
        onCancel={() => setDrinkModalVisible(false)}
        width={700}
        okText="确定"
        cancelText="取消"
      >
        <Form form={drinkForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入配方名称' }]}><Input placeholder="如：威士忌可乐" /></Form.Item>
          <Form.Item name="nameEn" label="英文名"><Input placeholder="Whiskey Cola" /></Form.Item>
          <Form.Item name="emoji" label="Emoji" rules={[{ required: true, message: '请输入 Emoji' }]}><Input placeholder="🍹" /></Form.Item>
          <Form.Item name="gradient" label="渐变样式"><Input placeholder="linear-gradient(...)" /></Form.Item>
          <Form.Item name="tag" label="标签"><Input placeholder="如：经典" /></Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="cost" label="成本（元）" style={{ flex: 1 }}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="steps" label="步骤数" style={{ flex: 1 }}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="isActive" label="启用" valuePropName="checked" style={{ flex: 1 }}><Switch /></Form.Item>
          </div>
          <Form.Item name="scenes" label="适用场景"><TextArea rows={2} placeholder="每行一个场景" /></Form.Item>
          <Form.Item name="materials" label="材料配比 (JSON 数组)"><TextArea rows={3} placeholder={'[{"name":"威士忌","amount":"50ml"}]'} /></Form.Item>
          <Form.Item name="instructions" label="制作步骤 (JSON 数组)"><TextArea rows={3} placeholder={'["加冰","倒入威士忌","倒满可乐"]'} /></Form.Item>
          <Form.Item name="tips" label="小贴士"><TextArea rows={2} /></Form.Item>
          <Form.Item name="image" label="配方图片"><ImageUpload /></Form.Item>
        </Form>
      </Modal>

      {/* 材料编辑弹窗 */}
      <Modal
        title={editingMaterial ? '编辑材料' : '添加材料'}
        open={materialModalVisible}
        onOk={saveMaterial}
        onCancel={() => setMaterialModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={materialForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入材料名称' }]}><Input placeholder="如：威士忌" /></Form.Item>
          <Form.Item name="emoji" label="Emoji" rules={[{ required: true, message: '请输入 Emoji' }]}><Input placeholder="🥃" /></Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请输入材料分类' }]}><Input placeholder="如：烈酒、饮料、配料" /></Form.Item>
          <Form.Item name="sortOrder" label="排序"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="image" label="材料图片"><ImageUpload /></Form.Item>
        </Form>
      </Modal>

      {/* 避坑指南编辑弹窗 */}
      <Modal
        title={editingPitfall ? '编辑避坑指南' : '添加避坑指南'}
        open={pitfallModalVisible}
        onOk={savePitfall}
        onCancel={() => setPitfallModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={pitfallForm} layout="vertical">
          <Form.Item name="emoji" label="Emoji" rules={[{ required: true, message: '请输入 Emoji' }]}><Input placeholder="⚠️" /></Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}><Input placeholder="如：千万不要混饮过度" /></Form.Item>
          <Form.Item name="description" label="说明" rules={[{ required: true, message: '请输入说明' }]}><TextArea rows={5} /></Form.Item>
          <Form.Item name="sortOrder" label="排序"><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConvenienceManage;
