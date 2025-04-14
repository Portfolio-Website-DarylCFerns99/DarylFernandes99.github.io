import { keyframes, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';

// Keyframes for animations
export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const moveLeftRight = keyframes`
  0%, 100% { transform: translateX(-20px); }
  50% { transform: translateX(20px); }
`;

export const dataTransfer = keyframes`
  0% { transform: translateX(-40px) translateY(0); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(40px) translateY(0); opacity: 0; }
`;

export const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// Styled components for each animation
export const AnimationContainer = styled(Box)(({ theme, height }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: height,
  width: '100%',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

export const CloudContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  height: '200px',
  width: '100%',
});

export const Cloud = styled(CloudQueueIcon)(({ index }) => ({
  fontSize: 60 + (index * 10),
  position: 'absolute',
  animation: `${float} ${3 + index * 0.5}s ease-in-out infinite`,
  opacity: 0.8,
}));

export const DatabaseContainer = styled(Box)({
  position: 'relative',
  height: '200px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const Database = styled(StorageIcon)({
  fontSize: 80,
  animation: `${pulse} 2s ease-in-out infinite`,
});

export const DataPacket = styled(Box)(({ theme }) => ({
  width: 20,
  height: 6,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '4px',
  position: 'absolute',
  animation: `${dataTransfer} 1.5s linear infinite`,
}));

export const ApiAnimation = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  width: '100%',
});

export const ServerIcon = styled(DnsIcon)({
  fontSize: 70,
  animation: `${pulse} 2s ease-in-out infinite`,
});

export const CodeTerminal = styled(Box)(({ theme }) => ({
  width: '300px',
  height: '200px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#2C3E50',
  borderRadius: '8px',
  padding: '16px',
  fontFamily: 'monospace',
  position: 'relative',
  overflow: 'hidden',
}));

export const TerminalHeader = styled(Box)({
  display: 'flex',
  marginBottom: '10px',
});

export const TerminalDot = styled(Box)(({ color }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: '6px',
}));

export const TerminalLine = styled(Box)(({ delay }) => ({
  color: '#A3E4D7',
  marginBottom: '8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  animation: `${typewriter} 2s steps(40, end) ${delay}s forwards`,
  width: 0,
}));

export const Cursor = styled('span')({
  animation: `${blink} 1s step-end infinite`,
});

export const DevEnvironmentContainer = styled(Box)({
  display: 'flex', 
  position: 'relative', 
  height: '200px', 
  width: '100%', 
  justifyContent: 'center'
});