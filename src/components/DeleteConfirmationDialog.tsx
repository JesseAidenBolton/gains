import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmDelete: () => void;
    isPending: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ isOpen, onClose, onConfirmDelete, isPending }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto p-6 bg-white rounded shadow">
                <h4 className="text-xl font-semibold mb-4">Are you sure you want to delete this exercise?</h4>
                <div className="text-sm mb-8">This action cannot be undone.</div>
                <div className="flex justify-end space-x-3">
                    <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                        Cancel
                    </Button>
                    <Button onClick={onConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
