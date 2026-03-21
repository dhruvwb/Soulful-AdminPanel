import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAssetUrl } from '../services/api';
import { useData } from '../context/DataContext';
import RichTextEditor from '../components/RichTextEditor';

const emptyNews = {
  title: '',
  shortDescription: '',
  content: '',
  date: new Date().toISOString().slice(0, 10),
  existingImageUrl: '',
  newImage: null,
  isActive: true,
  createdAt: new Date().toISOString()
};

export default function News() {
  const { news, addNews, updateNews, deleteNews, toggleNews } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyNews);

  const handleOpen = item => {
    if (item) {
      setEditing(item);
      setForm({
        id: item._id,
        title: item.title,
        shortDescription: item.shortDescription || '',
        content: item.content || '',
        date: item.date || new Date().toISOString().slice(0, 10),
        existingImageUrl: item.imageUrl || '',
        newImage: null,
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyNews });
    }
    setOpen(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }
    setForm(prev => ({ ...prev, newImage: files[0] }));
  };

  const handleRemoveExistingImage = () => {
    setForm(prev => ({ ...prev, existingImageUrl: '' }));
  };

  const handleReset = () => {
    setForm({ ...emptyNews });
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      return;
    }
    if (editing) {
      updateNews(form);
    } else {
      addNews(form);
    }
    setOpen(false);
  };

  const rows = useMemo(() => news, [news]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            News
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Publish travel and company updates.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add News
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} onChange={() => toggleNews(item._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteNews(item._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No news yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit News' : 'Add News'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 3, marginTop: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Title
              </Typography>
              <TextField
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Image
              </Typography>
              <Button variant="outlined" component="label">
                Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImage} />
              </Button>
              {form.existingImageUrl && (
                <Stack spacing={1} sx={{ marginTop: 1 }}>
                  <img
                    src={getAssetUrl(form.existingImageUrl)}
                    alt={form.title}
                    style={{ width: 160, borderRadius: 8 }}
                  />
                  <Button size="small" variant="outlined" onClick={handleRemoveExistingImage}>
                    Remove Existing Image
                  </Button>
                </Stack>
              )}
              {form.newImage?.name && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>{form.newImage.name}</Typography>
              )}
            </Box>
            <Box>
              <RichTextEditor
                label="Description"
                value={form.content}
                onChange={val => setForm(prev => ({ ...prev, content: val }))}
                placeholder="Write the news content here..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, paddingBottom: 3 }}>
          <Button variant="outlined" color="error" onClick={handleReset} sx={{ minWidth: 140 }}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleSave} sx={{ minWidth: 140 }}>
            {editing ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
