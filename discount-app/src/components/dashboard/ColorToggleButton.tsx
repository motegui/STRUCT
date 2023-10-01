import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Locales from '../tables/Locales';
import Pago from '../tables/Pago';
import LocalesTable from '../tables/LocalesTable';

export default function ColorToggleButton() {
    const [alignment, setAlignment] = React.useState('locales');

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };

    return (
        <>
        <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
        >
            <ToggleButton value="locales">Locales</ToggleButton>
            <ToggleButton value="pago">Pago</ToggleButton>
        </ToggleButtonGroup>
        {alignment === 'locales' && <Locales/>}
        {alignment === 'pago' && <Pago/>}
        </>
    );
}