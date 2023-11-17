// pages/history/[name].tsx
'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ExerciseHistory from '@/components/ExerciseHistory';

const ExerciseHistoryPage: React.FC = () => {
    const searchParams = useSearchParams();
    const exerciseName = searchParams.get('name');

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6 underline decoration-blue-500 decoration-4 underline-offset-8">
                    {exerciseName} History
                </h1>
                <div className="bg-white rounded-lg shadow-md p-6 ring-1 ring-gray-200">
                    {exerciseName && <ExerciseHistory name={exerciseName} />}
                </div>
            </div>
        </div>
    );
};

export default ExerciseHistoryPage;
