import { buildURL } from '@/apis/fetch';

/** 图片上传地址 */
export const imgUploadUrl = buildURL('imageinfo/upload');

/** 附件/文件上传地址 */
export const fileUploadUrl = buildURL('fileinfo/upload');
