import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Box,
    TextField,
    Typography,
    InputAdornment,
    CircularProgress,
    Tooltip,
    Paper,
    Popper,
    ClickAwayListener,
    alpha,
    useTheme,
    Tabs,
    Tab,
    Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import { DEVICON_CDN, DEVICON_JSON_URL, parseDeviconClass, getDeviconUrl } from '../../../utils/deviconUtils';

// Cache the fetched icon list in module scope
let cachedIcons = null;
let fetchPromise = null;

/**
 * Builds an entry for a devicon icon, but ONLY if it has an "original" SVG version.
 * Returns an array with one item, or an empty array if "original" is unavailable.
 */
const buildIconVariants = (entry) => {
    const svgVersions = entry.versions?.svg ?? [];

    // Only include icons that ship an "original" SVG (full-colour logos)
    if (!svgVersions.includes('original')) return [];

    return [{
        name: entry.name,
        version: 'original',
        label: entry.name,
        altnames: entry.altnames ?? [],
        tags: entry.tags ?? [],
        svgUrl: `${DEVICON_CDN}/${entry.name}/${entry.name}-original.svg`,
        color: entry.color ?? '#888',
        allVersions: svgVersions,
    }];
};

/** Single icon card shown in the grid */
const IconCard = React.memo(({ icon, isSelected, onClick }) => {
    const theme = useTheme();
    const [imgError, setImgError] = useState(false);

    return (
        <Tooltip title={icon.label} placement="top" arrow>
            <Box
                onClick={() => onClick(icon)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0.75,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    bgcolor: isSelected
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.action.hover, 0.5),
                    transition: 'all 0.15s ease',
                    '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        transform: 'scale(1.05)',
                    },
                    width: 60,
                    height: 60,
                }}
            >
                {imgError ? (
                    <ImageNotSupportedIcon sx={{ fontSize: 24, color: 'text.disabled' }} />
                ) : (
                    <Box
                        component="img"
                        src={icon.svgUrl}
                        alt={icon.label}
                        onError={() => setImgError(true)}
                        sx={{ width: 30, height: 30, objectFit: 'contain' }}
                    />
                )}
                <Typography
                    variant="caption"
                    sx={{
                        mt: 0.25,
                        fontSize: '0.6rem',
                        lineHeight: 1.1,
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        fontWeight: isSelected ? 700 : 400,
                    }}
                >
                    {icon.label}
                </Typography>
            </Box>
        </Tooltip>
    );
});

IconCard.displayName = 'IconCard';

/**
 * DevIconPicker – searchable icon picker for devicons.
 *
 * Props:
 *   value        {string}   – currently selected icon class string e.g. "devicon-react-original" or custom url/base64
 *   onChange     {fn}       – called with the new class string when an icon is chosen
 *   label        {string}   – label shown on the trigger button / field
 *   placeholder  {string}   – placeholder text
 *   disabled     {boolean}
 */
const DevIconPicker = ({ value, onChange, label = 'Icon', placeholder = 'Search & select icon...', disabled = false }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const anchorRef = useRef(null);
    const searchRef = useRef(null);

    // Tab state: 0 = Devicon search, 1 = Custom URL, 2 = Upload image
    const [tabVal, setTabVal] = useState(0);
    const [customUrl, setCustomUrl] = useState('');

    // Load icon list once
    useEffect(() => {
        if (cachedIcons) {
            setIcons(cachedIcons);
            return;
        }

        if (!fetchPromise) {
            fetchPromise = fetch(DEVICON_JSON_URL)
                .then((r) => r.json())
                .then((data) => {
                    const list = data.flatMap(buildIconVariants);
                    cachedIcons = list;
                    return list;
                })
                .catch((err) => {
                    fetchPromise = null; // Clear on error so it can retry
                    throw err;
                });
        }

        setLoading(true);
        fetchPromise
            .then((list) => {
                setIcons(list);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load devicons:', err);
                setError('Failed to load icons');
                setLoading(false);
            });
    }, []);

    // Focus search on open
    useEffect(() => {
        if (open && searchRef.current && tabVal === 0) {
            setTimeout(() => searchRef.current?.focus(), 80);
        }
    }, [open, tabVal]);

    const filtered = useMemo(() => {
        if (!search.trim()) return icons;
        const q = search.toLowerCase();
        return icons.filter(
            (ic) =>
                ic.label.toLowerCase().includes(q) ||
                ic.altnames.some((a) => a.toLowerCase().includes(q)) ||
                ic.tags.some((t) => t.toLowerCase().includes(q))
        );
    }, [icons, search]);

    // Parse selected icon name from value string like "devicon-react-original"
    const selectedIconName = useMemo(() => {
        if (!value) return null;
        const parsed = parseDeviconClass(value);
        return parsed ? parsed.name : null;
    }, [value]);

    const handleSelect = useCallback(
        (icon) => {
            const classValue = `devicon-${icon.name}-${icon.version}`;
            onChange(classValue);
            setOpen(false);
            setSearch('');
        },
        [onChange]
    );

    const handleClear = useCallback(
        (e) => {
            e.stopPropagation();
            onChange('');
            setCustomUrl('');
        },
        [onChange]
    );

    // Resolve the currently selected icon for preview
    const selectedIcon = useMemo(() => {
        if (!selectedIconName) return null;
        return icons.find((ic) => ic.name === selectedIconName) ?? null;
    }, [icons, selectedIconName]);

    // Determine current display preview source
    const previewSrc = useMemo(() => {
        if (selectedIcon) return selectedIcon.svgUrl;
        if (value && (value.startsWith('http') || value.startsWith('data:image/'))) {
            return value;
        }
        return null;
    }, [selectedIcon, value]);

    // Handle Custom URL Save
    const handleSaveCustomUrl = () => {
        if (customUrl.trim()) {
            onChange(customUrl.trim());
            setOpen(false);
        }
    };

    // Handle Image Upload
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                onChange(reader.result.toString());
                setOpen(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {/* Trigger Field */}
            <TextField
                ref={anchorRef}
                fullWidth
                label={label}
                value={value || ''}
                placeholder={placeholder}
                onClick={() => !disabled && setOpen((o) => !o)}
                InputProps={{
                    readOnly: true,
                    startAdornment: previewSrc ? (
                        <InputAdornment position="start">
                            <Box
                                component="img"
                                src={previewSrc}
                                alt="selected icon"
                                sx={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }}
                            />
                        </InputAdornment>
                    ) : null,
                    endAdornment: (
                        <InputAdornment position="end">
                            {value ? (
                                <CloseIcon
                                    sx={{ cursor: 'pointer', color: 'text.secondary', fontSize: 18 }}
                                    onClick={handleClear}
                                />
                            ) : null}
                        </InputAdornment>
                    ),
                    sx: { cursor: disabled ? 'default' : 'pointer' },
                }}
                variant="outlined"
                margin="normal"
                disabled={disabled}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        cursor: 'pointer',
                        '& input': { cursor: 'pointer', textOverflow: 'ellipsis' },
                    },
                }}
            />

            {/* Dropdown Popper */}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                style={{ zIndex: 1400, width: anchorRef.current?.offsetWidth ?? 320 }}
                modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
            >
                <ClickAwayListener onClickAway={() => { setOpen(false); setSearch(''); }}>
                    <Paper
                        elevation={8}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Tabs
                            value={tabVal}
                            onChange={(e, val) => setTabVal(val)}
                            variant="fullWidth"
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Devicon" sx={{ fontSize: '0.75rem', py: 1 }} />
                            <Tab label="Custom URL" sx={{ fontSize: '0.75rem', py: 1 }} />
                            <Tab label="Upload" sx={{ fontSize: '0.75rem', py: 1 }} />
                        </Tabs>

                        {tabVal === 0 && (
                            <>
                                {/* Search bar */}
                                <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                                    <TextField
                                        inputRef={searchRef}
                                        fullWidth
                                        size="small"
                                        placeholder="Search icons (name, tags)..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        {loading ? 'Loading…' : `${filtered.length} icon${filtered.length !== 1 ? 's' : ''} found`}
                                    </Typography>
                                </Box>

                                {/* Icon grid */}
                                <Box
                                    sx={{
                                        maxHeight: 250,
                                        overflowY: 'auto',
                                        p: 1.5,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 0.75,
                                        '&::-webkit-scrollbar': { width: 6 },
                                        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                                        '&::-webkit-scrollbar-thumb': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.3),
                                            borderRadius: 4,
                                        },
                                    }}
                                >
                                    {loading && (
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress size={32} />
                                        </Box>
                                    )}
                                    {!loading && error && (
                                        <Box sx={{ width: '100%', textAlign: 'center', py: 3 }}>
                                            <Typography color="error" variant="body2">{error}</Typography>
                                        </Box>
                                    )}
                                    {!loading && !error && filtered.length === 0 && (
                                        <Box sx={{ width: '100%', textAlign: 'center', py: 3 }}>
                                            <Typography color="text.secondary" variant="body2">No icons match "{search}"</Typography>
                                        </Box>
                                    )}
                                    {!loading && !error && filtered.map((icon) => (
                                        <IconCard
                                            key={`${icon.name}-${icon.version}`}
                                            icon={icon}
                                            isSelected={icon.name === selectedIconName}
                                            onClick={handleSelect}
                                        />
                                    ))}
                                </Box>
                            </>
                        )}

                        {tabVal === 1 && (
                            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Custom Image URL"
                                    placeholder="https://example.com/logo.png"
                                    value={customUrl}
                                    onChange={(e) => setCustomUrl(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LinkIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleSaveCustomUrl}
                                    disabled={!customUrl.trim()}
                                >
                                    Use URL
                                </Button>
                            </Box>
                        )}

                        {tabVal === 2 && (
                            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ width: '100%', py: 1.5 }}
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </Button>
                                <Typography variant="caption" color="text.secondary" align="center">
                                    Supports PNG, JPEG, SVG, or WebP. Will be converted to base64.
                                </Typography>
                            </Box>
                        )}

                        {/* Selected preview footer */}
                        {previewSrc && (
                            <Box
                                sx={{
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    px: 2,
                                    py: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                }}
                            >
                                <Box
                                    component="img"
                                    src={previewSrc}
                                    alt="selected icon preview"
                                    sx={{ width: 28, height: 28, objectFit: 'contain' }}
                                />
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="body2" fontWeight={600} noWrap>
                                        {selectedIcon ? selectedIcon.label : 'Custom Image'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', display: 'block' }} noWrap>
                                        {value}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    );
};

export default DevIconPicker;
