
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CreatePasswordDto } from '@/types/password';
import { passwordService } from '@/services/passwordService';
import { calculatePasswordStrength } from '@/lib/passwordUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import PasswordFormFields from './PasswordFormFields';
import { passwordFormSchema, PasswordFormValues, defaultValues } from './passwordFormSchema';
import { Plus } from 'lucide-react';

interface AddPasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddPasswordForm: React.FC<AddPasswordFormProps> = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
  });

  const { handleSubmit, watch, formState } = form;
  const { isSubmitting } = formState;
  const password = watch("password");
  const strengthScore = password ? calculatePasswordStrength(password) : 0;

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save passwords",
          variant: "destructive"
        });
        return;
      }

      // Explicitly create the DTO with all required fields spelled out
      const passwordData: CreatePasswordDto = {
        title: values.title,         // Required field
        username: values.username,    // Required field
        password: values.password,    // Required field
        category: values.category,    // Required field
        strength_score: strengthScore, // Required field
        user_id: user.id,            // Required field
        url: values.url,             // Optional field
        notes: values.notes,         // Optional field
        favorite: values.favorite,    // Optional field
      };
      
      await passwordService.create(passwordData);
      toast({
        title: "Success",
        description: "Password added successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding password:", error);
      toast({
        title: "Error",
        description: "Failed to add password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-1">
      <h2 className="text-xl font-semibold">Add New Password</h2>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordFormFields form={form} strengthScore={strengthScore} />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-quantablue-dark hover:bg-quantablue-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-1" /> 
                  Add Password
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddPasswordForm;
