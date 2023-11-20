import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface TimerComponentProps {
    onTimerEnd: () => void; // Define a prop for the timer end callback
}

const TimerComponent: React.FC<TimerComponentProps> = ({ onTimerEnd }) => {
    const [countdown, setCountdown] = useState(0);
    const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | null>(null);
    const [showButtons, setShowButtons] = useState(false);

    const startTimer = (duration: number) => {
        // Clear any existing timers
        if (activeTimer) {
            clearInterval(activeTimer);
        }

        setCountdown(duration);
        const newTimer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1000);
        }, 1000);
        setActiveTimer(newTimer);
    };

    useEffect(() => {
        if (countdown <= 0 && activeTimer) {
            clearInterval(activeTimer);
            onTimerEnd();
            setActiveTimer(null);
        }
    }, [countdown, activeTimer, onTimerEnd]);

    const resetTimer = () => {
        if (activeTimer) {
            clearInterval(activeTimer);
        }
        setCountdown(0);
        setActiveTimer(null);
    };



    return (
        <div className="flex flex-col items-center space-y-4">
            <button
                onClick={() => setShowButtons(!showButtons)}
                className="text-2xl"
            >
                <Timer />
            </button>

            {showButtons && (<div><div className="flex space-x-2">
                <button
                    onClick={() => startTimer(30000)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    30s
                </button>
                <button
                    onClick={() => startTimer(60000)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    1min
                </button>
                <button
                    onClick={() => startTimer(120000)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    2min
                </button>
                <button
                    onClick={() => resetTimer()}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Reset
                </button>
            </div>
                    <div className="mt-4"></div>
                    <div className="text-lg font-semibold text-gray-700">
                        Time left: {Math.max(countdown / 1000, 0)}s
                    </div>
                </div>
                )}

        </div>


    );
};

export default TimerComponent;
