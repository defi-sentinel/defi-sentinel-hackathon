import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import PendleMechanics from './pendle/PendleMechanics';
import BabylonMechanics from './babylon/BabylonMechanics';
import AaveMechanics from './aave/AaveMechanics';
import JupiterMechanics from './jupiter/JupiterMechanics';
import UniswapMechanics from './uniswap/UniswapMechanics';
import LidoMechanics from './lido/LidoMechanics';
import USDAIMechanics from './usdai';
import AllbridgeMechanics from './allbridge/AllbridgeMechanics';
import MorphoMechanics from './morpho/MorphoMechanics';
import SparkMechanics from './spark/SparkMechanics';
import EthenaMechanics from './ethena/EthenaMechanics';
import SkyMechanics from './sky/SkyMechanics';

// Registry type definition
type MechanicsComponent = React.FC<{ protocol: ProtocolDetail }>;

// The Registry Map
export const MECHANICS_REGISTRY: Record<string, MechanicsComponent> = {
    'pendle': PendleMechanics,
    'aave': AaveMechanics,
    'jupiter': JupiterMechanics,
    'uniswap': UniswapMechanics,
    'lido': LidoMechanics,
    'lido-dao': LidoMechanics,
    'usdai': USDAIMechanics,
    'allbridge': AllbridgeMechanics,
    'babylon': BabylonMechanics,
    'morpho': MorphoMechanics,
    'spark': SparkMechanics,
    'ethena': EthenaMechanics,
    'sky': SkyMechanics,
    // Add new protocols here, e.g., 'uniswap': UniswapMechanics
};

// Default fallback component if no specific mechanics are found
export const DefaultMechanics: React.FC<{ protocol: ProtocolDetail }> = ({ protocol }) => (
    <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        <p>Detailed mechanics visualization coming soon.</p>
        <p className="text-sm mt-2">{protocol.description}</p>
    </div>
);
