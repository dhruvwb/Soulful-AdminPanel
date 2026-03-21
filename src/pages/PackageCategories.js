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

const emptyCategory = {
  title: '',
  description: '',
  existingImage: '',
  newImage: null,
  isActive: true,
  createdAt: new Date().toISOString()
};

const emptyPackage = {
  title: '',
  description: '',
  newImage: null
};

export default function PackageCategories() {
  const {
    packageCategories,
    addDomesticPackage,
    addPackageCategory,
    updatePackageCategory,
    deletePackageCategory,
    togglePackageCategory
  } = useData();
  const [open, setOpen] = useState(false);
  const [openPackage, setOpenPackage] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCategory);
  const [packageForm, setPackageForm] = useState(emptyPackage);

  const handleOpen = item => {
    if (item) {
      setEditing(item);
      setForm({
        id: item._id,
        title: item.title,
        description: item.description || '',
        existingImage: item.image || '',
        newImage: null,
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyCategory });
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

  const handlePackageOpen = () => {
    setPackageForm({ ...emptyPackage });
    setOpenPackage(true);
  };

  const handlePackageReset = () => {
    setPackageForm({ ...emptyPackage });
  };

  const handlePackageChange = event => {
    const { name, value } = event.target;
    setPackageForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageImage = event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }
    setPackageForm(prev => ({ ...prev, newImage: files[0] }));
  };

  const handlePackageSave = () => {
    if (!packageForm.title.trim()) {
      return;
    }
    addDomesticPackage({
      title: packageForm.title,
      description: packageForm.description || '',
      shortDescription: packageForm.description || '',
      existingImages: [],
      newImages: packageForm.newImage ? [packageForm.newImage] : [],
      categoryIds: [],
      enquireEnabled: true,
      isActive: true,
      createdAt: new Date().toISOString()
    });
    setOpenPackage(false);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      return;
    }
    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('description', form.description || '');
    payload.append('isActive', String(form.isActive));
    if (form.existingImage) {
      payload.append('existingImage', form.existingImage);
    }
    if (form.newImage) {
      payload.append('image', form.newImage);
    }

    if (editing) {
      updatePackageCategory({ id: form.id, formData: payload });
    } else {
      addPackageCategory(payload);
    }
    setOpen(false);
  };

  const rows = useMemo(() => packageCategories, [packageCategories]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            India Tours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage India tour categories and carousel items.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" onClick={handlePackageOpen}>
            Add Tour Package
          </Button>
          <Button variant="contained" onClick={() => handleOpen(null)}>
            Add India Tour
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item._id}>
                <TableCell>
                  {item.image ? (
                    <img
                      src={getAssetUrl(item.image)}
                      alt={item.title}
                      style={{ width: 90, borderRadius: 8 }}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} onChange={() => togglePackageCategory(item._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deletePackageCategory(item._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit India Tour' : 'Add India Tour'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, marginTop: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
            />
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
              <Typography variant="body2">{form.newImage.name}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPackage} onClose={() => setOpenPackage(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Tour Package</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 3, marginTop: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Package Title
              </Typography>
              <TextField
                name="title"
                value={packageForm.title}
                onChange={handlePackageChange}
                fullWidth
                required
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1 }}>
                Content
              </Typography>
              <TextField
                name="description"
                value={packageForm.description}
                onChange={handlePackageChange}
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
                <input hidden type="file" accept="image/*" onChange={handlePackageImage} />
              </Button>
              {packageForm.newImage?.name && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {packageForm.newImage.name}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, paddingBottom: 3 }}>
          <Button variant="outlined" color="error" onClick={handlePackageReset} sx={{ minWidth: 140 }}>
            Delete
          </Button>
          <Button variant="contained" onClick={handlePackageSave} sx={{ minWidth: 140 }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
