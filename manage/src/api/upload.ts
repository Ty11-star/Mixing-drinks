import request from '../utils/request';

export interface UploadResult {
  url: string;
}

/**
 * 上传分类图标（PNG / JPG / WEBP / GIF / SVG，≤5MB）
 * 返回可直接存入分类 icon 字段的相对地址，如 /images/upload/xxx.png
 */
export const uploadIcon = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/upload/icon', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as Promise<{ code: number; message: string; data: UploadResult }>;
};
