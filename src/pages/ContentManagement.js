import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useData } from '../context/DataContext';
import RichTextEditor from '../components/RichTextEditor';

const fallback = {
  heroTitle: '',
  heroSubtitle: '',
  whyChooseUs: '',
  locationText: '',
  footerText: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  sectionHeadings: {
    domestic: '',
    blogs: '',
    reviews: ''
  }
};

export default function ContentManagement() {
  const { cms, saveCms } = useData();
  const [form, setForm] = useState(fallback);

  useEffect(() => {
    if (cms) {
      setForm(cms);
    }
  }, [cms]);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleHeadingChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({
      ...prev,
      sectionHeadings: { ...prev.sectionHeadings, [name]: value }
    }));
  };

  const handleSave = () => {
    saveCms(form);
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Content Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update all visible website content safely.
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Stack>

      <Paper sx={{ marginTop: 3, padding: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Hero Title"
            name="heroTitle"
            value={form.heroTitle}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={form.heroSubtitle}
            onChange={handleChange}
            fullWidth
          />
          <RichTextEditor
            label="Why Choose Us"
            value={form.whyChooseUs}
            onChange={val => setForm(prev => ({ ...prev, whyChooseUs: val }))}
            placeholder="Enter why choose us content..."
          />
          <TextField
            label="Location Text"
            name="locationText"
            value={form.locationText}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Footer Information"
            name="footerText"
            value={form.footerText}
            onChange={handleChange}
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Contact Email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Contact Phone"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
          <TextField
            label="Contact Address"
            name="contactAddress"
            value={form.contactAddress}
            onChange={handleChange}
            fullWidth
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Section Headings
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Domestic"
              name="domestic"
              value={form.sectionHeadings.domestic}
              onChange={handleHeadingChange}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Blogs"
              name="blogs"
              value={form.sectionHeadings.blogs}
              onChange={handleHeadingChange}
              fullWidth
            />
            <TextField
              label="Reviews"
              name="reviews"
              value={form.sectionHeadings.reviews}
              onChange={handleHeadingChange}
              fullWidth
            />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
