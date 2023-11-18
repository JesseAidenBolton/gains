// components/ExerciseHistory.jsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowBigRight} from "lucide-react";
import ProgressChart from "@/components/ProgressChart";

interface Set {
    weight: string;
    reps: string;
}

interface ExerciseDetail {
    sets: Set[];
}

interface HistoryEntry {
    id: number;
    name: string;
    date: string;
    userId: string;
    exercises: ExerciseDetail[];
}

interface ExerciseHistoryProps {
    name: string;
}

const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({ name}) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [graphData, setGraphData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get<HistoryEntry[]>(`/api/getHistory/${name}`);
                setHistory(response.data);

                // Prepare data for the graph
                const labels = response.data.map(entry =>
                    new Date(entry.date).toLocaleDateString('en-GB')
                );

                const data = response.data.map(entry => {
                    // Find the maximum weight lifted in each session
                    return entry.exercises.reduce((maxWeight, exercise) => {
                        const maxWeightInExercise = exercise.sets.reduce((max, set) => {
                            const weight = parseFloat(set.weight) || 0;
                            return Math.max(max, weight);
                        }, 0);
                        return Math.max(maxWeight, maxWeightInExercise);
                    }, 0);
                });

                setGraphData({ labels, data });
            } catch (error) {
                console.error('Error fetching exercise history', error);
            }
        };

        if (name) {
            fetchHistory();
        }
    }, [name]);

    return (
        <div>
            <ProgressChart labels={graphData.labels} data={graphData.data} />
            {history.length > 0 ? (
                <ul className="space-y-4">
                    {history.map((entry) => (
                        <li key={entry.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-blue-600">
                                    {new Date(entry.date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </h3>
                                <ArrowBigRight className="w-6 h-6 text-blue-500" />
                            </div>
                            {entry.exercises.map((exercise, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4">
                                    {exercise.sets.map((set, setIndex) => (
                                        <div key={setIndex} className="text-sm text-gray-700 bg-white p-2 rounded shadow-sm">
                                            <span>Set {setIndex + 1}:</span> <span className="font-semibold">{set.weight} kg</span> for <span className="font-semibold">{set.reps} reps</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">No history available for this exercise.</p>
            )}
        </div>
    );
};

export default ExerciseHistory;
