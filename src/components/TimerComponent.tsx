import React, { useRef, useState } from 'react';
import { Timer } from 'lucide-react';

interface TimerComponentProps {
    onTimerEnd: () => void; // Define a prop for the timer end callback
}

const TimerComponent: React.FC<TimerComponentProps> = ({ onTimerEnd }) => {
    const [countdown, setCountdown] = useState(0);
    const activeTimer = useRef<NodeJS.Timeout | null>(null);
    const [showButtons, setShowButtons] = useState(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);


    const startTimer = (duration: number) => {
        // Clear any existing timers
        if (activeTimer.current) {
            clearInterval(activeTimer.current);
        }

        setCountdown(duration);
        const newTimer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1000) {
                    clearInterval(newTimer);
                    activeTimer.current = null;
                    setShowNotification(true);
                    onTimerEnd();
                    return 0;
                }

                return prevCountdown - 1000;
            });
        }, 1000);
        activeTimer.current = newTimer;
    };

    const resetTimer = () => {
        if (activeTimer.current) {
            clearInterval(activeTimer.current);
        }
        setShowNotification(false);
        setCountdown(0);
        activeTimer.current = null;
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
                    <div className="text-3xl font-semibold text-gray-700">
                        Time left: {Math.max(countdown / 1000, 0)}s
                    </div>
                </div>
                )}
            {showNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 animate-pulse">
                    <div className="bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl border border-gray-700">
                        <h2 className="text-3xl text-white font-bold mb-6 text-center">Time&apos;s Up!</h2>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowNotification(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
};

export default TimerComponent;
