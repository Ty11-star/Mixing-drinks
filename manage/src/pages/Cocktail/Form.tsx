import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  message,
  Space,
  InputNumber,
  Row,
  Col,
  Upload,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getAdminCocktailDetail,
  createCocktail,
  updateCocktail,
  uploadCocktailImage,
} from '../../api/cocktail';
import { getIngredientList } from '../../api/ingredient';
import { getCategoryList } from '../../api/category';
import type { Cocktail } from '../../api/cocktail';
import {
  CocktailGlassIcon,
  JiggerIcon,
  ShakerIcon,
  CoasterIcon,
  spiritIconMap,
  type SpiritName,
} from '../../theme/icons/SpiritIcons';

const { TextArea } = Input;

/** 基酒选项（线性图标 + 主题色） */
const SPIRIT_OPTIONS: { value: string; color: string }[] = [
  { value: '朗姆酒', color: '#C08E57' },
  { value: '伏特加', color: '#6FB3D6' },
  { value: '金酒', color: '#7BC8A4' },
  { value: '龙舌兰', color: '#D9A441' },
  { value: '威士忌', color: '#A8743D' },
  { value: '白兰地', color: '#C97B84' },
];

/** 杯具类型选项 */
const GLASS_OPTIONS = [
  '高球杯',
  '古典杯',
  '马天尼杯',
  '玛格丽特杯',
  '飓风杯',
  '香槟杯',
  '利口杯',
  '铜马克杯',
  '葡萄酒杯',
  '比尔森杯',
];

/** 封面上传后，用后端域名拼接出可预览的绝对地址（表单里存的是 /uploads/xxx.jpg 相对路径） */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const STATIC_BASE = API_BASE.replace(/\/api\/v1\/?$/, '');

/** 分节标题：线性调酒图标 + 标题 + 副说明 */
const SectionTitle = ({
  icon,
  title,
  hint,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '28px 0 16px',
      paddingBottom: 8,
      borderBottom: '1px dashed #E6D2B8',
    }}
  >
    <span style={{ color: '#C08E57', display: 'inline-flex' }}>{icon}</span>
    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{title}</span>
    {hint && <span style={{ fontSize: 12, color: '#b3ab9e' }}>{hint}</span>}
  </div>
);

const CocktailForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
    if (id) {
      loadCocktailDetail(Number(id));
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [ingredientRes, categoryRes] = await Promise.all([
        getIngredientList({ pageSize: 1000, status: 'all' }),
        getCategoryList({ status: 'all' }),
      ]);
      setIngredients(ingredientRes.data?.list || ingredientRes.data || []);
      setCategories(categoryRes.data || []);
    } catch (error: any) {
      message.error('加载数据失败');
    }
  };

  const loadCocktailDetail = async (cocktailId: number) => {
    try {
      setLoading(true);
      const res = await getAdminCocktailDetail(cocktailId);
      const data = res.data;

      form.setFieldsValue({
        name: data.name,
        nameEn: data.nameEn,
        description: data.description,
        difficulty: data.difficulty,
        baseSpirit: data.baseSpirit,
        tasteTags: data.tasteTags,
        glassType: data.glassType,
        method: data.method,
        tips: data.tips,
        status: data.status,
        sortOrder: data.sortOrder,
        cover: data.cover,
        ingredients: data.ingredients?.map((item: any) => ({
          ingredientId: item.id,
          amount: item.ingredientDetail?.amount || item.amount,
          isOptional: item.ingredientDetail?.isOptional ?? item.isOptional,
        })),
        steps: data.steps?.map((item: any) => ({
          description: item.description,
        })),
        categoryIds: data.categories?.map((item: any) => item.id),
      });
      setCoverUrl(data.cover || '');
    } catch (error: any) {
      message.error('加载详情失败');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // 处理步骤序号
      const steps = values.steps?.map((step: any, index: number) => ({
        stepNumber: index + 1,
        description: step.description,
      }));

      const submitData: Cocktail = {
        ...values,
        steps,
      };

      if (id) {
        await updateCocktail(Number(id), submitData);
        message.success('更新成功');
      } else {
        await createCocktail(submitData);
        message.success('创建成功');
      }

      navigate('/cocktails');
    } catch (error: any) {
      message.error(error.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 页头：图标 + 标题 + 淡色装饰 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(192, 142, 87, 0.1)',
              color: '#C08E57',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CocktailGlassIcon size={22} />
          </span>
          <div>
            <h1>{id ? '编辑酒谱' : '添加酒谱'}</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              像调制一杯鸡尾酒一样，认真填好每一个细节
            </div>
          </div>
        </div>
        <Button onClick={() => navigate('/cocktails')}>返回列表</Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            difficulty: 1,
            status: 1,
            sortOrder: 0,
            ingredients: [{}],
            steps: [{}],
          }}
        >
          {/* 顶部封面大图 */}
          <Form.Item name="cover" hidden>
            <Input />
          </Form.Item>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span style={{ color: '#C08E57', display: 'inline-flex' }}>
                <CoasterIcon size={16} />
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>
                封面大图
              </span>
              <span style={{ fontSize: 12, color: '#b3ab9e' }}>展示在列表与小程序端</span>
            </div>

            <Upload
              showUploadList={false}
              accept="image/*"
              maxCount={1}
              customRequest={async (options: any) => {
                const { file, onSuccess, onError } = options;
                try {
                  setUploading(true);
                  const res = await uploadCocktailImage(file as File);
                  const url = res.data?.url || res.data?.data?.url || '';
                  if (!url) throw new Error('上传返回异常');
                  setCoverUrl(url);
                  form.setFieldsValue({ cover: url });
                  onSuccess?.(res);
                  message.success('封面上传成功');
                } catch (err: any) {
                  message.error(err.message || '上传失败');
                  onError?.(err);
                } finally {
                  setUploading(false);
                }
              }}
            >
              {coverUrl ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 300,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #efe6d6',
                    background: '#faf6ef',
                  }}
                >
                  <img
                    src={STATIC_BASE + coverUrl}
                    alt="封面"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverUrl('');
                      form.setFieldsValue({ cover: '' });
                    }}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      padding: '4px 12px',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    移除封面
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 300,
                    borderRadius: 16,
                    border: '2px dashed #d9c7a8',
                    background: 'rgba(192,142,87,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C08E57',
                    cursor: 'pointer',
                  }}
                >
                  <PlusOutlined style={{ fontSize: 32 }} />
                  <div style={{ marginTop: 12, fontSize: 14 }}>
                    {uploading ? '上传中…' : '点击上传封面大图'}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#b3ab9e' }}>
                    建议 16:9 或 4:3，将展示在列表与小程序端
                  </div>
                </div>
              )}
            </Upload>
          </div>

          <SectionTitle icon={<CocktailGlassIcon size={16} />} title="基本信息" hint="名称与风味画像" />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="酒谱名称"
                name="name"
                rules={[{ required: true, message: '请输入酒谱名称' }]}
              >
                <Input placeholder="如：莫吉托" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="英文名称" name="nameEn">
                <Input placeholder="如：Mojito" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="描述介绍" name="description">
            <TextArea rows={4} placeholder="介绍这款鸡尾酒的历史、特点等" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="难度"
                name="difficulty"
                rules={[{ required: true, message: '请选择难度' }]}
              >
                <Select>
                  <Select.Option value={1}>简单</Select.Option>
                  <Select.Option value={2}>中等</Select.Option>
                  <Select.Option value={3}>困难</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="基酒类型" name="baseSpirit">
                <Select
                  placeholder="选择基酒"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={SPIRIT_OPTIONS.map(({ value }) => ({ value, label: value }))}
                  optionRender={(option) => {
                    const color = SPIRIT_OPTIONS.find((s) => s.value === option.value)?.color;
                    const Icon = spiritIconMap[option.value as SpiritName];
                    return Icon ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color, display: 'inline-flex' }}>
                          <Icon size={16} />
                        </span>
                        {option.label}
                      </span>
                    ) : (
                      <>{option.label}</>
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="杯具类型" name="glassType">
                <Select
                  placeholder="选择杯具类型"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={GLASS_OPTIONS.map((value) => ({ value, label: value }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="调制方法" name="method">
                <Select>
                  <Select.Option value="shake">摇和法（Shake）</Select.Option>
                  <Select.Option value="stir">搅拌法（Stir）</Select.Option>
                  <Select.Option value="build">兑和法（Build）</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="口味标签" name="tasteTags">
                <Input placeholder="用逗号分隔，如：清爽,薄荷,微甜" />
              </Form.Item>
            </Col>
          </Row>

          <SectionTitle
            icon={<JiggerIcon size={16} />}
            title="材料配置"
            hint="像量酒器一样精确到每一份配比"
          />

          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'ingredientId']}
                      rules={[{ required: true, message: '请选择材料' }]}
                    >
                      <Select
                        placeholder="选择材料"
                        style={{ width: 200 }}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={ingredients.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      rules={[{ required: true, message: '请输入用量' }]}
                    >
                      <Input placeholder="如：45ml" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'isOptional']}
                      initialValue={0}
                    >
                      <Select style={{ width: 100 }}>
                        <Select.Option value={0}>必需</Select.Option>
                        <Select.Option value={1}>可选</Select.Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加材料
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <SectionTitle
            icon={<ShakerIcon size={16} />}
            title="调制步骤"
            hint="按摇和 / 搅拌 / 兑和的顺序描述"
          />

          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        flexShrink: 0,
                        borderRadius: '50%',
                        background: 'rgba(192, 142, 87, 0.12)',
                        color: '#A8743D',
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}
                    >
                      {index + 1}
                    </span>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      rules={[{ required: true, message: '请输入步骤描述' }]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Input.TextArea
                        placeholder="详细描述这一步的操作"
                        rows={2}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加步骤
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <SectionTitle icon={<CoasterIcon size={16} />} title="其他设置" hint="上架状态与排序" />

          <Form.Item label="小贴士" name="tips">
            <TextArea rows={3} placeholder="调制建议或注意事项" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="分类" name="categoryIds">
                <Select
                  mode="multiple"
                  placeholder="选择分类"
                  options={categories.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="排序权重" name="sortOrder">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态" name="status">
                <Select>
                  <Select.Option value={1}>启用</Select.Option>
                  <Select.Option value={0}>禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {id ? '更新' : '创建'}
              </Button>
              <Button onClick={() => navigate('/cocktails')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CocktailForm;
