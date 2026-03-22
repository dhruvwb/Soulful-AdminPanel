import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { getAssetUrl } from '../services/api';
import { useData } from '../context/DataContext';
import RichTextEditor from '../components/RichTextEditor';

const fallback = {
  aboutShortDescription: '',
  aboutDetailedDescription: '',
  aboutDescription: '',
  aboutBannerImage: '',
  aboutImage: ''
};

export default function AboutUs() {
  const { cms, saveCms } = useData();
  const [form, setForm] = useState(fallback);
  const [newBannerImage, setNewBannerImage] = useState(null);
  const [newAboutImage, setNewAboutImage] = useState(null);

  useEffect(() => {
    if (cms) {
      setForm({
        aboutShortDescription: cms.aboutShortDescription || '',
        aboutDetailedDescription: cms.aboutDetailedDescription || '',
        aboutDescription: cms.aboutDescription || '',
        aboutBannerImage: cms.aboutBannerImage || '',
        aboutImage: cms.aboutImage || ''
      });
    }
  }, [cms]);

  const handleBannerImage = event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }
    setNewBannerImage(files[0]);
  };

  const handleAboutImage = event => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }
    setNewAboutImage(files[0]);
  };

  const handleSave = () => {
    const payload = new FormData();
    payload.append('aboutShortDescription', form.aboutShortDescription || '');
    payload.append('aboutDetailedDescription', form.aboutDetailedDescription || '');
    payload.append('aboutDescription', form.aboutDescription || '');
    if (form.aboutBannerImage) {
      payload.append('existingAboutBannerImage', form.aboutBannerImage);
    }
    if (form.aboutImage) {
      payload.append('existingAboutImage', form.aboutImage);
    }
    if (newBannerImage) {
      payload.append('aboutBannerImage', newBannerImage);
    }
    if (newAboutImage) {
      payload.append('aboutImage', newAboutImage);
    }
    saveCms(payload);
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            About Us
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the About Us content shown on the website.
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Stack>

      <Paper sx={{ marginTop: 3, padding: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <RichTextEditor
            label="Short Description"
            value={form.aboutShortDescription}
            onChange={val => setForm(prev => ({ ...prev, aboutShortDescription: val }))}
            placeholder="Enter a short about description..."
          />
          <RichTextEditor
            label="Detailed Description"
            value={form.aboutDetailedDescription}
            onChange={val => setForm(prev => ({ ...prev, aboutDetailedDescription: val }))}
            placeholder="Enter the detailed about content..."
          />
          <Stack spacing={1}>
            <Button variant="outlined" component="label">
              Upload Banner Image
              <input hidden type="file" accept="image/*" onChange={handleBannerImage} />
            </Button>
            {form.aboutBannerImage && (
              <img
                src={getAssetUrl(form.aboutBannerImage)}
                alt="About banner"
                style={{ width: '100%', maxWidth: 420, borderRadius: 12 }}
              />
            )}
            {newBannerImage?.name && (
              <Typography variant="body2">{newBannerImage.name}</Typography>
            )}
          </Stack>

          <Stack spacing={1}>
            <Button variant="outlined" component="label">
              Upload Image
              <input hidden type="file" accept="image/*" onChange={handleAboutImage} />
            </Button>
            {form.aboutImage && (
              <img
                src={getAssetUrl(form.aboutImage)}
                alt="About"
                style={{ width: '100%', maxWidth: 420, borderRadius: 12 }}
              />
            )}
            {newAboutImage?.name && (
              <Typography variant="body2">{newAboutImage.name}</Typography>
            )}
          </Stack>

        </Stack>
      </Paper>
    </Box>
  );
}
