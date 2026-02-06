import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';

interface ProtocolRelatedResearchProps {
  protocol: ProtocolDetail;
}

const ProtocolRelatedResearch: React.FC<ProtocolRelatedResearchProps> = ({ protocol }) => {
  if (!protocol.resources.articles || protocol.resources.articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Related Research</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {protocol.resources.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={{
              ...article,
              coverImage: article.coverImage || "/images/covers/defi-risk-assessment.jpg"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProtocolRelatedResearch;

