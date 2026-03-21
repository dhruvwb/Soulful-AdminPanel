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
import { useData } from '../context/DataContext';
import RichTextEditor from '../components/RichTextEditor';

const emptyPackage = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  duration: '',
  price: '',
  location: '',
  highlights: '',
  itinerary: '',
  inclusions: '',
  exclusions: '',
  metaTitle: '',
  metaDescription: '',
  existingImages: [],
  newImages: [],
  categoryIds: [],
  enquireEnabled: true,
  isActive: true,
  createdAt: new Date().toISOString()
};

export default function DomesticTours() {
  const {
    packagesDomestic,
    addDomesticPackage,
    updateDomesticPackage,
    deleteDomesticPackage,
    toggleDomesticPackage
  } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPackage);

  const handleOpen = pkg => {
    if (pkg) {
      setEditing(pkg);
      setForm({
        id: pkg._id,
        title: pkg.title,
        slug: pkg.slug || '',
        shortDescription: pkg.shortDescription || '',
        description: pkg.description || '',
        duration: pkg.duration || '',
        price: pkg.price || '',
        location: pkg.location || '',
        highlights: pkg.highlights || '',
        itinerary: pkg.itinerary || '',
        inclusions: pkg.inclusions || '',
        exclusions: pkg.exclusions || '',
        metaTitle: pkg.metaTitle || '',
        metaDescription: pkg.metaDescription || '',
        existingImages: pkg.images || [],
        newImages: [],
        categoryIds: pkg.categoryIds || [],
        enquireEnabled: pkg.enquireEnabled !== false,
        isActive: Boolean(pkg.isActive),
        createdAt: pkg.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyPackage });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFiles = async event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }
    setForm(prev => ({ ...prev, newImages: [...prev.newImages, ...files] }));
  };

  const handleRemoveExistingImage = image => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(item => item !== image)
    }));
  };

  const handleRemoveNewImage = name => {
    setForm(prev => ({
      ...prev,
      newImages: prev.newImages.filter(file => file.name !== name)
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      return;
    }
    if (editing) {
      updateDomesticPackage(form);
    } else {
      addDomesticPackage(form);
    }
    setOpen(false);
  };

  const rows = useMemo(() => packagesDomestic, [packagesDomestic]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            India Tour Packages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage tour packages shown on the site.
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
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(pkg => (
                <TableRow key={pkg._id}>
                <TableCell>{pkg.title}</TableCell>
                <TableCell>{pkg.location}</TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>{pkg.price}</TableCell>
                  <TableCell>{pkg.images?.length || 0}</TableCell>
                <TableCell>
                  <Switch
                      checked={pkg.isActive}
                      onChange={() => toggleDomesticPackage(pkg._id)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(pkg)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                    <IconButton color="error" onClick={() => deleteDomesticPackage(pkg._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No packages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Package' : 'Add Package'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, marginTop: 1 }}>
            <TextField
              label="Package Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Slug (auto from title if empty)"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Short Description"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
            <RichTextEditor
              label="Description"
              value={form.description}
              onChange={val => setForm(prev => ({ ...prev, description: val }))}
              placeholder="Enter package description..."
            />
            <RichTextEditor
              label="Detailed Itinerary"
              value={form.itinerary}
              onChange={val => setForm(prev => ({ ...prev, itinerary: val }))}
              placeholder="Enter detailed itinerary..."
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="SEO Title"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="SEO Description"
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                value={form.price}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
            <RichTextEditor
              label="Highlights"
              value={form.highlights}
              onChange={val => setForm(prev => ({ ...prev, highlights: val }))}
              placeholder="Enter highlights..."
            />
            <RichTextEditor
              label="Inclusions"
              value={form.inclusions}
              onChange={val => setForm(prev => ({ ...prev, inclusions: val }))}
              placeholder="Enter inclusions..."
            />
            <RichTextEditor
              label="Exclusions"
              value={form.exclusions}
              onChange={val => setForm(prev => ({ ...prev, exclusions: val }))}
              placeholder="Enter exclusions..."
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Switch
                checked={form.enquireEnabled}
                onChange={() => setForm(prev => ({ ...prev, enquireEnabled: !prev.enquireEnabled }))}
              />
              <Typography variant="body2">Enquire Now enabled</Typography>
            </Stack>
            <Button variant="outlined" component="label">
              Upload Images
              <input hidden multiple type="file" accept="image/*" onChange={handleFiles} />
            </Button>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {form.existingImages.map(image => (
                <Button
                  key={image}
                  size="small"
                  variant="outlined"
                  onClick={() => handleRemoveExistingImage(image)}
                >
                  Existing Image
                </Button>
              ))}
              {form.newImages.map(file => (
                <Button
                  key={file.name}
                  size="small"
                  variant="outlined"
                  onClick={() => handleRemoveNewImage(file.name)}
                >
                  {file.name}
                </Button>
              ))}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
