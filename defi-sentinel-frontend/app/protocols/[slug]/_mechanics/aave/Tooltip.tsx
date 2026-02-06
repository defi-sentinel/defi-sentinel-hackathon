import React, { ReactNode } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
    return (
        <div className="group relative flex flex-col items-center">
            {children}
            <div className="absolute bottom-full mb-2 hidden flex-col items-center group-hover:flex w-48 z-50">
                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-normal bg-black rounded shadow-lg">
                    {content}
                </span>
                <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
            </div>
        </div>
    );
};
