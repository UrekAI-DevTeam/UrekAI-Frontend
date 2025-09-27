"use client";
import React from 'react';
import { useState } from 'react';
import { FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/ui/Button';
import { TableModal } from './TableModal';
import { GraphModal } from './GraphModal';
import { marked } from "marked";

interface AnalysisData {
  summary?: string;
  key_insights?: string[];
  trends_anomalies?: string[];
  recommendations?: string[];
  business_impact?: string[];
}

interface GraphData {
  graph_type: 'bar' | 'line' | 'pie' | 'scatter';
  graph_category: 'primary' | 'secondary';
  graph_data: {
    labels: string[];
    values: number[];
  };
}

interface AIResponse {
  analysis?: AnalysisData;
  table_data?: Record<string, Array<Record<string, string | number>>>;
  graph_data?: Record<string, GraphData>;
}

interface AnalysisResponseProps {
  data: AIResponse;
}

export const AnalysisResponse: React.FC<AnalysisResponseProps> = ({ data }) => {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  
  // console.log(data);
  const renderAnalysisSection = () => {
    if (!data.analysis) return null;

    const { summary, key_insights, trends_anomalies, recommendations, business_impact } = data.analysis;

    return (
      <div className="space-y-4 mb-6">
        {summary && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {key_insights && key_insights.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h3>
            <ul className="list-disc ml-5 space-y-1">
              {key_insights.map((insight, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: marked.parseInline(insight) }}
                />
              ))}
            </ul>
          </div>
        )}

        {trends_anomalies && trends_anomalies.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Trends & Anomalies</h3>
            <ul className="list-disc ml-5 space-y-1">
              {trends_anomalies.map((trend, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: marked.parseInline(trend) }}
                />
              ))}
            </ul>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
            <ul className="list-disc ml-5 space-y-1">
              {recommendations.map((recommendation, index) => (
                // <li key={index} className="text-sm text-gray-600">{recommendation}</li>
                <li
                  key={index}
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: marked.parseInline(recommendation) }}
                />
              ))}
            </ul>
          </div>
        )}

        {business_impact && business_impact.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Impact</h3>
            <ul className="list-disc ml-5 space-y-1">
              {business_impact.map((impact, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: marked.parseInline(impact) }}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderActionButtons = () => {
    const hasTableData = data.table_data && Object.keys(data.table_data).length > 0;
    const hasGraphData = data.graph_data && Object.keys(data.graph_data).length > 0;
    
    if (!hasTableData && !hasGraphData) return null;
    
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Visualization</h3>
        <div className="flex flex-wrap gap-3">
          {hasTableData && (
            <Button
              onClick={() => setIsTableModalOpen(true)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View Tables
            </Button>
          )}
          {hasGraphData && (
            <Button
              onClick={() => setIsGraphModalOpen(true)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              View Charts
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {renderAnalysisSection()}
        {renderActionButtons()}
      </div>
      
      {/* Modals */}
      {data.table_data && (
        <TableModal
          isOpen={isTableModalOpen}
          onClose={() => setIsTableModalOpen(false)}
          tableData={data.table_data}
        />
      )}
      
      {data.graph_data && (
        <GraphModal
          isOpen={isGraphModalOpen}
          onClose={() => setIsGraphModalOpen(false)}
          graphData={data.graph_data}
        />
      )}
    </>
  );
};