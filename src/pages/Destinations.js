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

const emptyDestination = {
  name: '',
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
  enquireEnabled: true,
  isActive: true,
  createdAt: new Date().toISOString()
};

export default function Destinations() {
  const {
    destinations,
    addDestination,
    updateDestination,
    deleteDestination,
    toggleDestination
  } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyDestination);

  const handleOpen = item => {
    if (item) {
      setEditing(item);
      setForm({
        id: item._id,
        name: item.name,
        slug: item.slug || '',
        shortDescription: item.shortDescription || '',
        description: item.description || '',
        duration: item.duration || '',
        price: item.price || '',
        location: item.location || '',
        highlights: item.highlights || '',
        itinerary: item.itinerary || '',
        inclusions: item.inclusions || '',
        exclusions: item.exclusions || '',
        metaTitle: item.metaTitle || '',
        metaDescription: item.metaDescription || '',
        existingImages: item.images?.length ? item.images : (item.image ? [item.image] : []),
        newImages: [],
        enquireEnabled: item.enquireEnabled !== false,
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyDestination });
    }
    setOpen(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFiles = event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setForm(prev => ({ ...prev, newImages: [...prev.newImages, ...files] }));
  };

  const handleRemoveExistingImage = image => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(i => i !== image)
    }));
  };

  const handleRemoveNewImage = name => {
    setForm(prev => ({
      ...prev,
      newImages: prev.newImages.filter(file => file.name !== name)
    }));
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateDestination(form);
    } else {
      addDestination(form);
    }
    setOpen(false);
  };

  const rows = useMemo(() => destinations, [destinations]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Destinations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track popular destinations and enquiry volume.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add Destination
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Destination</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.location || '-'}</TableCell>
                <TableCell>{item.duration || '-'}</TableCell>
                <TableCell>{item.price || '-'}</TableCell>
                <TableCell>{item.images?.length || 0}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} onChange={() => toggleDestination(item._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteDestination(item._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No destinations yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Destination' : 'Add Destination'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, marginTop: 1 }}>
            <TextField
              label="Destination Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Slug (auto from name if empty)"
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
              placeholder="Enter destination description..."
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
