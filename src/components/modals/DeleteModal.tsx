import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useBoardsListStore } from '../../store';

interface DeleteModalProps {
  boardId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function DeleteModal({ boardId, isOpen, onOpenChange }: DeleteModalProps) {
  const deleteBoard = useBoardsListStore((state) => state.deleteBoard)


  const onDelete = () => {
    deleteBoard(boardId)
    onOpenChange(false)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Board</ModalHeader>
            <ModalBody>
              <h3 className="font-semibold text-md text-gray-300"> 
                Are you sure you want to delete this board?
              </h3>
              <p className='text-sm leading-6 text-gray-400'>
                This action is irreversible. All the tasks in this board will be deleted.
              </p>
            </ModalBody>
            <ModalFooter className='flex justify-between font-semibold'>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
              <Button color="warning" onPress={onDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
);
}

export default DeleteModal