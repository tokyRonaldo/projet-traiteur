
export type RegisterCatererData = {
  name: string;
  email: string;
  password: string;
  location: string;
  address: string;
  description: string;
  website: string;
  contact: string;
};
export type RegisterData={
  name:string;
  email:string;
  password:string;
}

export interface UseRegisterReturn {
  register: (formData: any) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  error: string | null;
}