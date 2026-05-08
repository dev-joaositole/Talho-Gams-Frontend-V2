import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/pages/hr/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-0 shadow-2xl overflow-hidden p-0 max-w-sm">
        <div className="p-6 md:p-8 space-y-4 text-center">
           <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {variant === 'danger' ? (
                   <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                )}
             </svg>
           </div>
           
           <div className="space-y-2">
             <AlertDialogTitle className="text-xl font-serif text-slate-800 text-center">{title}</AlertDialogTitle>
             <AlertDialogDescription className="text-slate-500 text-center text-sm font-medium">
               {description}
             </AlertDialogDescription>
           </div>
        </div>
        
        <div className="flex bg-slate-50/80 border-t border-slate-100 p-3 gap-3">
          <AlertDialogCancel variant="outline" size="default" className="flex-1 h-11 rounded-xl bg-white border-slate-200 text-slate-600 font-bold hover:bg-slate-50">{cancelText}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              onConfirm();
            }} 
            className={`flex-1 h-11 rounded-xl font-bold shadow-none ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#1a56ff] hover:bg-blue-700 text-white'}`}
          >
            {confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
