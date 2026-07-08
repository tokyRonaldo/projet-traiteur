"use client";
import { useState } from 'react';
import LeftBrandingSection from '@/components/auth/LeftBrandSection';
import ProgressHeader from '@/components/auth/ProgressHeader';
import UserRegisterForm from '@/components/auth/UserRegisterForm';
export default function RegistrationPage() {
  return (
    <main className="flex-grow pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <LeftBrandingSection />

        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-8 md:p-12">
              <UserRegisterForm/>
        </div>
      </div>
    </main>
  );
}