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

const emptyReview = {
  name: '',
  location: '',
  review: '',
  rating: 5,
  isActive: true,
  createdAt: new Date().toISOString()
};

export default function Reviews() {
  const { reviews, addReview, updateReview, deleteReview, toggleReview } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyReview);

  const handleOpen = review => {
    if (review) {
      setEditing(review);
      setForm({
        id: review._id,
        name: review.name,
        location: review.location || '',
        review: review.review || '',
        rating: review.rating || 5,
        isActive: Boolean(review.isActive),
        createdAt: review.createdAt || new Date().toISOString()
      });
    } else {
      setEditing(null);
      setForm({ ...emptyReview });
    }
    setOpen(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      return;
    }
    if (editing) {
      updateReview({ ...form, rating: Number(form.rating) });
    } else {
      addReview({ ...form, rating: Number(form.rating) });
    }
    setOpen(false);
  };

  const rows = useMemo(() => reviews, [reviews]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Customer Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage testimonials and ratings.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add Review
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(review => (
              <TableRow key={review._id}>
                <TableCell>{review.name}</TableCell>
                <TableCell>{review.location}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>
                  <Switch checked={review.isActive} onChange={() => toggleReview(review._id)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(review)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteReview(review._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No reviews yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Review' : 'Add Review'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, marginTop: 1 }}>
            <TextField
              label="Customer Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Country / Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Review Text"
              name="review"
              value={form.review}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Rating (1-5)"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 1, max: 5 }}
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
