import { useRef, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Box, Typography } from '@mui/material';
import { api, getAssetUrl } from '../services/api';

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'align',
  'link',
  'image'
];

export default function RichTextEditor({ label, value, onChange, placeholder }) {
  const quillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await api.post('/admin/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const url = getAssetUrl(response.data.url);
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, 'image', url);
          editor.setSelection(range.index + 1);
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      }
    }),
    [imageHandler]
  );

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          '& .ql-container': { minHeight: 180, fontSize: '1rem' },
          '& .ql-editor': { minHeight: 180 },
          '& .ql-editor img': { maxWidth: '100%', height: 'auto', borderRadius: '8px', margin: '12px 0' }
        }}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || ''}
        />
      </Box>
    </Box>
  );
}
