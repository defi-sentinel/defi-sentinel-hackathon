import React from 'react';
import Image from 'next/image';
import { ProtocolDetail } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';

interface ProtocolProductsProps {
  protocol: ProtocolDetail;
}

const ProtocolProducts: React.FC<ProtocolProductsProps> = ({ protocol }) => {
  return (
    <div className="">
      <div className="space-y-8">
        {/* Core Products Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Core Products
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocol.products && protocol.products.map((product, idx) => (
              <ProductCard key={`prod-${idx}`} product={product} />
            ))}
            {(!protocol.products || protocol.products.length === 0) && (
              <p className="text-gray-500 italic">No core products listed.</p>
            )}
          </div>
        </div>

        {/* Strategies Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Strategies
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocol.strategies && protocol.strategies.map((strategy, idx) => (
              <ProductCardWithLink key={`strat-${idx}`} product={strategy} isStrategy={true} />
            ))}
            {(!protocol.strategies || protocol.strategies.length === 0) && (
              <p className="text-gray-500 italic">No strategies listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

const ProductCard = ({ product, isStrategy = false }: { product: any, isStrategy?: boolean }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 hover:border-emerald-500 transition-colors shadow-sm">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        {product.icon && <Image src={product.icon} alt={product.name} width={20} height={20} className="w-5 h-5 rounded-full" />}
        {isStrategy && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
            {product.strategyType || "Strategy"}
          </span>
        )}
        {!isStrategy && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
            Product
          </span>
        )}
      </div>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${product.riskLevel === 'Low'
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
        : product.riskLevel === 'Medium'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
        }`}>
        {product.riskLevel}
      </span>
    </div>

    <div>
      <h4 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">{product.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{product.description}</p>
    </div>

    <div className="flex items-end justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">APY Range</div>
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{product.apyRange || "Variable"}</div>
      </div>
      <div>
        <span className="text-xs text-gray-400 font-medium">{product.targetAudience}</span>
      </div>
    </div>
  </div>

);

// Wrapper to handle linking for strategies
const ProductCardWithLink = ({ product, isStrategy = false }: { product: any, isStrategy?: boolean }) => {
  if (isStrategy && product.id) {
    return (
      <a href={`/strategies/${product.id}`} className="block group">
        <ProductCard product={product} isStrategy={isStrategy} />
      </a>
    );
  }
  return <ProductCard product={product} isStrategy={isStrategy} />;
};

export default ProtocolProducts;
