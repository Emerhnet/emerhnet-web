import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export type UploadDocumentResult = {
  key: string;
  fileName: string;
  sizeBytes: number;
};

async function uploadDocument(file: File): Promise<UploadDocumentResult> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<UploadDocumentResult>('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export function useUploadDocument() {
  return useMutation({ mutationFn: uploadDocument });
}
