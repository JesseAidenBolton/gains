import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Loader2, Minus, Plus, Trash2} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";



interface AddExerciseDialogProps {
    isOpen: boolean;
    onOpenChange: () => void;
    exercise: string;
    lastSets?: Set[]
    id?: number;
    refetchExercises: () => void;
    selectedDate: Date | undefined;
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



const AddExerciseDialog: React.FC<AddExerciseDialogProps> = ({ isOpen, onOpenChange, exercise, lastSets, id,refetchExercises, selectedDate}) => {

    const [numSets, setNumSets] = useState<number>(0);
    const [sets, setSets] = useState<Set[]>([]);

    const addExercise = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/addExercise', {
                name: exercise,
                sets: sets,
                id: id,
                date: selectedDate
            })
            return response.data
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("HANDLE SUBMIT")

        addExercise.mutate(undefined, {
            onSuccess: () => {
                //console.log('exercise added')
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

    const deleteExercise = useMutation({
        mutationFn: async (exerciseId: number) => {
            // Assuming you have an endpoint that accepts DELETE requests to delete an exercise
            const response = await axios.post(`/api/deleteExercise`, {
                exerciseId
            });
            return response.data;
        },
        onSuccess: () => {
            // Handle successful deletion
            //console.log('Exercise deleted');
            onOpenChange(); // Close the dialog
            refetchExercises(); // Refetch exercises list to reflect the changes
        },
        // Optionally handle errors as well
        onError: (error) => {
            console.error('Error deleting exercise:', error);
        }
    });

    const handleDelete = () => {
        // Call the mutate function with the exercise ID
        if (id) {
            deleteExercise.mutate(id);
        }
    };

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
            <div className="mt-0.5"></div>
        </div>
    ));

    // State for showing the delete confirmation dialog

    // Function to open the delete confirmation dialog
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleDeleteConfirmationOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteConfirmation(prev => !prev);
    };



    const confirmDelete = async () => {
        if (id) {
            await deleteExercise.mutateAsync(id);
            setShowDeleteConfirmation(false);
        }
    };



    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-lg mx-auto p-6 overflow-y-auto h-full md:h-auto">
                    <div className="space-y-4">
                        <h4 className="text-2xl font-semibold mb-4">Sets for {exercise}</h4>

                        <div className="flex items-center justify-between mb-3">
                            <Button onClick={decrease} disabled={numSets <= 1} className="text-white bg-primary hover:bg-primary-dark rounded-full p-2">
                                <Minus className="w-5 h-5" />
                            </Button>
                            <Label className="text-lg">{numSets} {numSets === 1 ? 'Set' : 'Sets'}</Label>
                            <Button onClick={increase} disabled={numSets >= 10} className="text-white bg-primary hover:bg-primary-dark rounded-full p-2">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {setInputs}
                            <div className="flex justify-end space-x-3 mt-4">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                                    {addExercise.isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Save Exercise'
                                    )}
                                </Button>
                                {id && (
                                    <Button onClick={(e) => handleDeleteConfirmationOpen(e)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                                        {deleteExercise.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Trash2 />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
            
            <DeleteConfirmationDialog isOpen={showDeleteConfirmation} onClose={()=>setShowDeleteConfirmation(false)} onConfirmDelete={confirmDelete} isPending={deleteExercise.isPending} />

        </>
    );
};
export default AddExerciseDialog;
