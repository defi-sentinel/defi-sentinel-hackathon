import React from 'react';

interface InfoCardProps {
    title: string;
    items: string[];
    type?: 'success' | 'warning' | 'neutral';
    icon?: React.ReactNode;
}

const EthenaInfoCard: React.FC<InfoCardProps> = ({ title, items, type = 'neutral', icon }) => {
    const borderColor =
        type === 'success' ? 'border-emerald-500/30' :
            type === 'warning' ? 'border-red-500/30' :
                'border-slate-700';

    const bgColor =
        type === 'success' ? 'bg-emerald-900/10' :
            type === 'warning' ? 'bg-red-900/10' :
                'bg-slate-800/40';

    const dotColor =
        type === 'success' ? 'bg-emerald-500' :
            type === 'warning' ? 'bg-red-500' :
                'bg-slate-500';

    return (
        <div className={`p-5 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-sm h-full`}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                {icon}
                {title}
            </h3>
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-1.5 shrink-0`} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EthenaInfoCard;
