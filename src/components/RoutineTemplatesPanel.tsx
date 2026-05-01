"use client"

import { useMemo, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Dumbbell, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exerciseList } from "@/data/exerciseList";

type RoutineSet = {
    weight: string;
    reps: string;
};

type RoutineExercise = {
    id: string;
    name: string;
    sets: RoutineSet[];
    order: number;
};

type RoutineTemplate = {
    id: number;
    name: string;
    exercises: RoutineExercise[];
};

type RoutineTemplatesPanelProps = {
    selectedDate: Date | undefined;
    refetchExercises: () => void;
};

const presetRoutineNames = ["Push Day", "Pull Day", "Legs", "Upper", "Lower", "Full Body", "Program A", "Program B", "Program C"];

const RoutineTemplatesPanel = ({ selectedDate, refetchExercises }: RoutineTemplatesPanelProps) => {
    const queryClient = useQueryClient();
    const [newRoutineName, setNewRoutineName] = useState("");
    const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
    const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

    const routinesQuery = useQuery<RoutineTemplate[]>({
        queryKey: ["routine-templates"],
        queryFn: async () => {
            const response = await axios.get<RoutineTemplate[]>("/api/routines");
            return response.data;
        },
    });

    const routines = useMemo(() => routinesQuery.data ?? [], [routinesQuery.data]);
    const selectedRoutine = useMemo(
        () => routines.find((routine) => routine.id === selectedRoutineId) ?? routines[0],
        [routines, selectedRoutineId]
    );

    const invalidateRoutines = () => queryClient.invalidateQueries({ queryKey: ["routine-templates"] });

    const createRoutine = useMutation({
        mutationFn: async (name: string) => {
            const response = await axios.post<RoutineTemplate>("/api/routines", { name });
            return response.data;
        },
        onSuccess: (routine) => {
            setNewRoutineName("");
            setSelectedRoutineId(routine.id);
            invalidateRoutines();
        },
    });

    const updateRoutine = useMutation({
        mutationFn: async (routine: RoutineTemplate) => {
            const response = await axios.put<RoutineTemplate>("/api/routines", routine);
            return response.data;
        },
        onSuccess: (routine) => {
            setSelectedRoutineId(routine.id);
            invalidateRoutines();
        },
    });

    const deleteRoutine = useMutation({
        mutationFn: async (id: number) => axios.delete("/api/routines", { data: { id } }),
        onSuccess: () => {
            setSelectedRoutineId(null);
            invalidateRoutines();
        },
    });

    const applyRoutine = useMutation({
        mutationFn: async (routineId: number) => axios.post("/api/routines/apply", { routineId, date: selectedDate }),
        onSuccess: () => {
            refetchExercises();
        },
    });

    const handleCreateRoutine = (name = newRoutineName) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            return;
        }

        createRoutine.mutate(trimmedName);
    };

    const handleAddExercise = (exerciseName: string) => {
        if (!selectedRoutine) {
            return;
        }

        const nextExercises = [
            ...selectedRoutine.exercises,
            {
                id: crypto.randomUUID(),
                name: exerciseName,
                sets: [
                    { weight: "", reps: "" },
                    { weight: "", reps: "" },
                    { weight: "", reps: "" },
                ],
                order: selectedRoutine.exercises.length + 1,
            },
        ];

        updateRoutine.mutate({ ...selectedRoutine, exercises: nextExercises });
        setIsExercisePickerOpen(false);
        setSelectedBodyPart(null);
    };

    const handleRemoveExercise = (exerciseId: string) => {
        if (!selectedRoutine) {
            return;
        }

        const nextExercises = selectedRoutine.exercises
            .filter((exercise) => exercise.id !== exerciseId)
            .map((exercise, index) => ({ ...exercise, order: index + 1 }));

        updateRoutine.mutate({ ...selectedRoutine, exercises: nextExercises });
    };

    const exercisesForBodyPart = selectedBodyPart
        ? exerciseList.find((group) => group.muscle === selectedBodyPart)?.exercises ?? []
        : [];

    return (
        <section className="px-4">
            <div className="bg-white rounded-lg shadow px-5 py-4 ring-1 ring-gray-200">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 lg:max-w-md">
                        <div className="flex items-center gap-2 text-gray-800">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Routine Templates</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {presetRoutineNames.map((name) => (
                                <Button
                                    key={name}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCreateRoutine(name)}
                                    disabled={createRoutine.isPending || routines.some((routine) => routine.name === name)}
                                >
                                    {name}
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newRoutineName}
                                onChange={(event) => setNewRoutineName(event.target.value)}
                                placeholder="Custom routine name"
                            />
                            <Button type="button" onClick={() => handleCreateRoutine()} disabled={createRoutine.isPending}>
                                {createRoutine.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        {routinesQuery.isLoading ? (
                            <div className="text-sm text-gray-500">Loading routines...</div>
                        ) : selectedRoutine ? (
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex flex-wrap gap-2">
                                        {routines.map((routine) => (
                                            <Button
                                                key={routine.id}
                                                type="button"
                                                variant={routine.id === selectedRoutine.id ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedRoutineId(routine.id)}
                                            >
                                                {routine.name}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsExercisePickerOpen(true)}
                                        >
                                            <Dumbbell className="mr-2 h-4 w-4" />
                                            Add Exercise
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            disabled={!selectedDate || !selectedRoutine.exercises.length || applyRoutine.isPending}
                                            onClick={() => applyRoutine.mutate(selectedRoutine.id)}
                                        >
                                            {applyRoutine.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Apply Today
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteRoutine.mutate(selectedRoutine.id)}
                                            disabled={deleteRoutine.isPending}
                                            aria-label={`Delete ${selectedRoutine.name}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                {selectedRoutine.exercises.length ? (
                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {selectedRoutine.exercises.map((exercise) => (
                                            <div key={exercise.id} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium text-gray-800">{exercise.name}</div>
                                                    <div className="text-xs text-gray-500">{exercise.sets.length} planned sets</div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveExercise(exercise.id)}
                                                    aria-label={`Remove ${exercise.name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                                        Add exercises to make this routine usable.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                                Create a routine to start planning repeatable workout days.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={isExercisePickerOpen} onOpenChange={setIsExercisePickerOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add exercise to {selectedRoutine?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                        <div className="space-y-2">
                            <Label>Body part</Label>
                            <div className="max-h-[55vh] overflow-y-auto pr-1">
                                {exerciseList.map((group) => (
                                    <Button
                                        key={group.id}
                                        type="button"
                                        variant={selectedBodyPart === group.muscle ? "default" : "ghost"}
                                        className="mb-1 w-full justify-start"
                                        onClick={() => setSelectedBodyPart(group.muscle)}
                                    >
                                        {group.muscle}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Exercise</Label>
                            <div className="max-h-[55vh] overflow-y-auto pr-1">
                                {selectedBodyPart ? (
                                    exercisesForBodyPart.map((exercise) => (
                                        <Button
                                            key={exercise.id}
                                            type="button"
                                            variant="outline"
                                            className="mb-2 w-full justify-start"
                                            onClick={() => handleAddExercise(exercise.exercise)}
                                        >
                                            {exercise.exercise}
                                        </Button>
                                    ))
                                ) : (
                                    <div className="rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                                        Choose a body part first.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default RoutineTemplatesPanel;
