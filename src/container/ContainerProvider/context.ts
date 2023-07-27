import React from 'react';
import { ContainerProviderContextProps } from './interfaces';

const ContainerProviderContext = React.createContext<ContainerProviderContextProps>({ container: null });

export { ContainerProviderContext };
