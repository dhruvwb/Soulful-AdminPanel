import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Paper,
  MenuItem,
  Select,
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

const emptyItem = {
  title: '',
  place: '',
  shortDescription: '',
  description: '',
  existingMediaUrl: '',
  existingMediaType: '',
  newMedia: [],
  mediaCategory: 'image',
  isActive: true,
  createdAt: new Date().toISOString()
};

const mediaOptions = [
  { value: 'image', label: 'Photo' },
  { value: 'video', label: 'Video' }
];

export default function Gallery() {
  const {
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    toggleGalleryItem
  } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);

  const handleOpen = item => {
    if (item) {
      setEditing(item);
      setForm({
        id: item._id,
        title: item.title || '',
        place: item.place || '',
        shortDescription: item.shortDescription || '',
        description: item.description || '',
        existingMediaUrl: item.mediaUrl || '',
        existingMediaType: item.mediaType || '',
        newMedia: [],
        mediaCategory: item.mediaType || 'image',
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyItem });
    }
    setOpen(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMedia = event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }
    setForm(prev => ({ ...prev, newMedia: files }));
  };

  const handleRemoveExistingMedia = () => {
    setForm(prev => ({ ...prev, existingMediaUrl: '', existingMediaType: '' }));
  };

  const handleReset = () => {
    setForm({ ...emptyItem });
  };

  const handleSave = () => {
    if ((!form.newMedia || form.newMedia.length === 0) && !form.existingMediaUrl) {
      return;
    }
    if (editing) {
      updateGalleryItem(form);
    } else {
      addGalleryItem(form);
    }
    setOpen(false);
  };

  const rows = useMemo(() => galleryItems, [galleryItems]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload travel photos and videos.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add Media
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Short Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item._id}>
                <TableCell>
                  {item.mediaType === 'video' ? (
                    <video
                      src={getAssetUrl(item.mediaUrl)}
                      style={{ width: 120, borderRadius: 8 }}
                      muted
                    />
                  ) : (
                    <img
                      src={getAssetUrl(item.mediaUrl)}
                      alt={item.title || 'Gallery'}
                      style={{ width: 120, borderRadius: 8 }}
                    />
                  )}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.place || '-'}</TableCell>
                <TableCell>{item.shortDescription || '-'}</TableCell>
                <TableCell>{item.mediaType}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} onChange={() => toggleGalleryItem(item._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteGalleryItem(item._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No gallery items yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
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
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Place
              </Typography>
              <TextField
                name="place"
                value={form.place}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Short Description
              </Typography>
              <TextField
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={4}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Category
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="gallery-category">Category</InputLabel>
                <Select
                  labelId="gallery-category"
                  label="Category"
                  name="mediaCategory"
                  value={form.mediaCategory}
                  onChange={handleChange}
                >
                  {mediaOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Upload
              </Typography>
              <Button variant="outlined" component="label">
                Upload {form.mediaCategory === 'video' ? 'Video' : 'Image'}
                <input
                  hidden
                  type="file"
                  accept={form.mediaCategory === 'video' ? 'video/*' : 'image/*'}
                  multiple={form.mediaCategory !== 'video'}
                  onChange={handleMedia}
                />
              </Button>
              {form.existingMediaUrl && (
                <Button size="small" variant="outlined" onClick={handleRemoveExistingMedia}>
                  Remove Existing Media
                </Button>
              )}
              {form.newMedia.length > 0 && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {form.newMedia.length} file(s) selected
                </Typography>
              )}
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
