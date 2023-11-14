import { CalendarDays } from 'lucide-react';
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useState} from "react";

type CalendarComponentProps = {
    selectedDate: Date | undefined;
    onDateChange: (newDate: Date | undefined) => void;
};



const CalendarComponent = ({ selectedDate, onDateChange }: CalendarComponentProps) => {
    const [date, setDate] = useState<Date>()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                    )}
                >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate ?? undefined}
                    onSelect={(newDate) => onDateChange(newDate ?? undefined)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
export default CalendarComponent;
