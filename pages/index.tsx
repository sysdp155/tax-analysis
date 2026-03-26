import React, { useState } from 'react';
import Head from 'next/head';
import FileUpload from '@/components/FileUpload';
import { parseExcelFile, validateExcelStructure, normalizeData, NormalizedDataRow } from '@/utils/excelParser';
import { useRouter } from 'next/router';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const rawData = await parseExcelFile(file);
      
      const validation = validateExcelStructure(rawData);
      if (!validation.valid) {
        setError(`Missing required columns: ${validation.missingColumns.join(', ')}. Please ensure your Excel file contains Date, Product, and Total columns.`);
        setIsLoading(false);
        return;
      }

      const normalizedData = normalizeData(rawData);
      
      if (normalizedData.length === 0) {
        setError('No valid data found in the file. Please check your Excel file and try again.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('reportData', JSON.stringify(normalizedData));
      localStorage.setItem('fileName', file.name);
      
      router.push('/report');
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process the file. Please ensure it is a valid Excel file.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Business Report Generator</title>
        <meta name="description" content="Generate professional business reports from Excel data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Business Report Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your sales data and get a comprehensive, professional business report 
              with insights, charts, and actionable recommendations
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />

          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Upload Data</h3>
              <p className="text-sm text-gray-600">Upload your Excel file with sales or business data</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Auto Analysis</h3>
              <p className="text-sm text-gray-600">AI analyzes your data and generates insights</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Export Report</h3>
              <p className="text-sm text-gray-600">Download professional PDF report</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
