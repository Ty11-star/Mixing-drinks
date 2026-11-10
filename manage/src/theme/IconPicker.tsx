import { useState } from 'react';
import { Upload, Button, message, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import { uploadIcon } from '../api/upload';

interface IconPickerProps {
  /** 当前图标地址（受控） */
  value?: string;
  onChange?: (url?: string) => void;
}

/**
 * 图标选择器：选取本地图片 / SVG 上传，带预览与移除
 * 作为 Form.Item 受控组件使用（value/onChange 协议）
 */
const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [uploading, setUploading] = useState(false);

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploading(true);
      const res = await uploadIcon(file as File);
      onChange?.(res.data.url);
      message.success('图标上传成功');
      onSuccess?.(res.data);
    } catch (err: any) {
      message.error(err.message || '上传失败');
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const ok = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!ok.includes(file.type)) {
      message.error('仅支持 PNG / JPG / WEBP / GIF / SVG 图片');
      return Upload.LIST_IGNORE;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('图片不能超过 5MB');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {value ? (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-fill-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img src={value} alt="图标预览" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
      ) : (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            border: '1px dashed var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-faint)',
            flexShrink: 0,
          }}
        >
          <PictureOutlined style={{ fontSize: 20 }} />
        </div>
      )}

      <Spin spinning={uploading} size="small">
        <Upload
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          showUploadList={false}
          customRequest={customRequest}
          beforeUpload={beforeUpload}
        >
          <Button icon={<UploadOutlined />}>{value ? '重新上传' : '选择本地图片 / SVG'}</Button>
        </Upload>
      </Spin>

      {value && (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onChange?.(undefined)}
        >
          移除
        </Button>
      )}
    </div>
  );
};

export default IconPicker;
