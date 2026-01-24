import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TablesInsert } from '@/integrations/supabase/types';

export interface WholesaleQuote {
  id: string;
  quote_number: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  message: string | null;
  products: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useWholesaleQuotes = () => {
  return useQuery({
    queryKey: ['wholesale-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wholesale_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WholesaleQuote[];
    },
  });
};

export const useCreateWholesaleQuote = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (quote: Omit<TablesInsert<'wholesale_quotes'>, 'quote_number'>) => {
      const { data, error } = await supabase
        .from('wholesale_quotes')
        .insert(quote)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'درخواست موصول! 📧',
        description: 'ہم جلد آپ سے رابطہ کریں گے۔',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateQuoteStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('wholesale_quotes')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wholesale-quotes'] });
      toast({
        title: 'سٹیٹس اپڈیٹ',
        description: 'کوٹ سٹیٹس کامیابی سے اپڈیٹ ہو گیا۔',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
