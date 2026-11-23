import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Tabs, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  getDrinks, createDrink, updateDrink, deleteDrink,
  getMaterials, createMaterial, updateMaterial, deleteMaterial,
  getPitfalls, createPitfall, updatePitfall, deletePitfall,
  type ConvenienceDrink, type ConvenienceMaterial, type ConveniencePitfall
} from '../../api/convenience';

const { TextArea } = Input;
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ConvenienceManage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('drinks');

  // 配方相关状态
  const [drinks, setDrinks] = useState<ConvenienceDrink[]>([]);
  const [drinksLoading, setDrinksLoading] = useState(false);
  const [drinkModalVisible, setDrinkModalVisible] = useState(false);
  const [drinkForm] = Form.useForm();
  const [editingDrink, setEditingDrink] = useState<ConvenienceDrink | null>(null);
  const [drinkFileList, setDrinkFileList] = useState<UploadFile[]>([]);

  // 材料相关状态
  const [materials, setMaterials] = useState<ConvenienceMaterial[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [materialForm] = Form.useForm();
  const [editingMaterial, setEditingMaterial] = useState<ConvenienceMaterial | null>(null);
  const [materialFileList, setMaterialFileList] = useState<UploadFile[]>([]);

  // 避坑指南相关状态
  const [pitfalls, setPitfalls] = useState<ConveniencePitfall[]>([]);
  const [pitfallsLoading, setPitfallsLoading] = useState(false);
  const [pitfallModalVisible, setPitfallModalVisible] = useState(false);
  const [pitfallForm] = Form.useForm();
  const [editingPitfall, setEditingPitfall] = useState<ConveniencePitfall | null>(null);

  // 加载配方列表
  const loadDrinks = async () => {
    setDrinksLoading(true);
    try {
      const data = await getDrinks();
      setDrinks(data);
    } catch (error) {
      message.error('加载配方列表失败');
    } finally {
      setDrinksLoading(false);
    }
  };

  // 加载材料列表
  const loadMaterials = async () => {
    setMaterialsLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      message.error('加载材料列表失败');
    } finally {
      setMaterialsLoading(false);
    }
  };

  // 加载避坑指南列表
  const loadPitfalls = async () => {
    setPitfallsLoading(true);
    try {
      const data = await getPitfalls();
      setPitfalls(data);
    } catch (error) {
      message.error('加载避坑指南列表失败');
    } finally {
      setPitfallsLoading(false);
    }
  };

  useEffect(() => {
    loadDrinks();
    loadMaterials();
    loadPitfalls();
  }, []);

  // ========== 配方管理 ==========

  const drinkColumns: ColumnsType<ConvenienceDrink> = [
    {
      title: 'ID',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => index + 1
    },
    {
      title: '图片',
      dataIndex: 'image',
      width: 100,
      render: (image: string) => image ? (
        <Image src={`${API_BASE}${image}`} width={60} height={60} style={{ objectFit: 'cover' }} />
      ) : '-'
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '场景',
      dataIndex: 'scenes',
      width: 200,
      render: (scenes: string[]) => scenes?.join('、') || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_text, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditDrink(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteDrink(record.id)}>删除</Button>
        </Space>
      )
    }
  ];

  const handleAddDrink = () => {
    setEditingDrink(null);
    setDrinkFileList([]);
    drinkForm.resetFields();
    setDrinkModalVisible(true);
  };

  const handleEditDrink = (drink: ConvenienceDrink) => {
    setEditingDrink(drink);
    drinkForm.setFieldsValue({
      name: drink.name,
      description: drink.description,
      scenes: Array.isArray(drink.scenes) ? drink.scenes.join('\n') : '',
      materials: Array.isArray(drink.materials) ? JSON.stringify(drink.materials, null, 2) : '',
      instructions: Array.isArray(drink.instructions) ? JSON.stringify(drink.instructions, null, 2) : ''
    });
    if (drink.image) {
      setDrinkFileList([{
        uid: '-1',
        name: 'image',
        status: 'done',
        url: `${API_BASE}${drink.image}`
      }]);
    } else {
      setDrinkFileList([]);
    }
    setDrinkModalVisible(true);
  };

  const handleDeleteDrink = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个配方吗？',
      onOk: async () => {
        try {
          await deleteDrink(id);
          message.success('删除成功');
          loadDrinks();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleDrinkModalOk = async () => {
    try {
      const values = await drinkForm.validateFields();
      
      const drinkData: Partial<ConvenienceDrink> = {
        name: values.name,
        description: values.description,
        scenes: values.scenes ? values.scenes.split('\n').filter((s: string) => s.trim()) : [],
        materials: values.materials ? JSON.parse(values.materials) : [],
        instructions: values.instructions ? JSON.parse(values.instructions) : [],
        image: drinkFileList.length > 0 && drinkFileList[0].response 
          ? drinkFileList[0].response.data.url 
          : (drinkFileList.length > 0 && drinkFileList[0].url?.startsWith('/uploads') 
            ? drinkFileList[0].url 
            : '')
      };

      if (editingDrink) {
        await updateDrink(editingDrink.id, drinkData);
        message.success('更新成功');
      } else {
        await createDrink(drinkData);
        message.success('创建成功');
      }
      
      setDrinkModalVisible(false);
      loadDrinks();
    } catch (error) {
      if (error instanceof Error && error.message.includes('JSON')) {
        message.error('JSON 格式错误，请检查输入');
      } else {
        message.error(editingDrink ? '更新失败' : '创建失败');
      }
    }
  };

  // ========== 材料管理 ==========

  const materialColumns: ColumnsType<ConvenienceMaterial> = [
    {
      title: 'ID',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => index + 1
    },
    {
      title: '图片',
      dataIndex: 'image',
      width: 100,
      render: (image: string) => image ? (
        <Image src={`${API_BASE}${image}`} width={60} height={60} style={{ objectFit: 'cover' }} />
      ) : '-'
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'category',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_text, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditMaterial(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteMaterial(record.id)}>删除</Button>
        </Space>
      )
    }
  ];

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialFileList([]);
    materialForm.resetFields();
    setMaterialModalVisible(true);
  };

  const handleEditMaterial = (material: ConvenienceMaterial) => {
    setEditingMaterial(material);
    materialForm.setFieldsValue({
      name: material.name,
      description: material.description,
      category: material.category,
      scenes: Array.isArray(material.scenes) ? material.scenes.join('\n') : '',
      materials: Array.isArray(material.materials) ? JSON.stringify(material.materials, null, 2) : '',
      instructions: Array.isArray(material.instructions) ? JSON.stringify(material.instructions, null, 2) : ''
    });
    if (material.image) {
      setMaterialFileList([{
        uid: '-1',
        name: 'image',
        status: 'done',
        url: `${API_BASE}${material.image}`
      }]);
    } else {
      setMaterialFileList([]);
    }
    setMaterialModalVisible(true);
  };

  const handleDeleteMaterial = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个材料吗？',
      onOk: async () => {
        try {
          await deleteMaterial(id);
          message.success('删除成功');
          loadMaterials();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleMaterialModalOk = async () => {
    try {
      const values = await materialForm.validateFields();
      
      const materialData: Partial<ConvenienceMaterial> = {
        name: values.name,
        description: values.description,
        category: values.category,
        scenes: values.scenes ? values.scenes.split('\n').filter((s: string) => s.trim()) : [],
        materials: values.materials ? JSON.parse(values.materials) : [],
        instructions: values.instructions ? JSON.parse(values.instructions) : [],
        image: materialFileList.length > 0 && materialFileList[0].response 
          ? materialFileList[0].response.data.url 
          : (materialFileList.length > 0 && materialFileList[0].url?.startsWith('/uploads') 
            ? materialFileList[0].url 
            : '')
      };

      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, materialData);
        message.success('更新成功');
      } else {
        await createMaterial(materialData);
        message.success('创建成功');
      }
      
      setMaterialModalVisible(false);
      loadMaterials();
    } catch (error) {
      if (error instanceof Error && error.message.includes('JSON')) {
        message.error('JSON 格式错误，请检查输入');
      } else {
        message.error(editingMaterial ? '更新失败' : '创建失败');
      }
    }
  };

  // ========== 避坑指南管理 ==========

  const pitfallColumns: ColumnsType<ConveniencePitfall> = [
    {
      title: 'ID',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => index + 1
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_text, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditPitfall(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeletePitfall(record.id)}>删除</Button>
        </Space>
      )
    }
  ];

  const handleAddPitfall = () => {
    setEditingPitfall(null);
    pitfallForm.resetFields();
    setPitfallModalVisible(true);
  };

  const handleEditPitfall = (pitfall: ConveniencePitfall) => {
    setEditingPitfall(pitfall);
    pitfallForm.setFieldsValue({
      title: pitfall.title,
      content: pitfall.content
    });
    setPitfallModalVisible(true);
  };

  const handleDeletePitfall = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条避坑指南吗？',
      onOk: async () => {
        try {
          await deletePitfall(id);
          message.success('删除成功');
          loadPitfalls();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handlePitfallModalOk = async () => {
    try {
      const values = await pitfallForm.validateFields();
      
      if (editingPitfall) {
        await updatePitfall(editingPitfall.id, values);
        message.success('更新成功');
      } else {
        await createPitfall(values);
        message.success('创建成功');
      }
      
      setPitfallModalVisible(false);
      loadPitfalls();
    } catch (error) {
      message.error(editingPitfall ? '更新失败' : '创建失败');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="配方管理" key="drinks">
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDrink}>
              添加配方
            </Button>
          </div>
          <Table
            columns={drinkColumns}
            dataSource={drinks}
            rowKey="id"
            loading={drinksLoading}
            pagination={{ pageSize: 20 }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="材料库" key="materials">
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMaterial}>
              添加材料
            </Button>
          </div>
          <Table
            columns={materialColumns}
            dataSource={materials}
            rowKey="id"
            loading={materialsLoading}
            pagination={{ pageSize: 20 }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="避坑指南" key="pitfalls">
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPitfall}>
              添加避坑指南
            </Button>
          </div>
          <Table
            columns={pitfallColumns}
            dataSource={pitfalls}
            rowKey="id"
            loading={pitfallsLoading}
            pagination={{ pageSize: 20 }}
          />
        </Tabs.TabPane>
      </Tabs>

      {/* 配方编辑弹窗 */}
      <Modal
        title={editingDrink ? '编辑配方' : '添加配方'}
        open={drinkModalVisible}
        onOk={handleDrinkModalOk}
        onCancel={() => setDrinkModalVisible(false)}
        width={700}
        okText="确定"
        cancelText="取消"
      >
        <Form form={drinkForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入配方名称' }]}>
            <Input placeholder="如：威士忌可乐" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入配方描述' }]}>
            <TextArea rows={3} placeholder="简短描述这款调酒" />
          </Form.Item>
          <Form.Item name="scenes" label="适用场景" rules={[{ required: true, message: '请输入适用场景' }]}>
            <TextArea rows={3} placeholder="每行一个场景，如：独自放松" />
          </Form.Item>
          <Form.Item name="materials" label="材料配比 (JSON)" rules={[{ required: true, message: '请输入材料配比' }]}>
            <TextArea rows={4} placeholder='[{"name":"威士忌","amount":"50ml"},{"name":"可乐","amount":"150ml"}]' />
          </Form.Item>
          <Form.Item name="instructions" label="制作步骤 (JSON)" rules={[{ required: true, message: '请输入制作步骤' }]}>
            <TextArea rows={4} placeholder='["在杯中加入冰块","倒入威士忌","倒满可乐","轻轻搅拌"]' />
          </Form.Item>
          <Form.Item label="配方图片">
            <Upload
              action={`${API_BASE}/admin/upload`}
              listType="picture-card"
              fileList={drinkFileList}
              onChange={({ fileList }) => setDrinkFileList(fileList)}
              maxCount={1}
            >
              {drinkFileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 材料编辑弹窗 */}
      <Modal
        title={editingMaterial ? '编辑材料' : '添加材料'}
        open={materialModalVisible}
        onOk={handleMaterialModalOk}
        onCancel={() => setMaterialModalVisible(false)}
        width={700}
        okText="确定"
        cancelText="取消"
      >
        <Form form={materialForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入材料名称' }]}>
            <Input placeholder="如：威士忌" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入材料描述' }]}>
            <TextArea rows={3} placeholder="简短描述这个材料" />
          </Form.Item>
          <Form.Item name="category" label="类型" rules={[{ required: true, message: '请输入材料类型' }]}>
            <Input placeholder="如：烈酒、饮料、配料等" />
          </Form.Item>
          <Form.Item name="scenes" label="推荐场景" rules={[{ required: true, message: '请输入推荐场景' }]}>
            <TextArea rows={3} placeholder="每行一个场景，如：派对狂欢" />
          </Form.Item>
          <Form.Item name="materials" label="搭配材料 (JSON)" rules={[{ required: true, message: '请输入搭配材料' }]}>
            <TextArea rows={4} placeholder='["可乐","冰块","柠檬"]' />
          </Form.Item>
          <Form.Item name="instructions" label="使用建议 (JSON)" rules={[{ required: true, message: '请输入使用建议' }]}>
            <TextArea rows={4} placeholder='["适合搭配碳酸饮料","冰镇后口感更佳"]' />
          </Form.Item>
          <Form.Item label="材料图片">
            <Upload
              action={`${API_BASE}/admin/upload`}
              listType="picture-card"
              fileList={materialFileList}
              onChange={({ fileList }) => setMaterialFileList(fileList)}
              maxCount={1}
            >
              {materialFileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 避坑指南编辑弹窗 */}
      <Modal
        title={editingPitfall ? '编辑避坑指南' : '添加避坑指南'}
        open={pitfallModalVisible}
        onOk={handlePitfallModalOk}
        onCancel={() => setPitfallModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={pitfallForm} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="如：千万不要混饮过度" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={6} placeholder="详细描述需要避免的问题和原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConvenienceManage;
