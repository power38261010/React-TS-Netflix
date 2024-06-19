import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import {  IconButton } from '@mui/material';

const bounce = keyframes`
0%, 20%, 50%, 80%, 100% {
  transform: translateY(0);
}
40% {
  transform: translateY(-10px);
}
60% {
  transform: translateY(-5px);
}
`;

// Creamos un componente animado usando styled y keyframes
export const AnimatedIconButton = styled(IconButton)`
&:hover {
  animation: ${bounce} 1s;
}
`;