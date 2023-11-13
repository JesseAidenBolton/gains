import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Loader2, Minus, Plus} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";



interface AddExerciseDialogProps {
    isOpen: boolean;
    onOpenChange: () => void;
    exercise: string;
    lastSets?: Set[]
    id?: number;
    refetchExercises: () => void;
    //onExerciseSelected: (exercise: Exercise) => void;
    // getExercises: (bodyPart: string) => Exercise[];
}

interface Set {
    weight: string;
    reps: string;
}

interface Exercise {
    id: number;
    name: string;
    userId: string;
    date: Date;
    exercises: unknown
}


const AddExerciseDialog: React.FC<AddExerciseDialogProps> = ({ isOpen, onOpenChange, exercise, lastSets, id,refetchExercises}) => {

    const [numSets, setNumSets] = useState<number>(0);
    const [sets, setSets] = useState<Set[]>([]);

    const addExercise = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/addExercise', {
                name: exercise,
                sets: sets,
                id: id
            })
            return response.data
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        addExercise.mutate(undefined, {
            onSuccess: () => {
                console.log('exercise added')
                onOpenChange()
                refetchExercises();
            },
            onError: error => {
                console.log(error)
            }
        });

    }

    const increase = useCallback(() => {
        setNumSets((prevSets) => {
            const newSets = prevSets < 10 ? prevSets + 1 : prevSets;
            setSets(current => [...current, ...Array.from({ length: newSets - current.length }, () => ({ weight: '', reps: '' }))]);
            return newSets;
        });
    }, []);

    const decrease = useCallback(() => {
        setNumSets((prevSets) => {
            const newSets = prevSets > 1 ? prevSets - 1 : prevSets;
            setSets(current => current.slice(0, newSets));
            return newSets;
        });
    }, []);


    const handleInputChange = (index: number, field: keyof Set, value: string) => {
        const newSets = sets.map((set, idx) =>
            idx === index ? { ...set, [field]: value } : set
        );
        setSets(newSets);

    };

    useEffect(() => {

        if (lastSets && lastSets.length > 0) {
            // Set the number of sets
            setNumSets(lastSets.length);

            setSets(lastSets);
        }
    }, []);


    // Create a list of input elements for sets
    const setInputs = Array.from({ length: numSets }, (_, index) => (
        <div key={index} className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor={`set-weight-${index}`} className="col-span-1">{`Set ${index + 1}`}</Label>
            <Input
                type="number"
                id={`set-weight-${index}`}
                placeholder="Weight"
                min="0"
                step="0.5"
                className="col-span-2 h-8"
                value={sets[index]?.weight || ''}
                onChange={(e) => handleInputChange(index, 'weight', e.target.value)}

            />
            <Label htmlFor={`set-reps-${index}`} className="col-span-1">Reps</Label>
            <Input
                type="number"
                id={`set-reps-${index}`}
                placeholder="Reps"
                min="0"
                className="col-span-2 h-8"
                value={sets[index]?.reps || ''}
                onChange={(e) => handleInputChange(index, 'reps', e.target.value)}

            />
        </div>
    ));


    return (

        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger>
            </PopoverTrigger>
            <PopoverContent className="fixed flex justify-center items-center w-96">
                    <div className="rounded-lg shadow-lg grid gap-4 p-4">
                        <h4 className="font-medium leading-none">Sets for {exercise}</h4>
                        <div className="flex justify-between items-center">
                            <Button onClick={decrease} disabled={numSets <= 1} className="bg-amber-500 w-10 h-10 m-2">
                                <Minus className="w-4 h-4" strokeWidth={3} />
                            </Button>
                            <Label>{numSets}</Label>
                            <Button onClick={increase} disabled={numSets >= 10} className="bg-amber-500 w-10 h-10 m-2">
                                <Plus className="w-4 h-4" strokeWidth={3} />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit}>
                        {setInputs}
                        <div className="m-4"></div>
                        <div className="flex items-center">
                            <Button type="submit" className="bg-amber-500" disabled={addExercise.isPending}>
                                {addExercise.isPending && (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                )}
                                Save Exercise
                            </Button>
                        </div>
                        </form>
                    </div>
            </PopoverContent>
        </Popover>

    );
};
export default AddExerciseDialog;
