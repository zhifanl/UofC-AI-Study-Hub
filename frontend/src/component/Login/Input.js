import React from 'react';
import TextField from '@mui/material/TextField';

export default function Input({
    handleChange,
    value,
    labelText,
    labelFor,
    id,
    name,
    type,
    isRequired = false,
    placeholder,
    customClass = ''
}) {
    return (
      <TextField
        sx={{
          marginTop: 2,
          marginBottom: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px", // Set your desired radius here
          },
        }}
        fullWidth
        onChange={handleChange}
        value={value}
        id={id}
        name={name}
        type={type}
        required={isRequired}
        label={labelText}
        variant="outlined"
        placeholder={placeholder}
        className={customClass}
        InputLabelProps={{
          htmlFor: labelFor,
          shrink: true,
        }}
      />
    );
}
