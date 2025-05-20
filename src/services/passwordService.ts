
import { supabase } from "@/integrations/supabase/client";
import { CreatePasswordDto, PasswordEntry, UpdatePasswordDto } from "@/types/password";

export const passwordService = {
  async getAll(): Promise<PasswordEntry[]> {
    const { data, error } = await supabase
      .from('password_entries')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error fetching passwords:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  async getById(id: string): Promise<PasswordEntry | null> {
    const { data, error } = await supabase
      .from('password_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching password:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async create(passwordData: CreatePasswordDto): Promise<PasswordEntry> {
    // Now passwordData includes user_id as required by the database
    const { data, error } = await supabase
      .from('password_entries')
      .insert(passwordData)
      .select()
      .single();

    if (error) {
      console.error('Error creating password:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async update(id: string, passwordData: UpdatePasswordDto): Promise<PasswordEntry> {
    const { data, error } = await supabase
      .from('password_entries')
      .update(passwordData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating password:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('password_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting password:', error);
      throw new Error(error.message);
    }
  },

  async toggleFavorite(id: string, currentFavorite: boolean): Promise<PasswordEntry> {
    return this.update(id, { favorite: !currentFavorite });
  }
};
