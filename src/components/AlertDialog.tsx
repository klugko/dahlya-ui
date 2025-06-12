import React, { type ReactNode } from 'react';
import Button from './Button';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | ReactNode;
  type?: 'success' | 'error' | 'info';
}

const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  let headerClass = '';
  switch (type) {
    case 'success':
      headerClass = 'bg-green-500 text-white';
      break;
    case 'error':
      headerClass = 'bg-red-500 text-white';
      break;
    case 'info':
      headerClass = 'bg-blue-500 text-white';
      break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden">
        <div className={`px-6 py-4 ${headerClass}`}>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
