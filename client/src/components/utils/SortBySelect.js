import { MenuItem, Select, Typography } from '@mui/material';
import HorizontalStack from './HorizontalStack';

const SortBySelect = ({ onSortBy, sortBy, sorts }) => {
  return (
    <HorizontalStack spacing={1}>
      <Typography
        color="text.secondary"
        variant="subtitle2"
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        Sort by:
      </Typography>
      <Select
        size="small"
        value={sorts[sortBy]}
        sx={{ minWidth: 150 }}
        onChange={onSortBy}
      >
        {Object.keys(sorts).map((sortName, i) => (
          <MenuItem value={sorts[sortName]} key={i}>
            {sorts[sortName]}
          </MenuItem>
        ))}
      </Select>
    </HorizontalStack>
  );
};

export default SortBySelect;
