import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PaymentUploadProps {
  registrationId: string;
  onUploadSuccess: () => void;
}

export function PaymentUpload({ registrationId, onUploadSuccess }: PaymentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split('.').pop() || 'png';
      const fileName = `screenshots/${registrationId}-${timestamp}.${fileExtension}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payments')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload file');
      }

      // Update registration record with file path
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ payment_screenshot: fileName })
        .eq('id', registrationId);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error('Failed to update registration record');
      }

      setUploadSuccess(true);
      toast.success('Payment screenshot uploaded successfully!');
      onUploadSuccess();

    } catch (error) {
      console.error('Upload process error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <Check className="w-8 h-8 text-green-400" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2 text-green-400">Upload Successful!</h3>
        <p className="text-gray-300">Your payment screenshot has been uploaded successfully.</p>
      </motion.div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6 text-blue-400" />
        Upload Payment Screenshot
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select payment screenshot
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 
                     focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                     file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400
                     hover:file:bg-blue-500/30 transition-colors"
          />
          {selectedFile && (
            <p className="text-sm text-gray-400 mt-2">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <motion.button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          whileHover={{ scale: selectedFile && !isUploading ? 1.02 : 1 }}
          whileTap={{ scale: selectedFile && !isUploading ? 0.98 : 1 }}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Screenshot
            </>
          )}
        </motion.button>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium mb-1">Upload Instructions:</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Take a clear screenshot of your payment confirmation</li>
              <li>• Ensure the transaction details are visible</li>
              <li>• File size should be less than 5MB</li>
              <li>• Supported formats: JPG, PNG, GIF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}