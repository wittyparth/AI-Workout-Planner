'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useTemplates(filters?: { category?: string; difficulty?: string }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.templates.getTemplates(filters);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, isLoading, refetch: fetchTemplates };
}

export function useCreateTemplate() {
  const [isCreating, setIsCreating] = useState(false);

  const createTemplate = useCallback(async (templateData: any) => {
    try {
      setIsCreating(true);
      const response = await api.templates.createTemplate(templateData);
      toast.success('Template created successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to create template:', error);
      toast.error('Failed to create template');
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { createTemplate, isCreating };
}

export function useFavoriteTemplate() {
  const [isFavoriting, setIsFavoriting] = useState(false);

  const toggleFavorite = useCallback(async (templateId: string) => {
    try {
      setIsFavoriting(true);
      await api.templates.toggleFavorite(templateId);
      toast.success('Favorites updated');
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsFavoriting(false);
    }
  }, []);

  return { toggleFavorite, isFavoriting };
}
