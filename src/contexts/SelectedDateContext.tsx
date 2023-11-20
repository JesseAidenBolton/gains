'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedDateContextProps {
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const SelectedDateContext = createContext<SelectedDateContextProps>({
    selectedDate: undefined,
    setSelectedDate: () => {},
});



export const useSelectedDate = () => useContext(SelectedDateContext);

interface SelectedDateProviderProps {
    children: ReactNode; // Explicitly type the children prop
}

export const SelectedDateProvider: React.FC<SelectedDateProviderProps> = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    return (
        <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
            {children}
        </SelectedDateContext.Provider>
    );
};