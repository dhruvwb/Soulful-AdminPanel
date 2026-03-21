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

const emptyPackage = {
  category: 'honeymoon',
  title: '',
  description: '',
  existingImage: '',
  newImage: null,
  isActive: true,
  createdAt: new Date().toISOString()
};

const categoryOptions = [
  { value: 'honeymoon', label: 'Honeymoon Package' },
  { value: 'yoga', label: 'Yoga Retreat' },
  { value: 'eco', label: 'Eco Tourism' },
  { value: 'spiritual', label: 'Spiritual Tours' }
];

export default function CustomizedTourPackage() {
  const {
    customPackages,
    addCustomPackage,
    updateCustomPackage,
    deleteCustomPackage,
    toggleCustomPackage
  } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPackage);

  const handleOpen = item => {
    if (item) {
      setEditing(item);
      setForm({
        id: item._id,
        category: item.category || 'honeymoon',
        title: item.title,
        description: item.description || '',
        existingImage: item.imageUrl || '',
        newImage: null,
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyPackage });
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
    setForm(prev => ({ ...prev, existingImage: '' }));
  };

  const handleReset = () => {
    setForm({ ...emptyPackage });
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      return;
    }
    if (editing) {
      updateCustomPackage(form);
    } else {
      addCustomPackage(form);
    }
    setOpen(false);
  };

  const rows = useMemo(() => customPackages, [customPackages]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Customized Tour Package
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage curated packages like honeymoon or wellness tours.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add Package
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item._id}>
                <TableCell>
                  {item.imageUrl ? (
                    <img
                      src={getAssetUrl(item.imageUrl)}
                      alt={item.title}
                      style={{ width: 90, borderRadius: 8 }}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {categoryOptions.find(option => option.value === item.category)?.label || '-'}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description || '-'}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} onChange={() => toggleCustomPackage(item._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteCustomPackage(item._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No customized packages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Package' : 'Add Package'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 3, marginTop: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Category
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="custom-category">Category</InputLabel>
                <Select
                  labelId="custom-category"
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categoryOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
                Description
              </Typography>
              <TextField
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={10}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Background Image
              </Typography>
              <Button variant="outlined" component="label">
                Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImage} />
              </Button>
              {form.existingImage && (
                <Button size="small" variant="outlined" onClick={handleRemoveExistingImage}>
                  Remove Existing Image
                </Button>
              )}
              {form.newImage?.name && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>{form.newImage.name}</Typography>
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
