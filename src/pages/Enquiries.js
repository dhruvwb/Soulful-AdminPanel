import {
  Box,
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
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useData } from '../context/DataContext';

export default function Enquiries() {
  const { enquiries, markEnquiryRead, deleteEnquiry, unreadEnquiriesCount } = useData();

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Enquiries
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadEnquiriesCount} unread enquiry alerts.
          </Typography>
        </Box>
      </Stack>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Read</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiries.map(enquiry => (
              <TableRow key={enquiry._id}>
                <TableCell>{enquiry.name}</TableCell>
                <TableCell>{enquiry.email}</TableCell>
                <TableCell>{enquiry.mobile}</TableCell>
                <TableCell>{enquiry.message}</TableCell>
                <TableCell>{new Date(enquiry.date).toLocaleString()}</TableCell>
                <TableCell>
                  <Switch
                    checked={enquiry.isRead}
                    onChange={() => markEnquiryRead(enquiry._id, !enquiry.isRead)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => deleteEnquiry(enquiry._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {enquiries.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No enquiries yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
