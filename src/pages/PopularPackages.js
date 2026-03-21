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
  MenuItem,
  Paper,
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
import { useData } from '../context/DataContext';

const emptyPopular = {
  package: '',
  shortInfo: '',
  sortOrder: 0,
  isActive: true,
  createdAt: new Date().toISOString()
};

export default function PopularPackages() {
  const {
    popularPackages,
    packagesDomestic,
    addPopularPackage,
    updatePopularPackage,
    deletePopularPackage,
    togglePopularPackage
  } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPopular);

  const handleOpen = item => {
    if (item) {
      setEditing(item);
      setForm({
        id: item._id,
        package: item.package?._id || '',
        shortInfo: item.shortInfo || '',
        sortOrder: item.sortOrder || 0,
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyPopular });
    }
    setOpen(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.package) {
      return;
    }
    if (editing) {
      updatePopularPackage(form);
    } else {
      addPopularPackage(form);
    }
    setOpen(false);
  };

  const rows = useMemo(() => popularPackages, [popularPackages]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Popular Packages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Curate packages shown on the homepage.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add Popular Package
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Package</TableCell>
              <TableCell>Short Info</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.package?.title || '-'}</TableCell>
                <TableCell>{item.shortInfo || '-'}</TableCell>
                <TableCell>{item.sortOrder}</TableCell>
                <TableCell>
                  <Switch checked={item.isActive} onChange={() => togglePopularPackage(item._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deletePopularPackage(item._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No popular packages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Popular Package' : 'Add Popular Package'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, marginTop: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="popular-package">Package</InputLabel>
              <Select
                labelId="popular-package"
                label="Package"
                name="package"
                value={form.package}
                onChange={handleChange}
              >
                {packagesDomestic.map(pkg => (
                  <MenuItem key={pkg._id} value={pkg._id}>
                    {pkg.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Short Info"
              name="shortInfo"
              value={form.shortInfo}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Sort Order"
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
