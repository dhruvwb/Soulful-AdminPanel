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

const emptyBlog = {
  title: '',
  description: '',
  content: '',
  author: '',
  date: new Date().toISOString().slice(0, 10),
  location: '',
  metaTitle: '',
  metaDescription: '',
  existingCoverImage: '',
  newCoverImage: null,
  isActive: true,
  createdAt: new Date().toISOString()
};

export default function Blogs() {
  const { blogs, addBlog, updateBlog, deleteBlog, toggleBlog } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyBlog);

  const handleOpen = blog => {
    if (blog) {
      setEditing(blog);
      setForm({
        id: blog._id,
        title: blog.title,
        description: blog.description || '',
        content: blog.content || '',
        author: blog.author || '',
        date: blog.date || new Date().toISOString().slice(0, 10),
        location: blog.location || '',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        existingCoverImage: blog.coverImage || '',
        newCoverImage: null,
        isActive: Boolean(blog.isActive),
        createdAt: blog.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyBlog });
    }
    setOpen(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCover = async event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }
    const [file] = files;
    setForm(prev => ({ ...prev, newCoverImage: file }));
  };

  const handleRemoveExistingCover = () => {
    setForm(prev => ({ ...prev, existingCoverImage: '' }));
  };

    const handleReset = () => {
      setForm({ ...emptyBlog });
    };

  const handleSave = () => {
    if (!form.title.trim()) {
      return;
    }
    if (editing) {
      updateBlog(form);
    } else {
      addBlog(form);
    }
    setOpen(false);
  };

  const rows = useMemo(() => blogs, [blogs]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Blogs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Publish and manage travel stories.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add Blog
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {rows.map(blog => (
              <TableRow key={blog._id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell>{blog.date}</TableCell>
                <TableCell>{blog.location}</TableCell>
                <TableCell>
                  <Switch checked={blog.isActive} onChange={() => toggleBlog(blog._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(blog)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteBlog(blog._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No blogs yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                  Author
                </Typography>
                <TextField
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                  Date
                </Typography>
                <TextField
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                  Location
                </Typography>
                <TextField
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            </Stack>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Short Description
              </Typography>
              <TextField
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Brief summary shown on blog listing"
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Cover Image
              </Typography>
              <Button variant="outlined" component="label">
                Upload Image
                <input hidden type="file" accept="image/*" onChange={handleCover} />
              </Button>
              {form.existingCoverImage && (
                <Stack spacing={1} sx={{ marginTop: 1 }}>
                  <img
                    src={getAssetUrl(form.existingCoverImage)}
                    alt={form.title}
                    style={{ width: 160, borderRadius: 8 }}
                  />
                  <Button size="small" variant="outlined" onClick={handleRemoveExistingCover}>
                    Remove Existing Image
                  </Button>
                </Stack>
              )}
              {form.newCoverImage?.name && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>{form.newCoverImage.name}</Typography>
              )}
            </Box>
            <Box>
              <RichTextEditor
                label="Blog Content"
                value={form.content}
                onChange={val => setForm(prev => ({ ...prev, content: val }))}
                placeholder="Write your blog content here... You can add images using the image button in the toolbar."
              />
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                  Meta Title (SEO)
                </Typography>
                <TextField
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  fullWidth
                  placeholder="SEO title for search engines"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                  Meta Description (SEO)
                </Typography>
                <TextField
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  fullWidth
                  placeholder="SEO description for search engines"
                />
              </Box>
            </Stack>
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
