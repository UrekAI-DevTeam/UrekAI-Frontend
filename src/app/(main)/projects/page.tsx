'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Filter, ArrowUpDown, Plus, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import GlobalLayout from '@/layouts/GlobalLayout';

interface Project {
  id: string;
  title: string;
  status: 'Active' | 'In Progress' | 'On Hold' | 'Completed';
  description: string;
  teamMembers: Array<{
    id: string;
    name: string;
    avatar?: string;
    color: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Project Card 1',
    status: 'Active',
    description: 'This is a short description for the first project. It gives a brief overview of what the project is about.',
    teamMembers: [
      { id: '1', name: 'John Doe', color: 'bg-blue-200' },
      { id: '2', name: 'Jane Smith', color: 'bg-green-200' },
      { id: '3', name: 'Mike Johnson', color: 'bg-purple-200' }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Project Card 2',
    status: 'In Progress',
    description: 'Here\'s a brief description for the second project, highlighting its current status and objectives.',
    teamMembers: [
      { id: '4', name: 'Sarah Wilson', color: 'bg-gray-200' },
      { id: '5', name: 'Tom Brown', color: 'bg-blue-200' }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    title: 'Project Card 3',
    status: 'On Hold',
    description: 'The third project is currently on hold. This description explains why and the next steps.',
    teamMembers: [
      { id: '6', name: 'Lisa Davis', color: 'bg-blue-200' },
      { id: '7', name: 'Alex Chen', color: 'bg-blue-200' },
      { id: '8', name: 'Emma Taylor', color: 'bg-blue-200' }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12'
  }
];

const statusColors = {
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'On Hold': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects] = useState<Project[]>(mockProjects);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <div className="p-6">
          <div className="bg-surface border border-border rounded-2xl shadow-sm">
          {/* Search and Filter Section */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-4">
              {/* New Project Card */}
              <div className="flex-shrink-0">
                <button className="w-48 h-32 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-primary font-medium">New Project</span>
                </button>
              </div>

              {/* Search and Controls */}
              <div className="flex-1 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <Input
                    type="text"
                    placeholder="Search Projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background-surface border-border"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-background-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">{project.title}</h3>
                    <Badge className={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                  </div>

                  {/* Project Description */}
                  <p className="text-text-muted text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Team Members */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {project.teamMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className={`w-8 h-8 rounded-full ${member.color} border-2 border-surface flex items-center justify-center text-xs font-medium text-text-primary`}
                          title={member.name}
                        >
                          {member.avatar ? (
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              width={32}
                              height={32}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            member.name.charAt(0).toUpperCase()
                          )}
                        </div>
                      ))}
                    </div>
                    {project.teamMembers.length > 3 && (
                      <span className="text-xs text-text-muted">
                        +{project.teamMembers.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {paginatedProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-hover rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">No projects found</h3>
                <p className="text-text-muted">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-primary text-white'
                          : 'text-text-muted hover:text-text-primary hover:bg-hover'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
}