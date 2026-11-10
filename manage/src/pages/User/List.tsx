import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Tag, Avatar } from 'antd';
import { TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getUserList, deleteUser } from '../../api/user';
import type { UserItem } from '../../api/user';
import { EmptyState } from '../../theme/EmptyState';

const { Search } = Input;

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({ page: 1, pageSize: 10, keyword: '' });

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getUserList(searchParams);
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
      content: '删除该用户后将无法恢复，确定要删除吗？',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
          loadData();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const columns: ColumnsType<UserItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'nickname',
      render: (text: string | null, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar src={record.avatar || undefined} style={{ backgroundColor: '#C08E57' }}>
            {text?.charAt(0) || 'U'}
          </Avatar>
          <div>
            <div>{text || '未命名用户'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              {record.lastLoginTime ? `最近登录 ${new Date(record.lastLoginTime).toLocaleDateString('zh-CN')}` : '未曾登录'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      width: 180,
      render: (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '状态',
      key: 'status',
      width: 90,
      render: () => <Tag color="success">正常</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 页头 */}
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
              background: 'rgba(74, 152, 192, 0.12)',
              color: '#4A98C0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TeamOutlined style={{ fontSize: 20 }} />
          </span>
          <div>
            <h1>用户管理</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              小程序端顾客 / 会员一览
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索昵称或微信标识"
          allowClear
          onSearch={(value) => setSearchParams({ ...searchParams, keyword: value, page: 1 })}
          style={{ width: 280 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        locale={{
          emptyText: (
            <EmptyState title="暂无用户" description="小程序还没有顾客注册" />
          ),
        }}
        pagination={{
          current: searchParams.page,
          pageSize: searchParams.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 人`,
          onChange: (page, pageSize) => setSearchParams({ ...searchParams, page, pageSize }),
        }}
      />
    </div>
  );
};

export default UserList;
