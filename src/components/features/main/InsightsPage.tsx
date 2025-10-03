"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  Calendar,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'forecast';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: string;
  dataSource: string;
  metrics: {
    change: string;
    direction: 'up' | 'down' | 'stable';
  };
  tags: string[];
}

export function InsightsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const insights: Insight[] = [
    {
      id: '1',
      title: 'Revenue Growth Acceleration',
      description: 'Monthly revenue has increased by 23% compared to the same period last year, with particularly strong performance in the electronics category.',
      type: 'trend',
      priority: 'high',
      confidence: 94,
      timestamp: '2 hours ago',
      dataSource: 'Sales Dataset',
      metrics: { change: '+23%', direction: 'up' },
      tags: ['revenue', 'growth', 'electronics']
    },
    {
      id: '2',
      title: 'Customer Churn Risk Detected',
      description: 'Machine learning models indicate a 15% increase in churn risk among customers in the 25-35 age demographic.',
      type: 'anomaly',
      priority: 'high',
      confidence: 87,
      timestamp: '4 hours ago',
      dataSource: 'Customer Analytics',
      metrics: { change: '+15%', direction: 'up' },
      tags: ['churn', 'risk', 'demographics']
    },
    {
      id: '3',
      title: 'Seasonal Pattern Correlation',
      description: 'Strong correlation identified between weather patterns and product demand, particularly for outdoor equipment (+0.78 correlation).',
      type: 'correlation',
      priority: 'medium',
      confidence: 91,
      timestamp: '6 hours ago',
      dataSource: 'Weather & Sales Data',
      metrics: { change: '+78%', direction: 'up' },
      tags: ['seasonal', 'weather', 'outdoor']
    },
    {
      id: '4',
      title: 'Inventory Optimization Opportunity',
      description: 'Predictive models suggest reducing inventory for slow-moving items could free up $2.3M in working capital.',
      type: 'forecast',
      priority: 'medium',
      confidence: 82,
      timestamp: '1 day ago',
      dataSource: 'Inventory Management',
      metrics: { change: '$2.3M', direction: 'up' },
      tags: ['inventory', 'optimization', 'capital']
    },
    {
      id: '5',
      title: 'User Engagement Decline',
      description: 'Mobile app engagement has decreased by 8% over the past two weeks, primarily affecting the onboarding flow.',
      type: 'anomaly',
      priority: 'medium',
      confidence: 89,
      timestamp: '1 day ago',
      dataSource: 'App Analytics',
      metrics: { change: '-8%', direction: 'down' },
      tags: ['engagement', 'mobile', 'onboarding']
    },
    {
      id: '6',
      title: 'Market Expansion Potential',
      description: 'Analysis reveals untapped market segments in the Pacific Northwest region with 340% growth potential.',
      type: 'forecast',
      priority: 'high',
      confidence: 76,
      timestamp: '2 days ago',
      dataSource: 'Market Research',
      metrics: { change: '+340%', direction: 'up' },
      tags: ['expansion', 'market', 'growth']
    }
  ];

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || insight.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || insight.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'correlation': return Activity;
      case 'forecast': return LineChart;
      default: return BarChart3;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-error/20 text-error border-error/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'low': return 'bg-success/20 text-success border-success/30';
      default: return 'bg-background-surface-secondary text-text-muted border-border';
    }
  };

  const stats = [
    { label: 'Total Insights', value: '47', change: '+12%', icon: Zap },
    { label: 'High Priority', value: '8', change: '+3', icon: AlertTriangle },
    { label: 'Avg Confidence', value: '87%', change: '+2%', icon: CheckCircle },
    { label: 'Last Updated', value: '2h ago', change: 'Recent', icon: Clock }
  ];

  return (
    <div className="px-8 py-12 space-y-10 min-h-screen text-text-primary">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Data Insights</h1>
          <p className="text-text-muted mt-2 text-base">
            AI-powered insights and patterns discovered in your data
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button size="md" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat with Insights
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-soft-lg transition-all duration-200 h-32">
              <CardContent className="p-6 h-full flex items-end pb-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-text-primary mb-2">{stat.value}</p>
                    <p className="text-sm text-success font-medium">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blood-red/20 to-crimson/20 rounded-xl flex items-center justify-center ml-4">
                    <Icon className="w-6 h-6 text-blood-red" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-8 h-32 flex items-end pb-2">
          <div className="space-y-4 w-full">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Type Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-text-muted mr-2">Type:</span>
                {['all', 'trend', 'anomaly', 'correlation', 'forecast'].map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="text-sm px-4 py-2 h-9"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Priority Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-text-muted mr-2">Priority:</span>
                {['all', 'high', 'medium', 'low'].map((priority) => (
                  <Button
                    key={priority}
                    variant={selectedPriority === priority ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPriority(priority)}
                    className="text-sm px-4 py-2 h-9"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid gap-4">
        {filteredInsights.map((insight) => {
          const TypeIcon = getTypeIcon(insight.type);
          return (
            <Card key={insight.id} className="hover:shadow-soft-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blood-red/20 to-crimson/20 flex items-center justify-center`}>
                      <TypeIcon className="w-6 h-6 text-blood-red" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg text-text-primary">{insight.title}</CardTitle>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <CardDescription className="text-sm leading-relaxed text-text-secondary">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      insight.metrics.direction === 'up' ? 'text-success' : 
                      insight.metrics.direction === 'down' ? 'text-error' : 'text-text-secondary'
                    }`}>
                      {insight.metrics.change}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {insight.timestamp}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {insight.dataSource}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tags */}
                    <div className="flex gap-1">
                      {insight.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageCircle className="w-4 h-4" />
                        Discuss
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No insights found</h3>
            <p className="text-text-secondary mb-6 text-sm">
              Try adjusting your search criteria or upload new data to generate insights.
            </p>
            <Button size="md">
              Upload Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default InsightsPage;
