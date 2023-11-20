// pages/history/[name].tsx
'use client'

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import ExerciseHistory from '@/components/ExerciseHistory';
import {useState} from "react";
import {useSelectedDate} from "@/contexts/SelectedDateContext";

const ExerciseHistoryPage: React.FC = () => {
    const searchParams = useSearchParams();
    const exerciseName = searchParams.get('name');

    const { setSelectedDate } = useSelectedDate()

    const [graphData, setGraphData] = useState({ labels: [], data: [] });

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <div className="container mx-auto p-4">
                <div className="flex items-center mb-6">
                    <Link href='/dashboard' passHref>
                        <Button className="bg-blue-600 hover:bg-primary-dark text-white mr-4" size="sm">
                            <ArrowBigLeft className="mr-1 w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold underline decoration-blue-500 decoration-4 underline-offset-8">
                        {exerciseName} History
                    </h1>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 ring-1 ring-gray-200">
                    {exerciseName && <ExerciseHistory name={exerciseName}/>}
                </div>
            </div>
        </div>
    );
};

export default ExerciseHistoryPage;
