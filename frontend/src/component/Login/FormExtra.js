import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

// Custom styled components if needed
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

export default function FormExtra() {
  const primaryPalette = useTheme().palette.primary;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <FormControlLabel
        control={<CustomCheckbox name="remember-me" />}
        label={<Typography variant="body2">Remember me</Typography>}
      />

      <Typography variant="body2">
        <Link href="#" style={{ color: primaryPalette.main }}>
          Forgot your password?
        </Link>
      </Typography>
    </div>
  );
}
