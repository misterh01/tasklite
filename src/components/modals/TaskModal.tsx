import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react'
import { useState } from 'react';
import { useBoardsListStore } from '../../store';


interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editMode?: boolean;
  boardId: string;
  columnId: string;
  taskContent?: string;
  taskId?: string;
}

function TaskModal({ isOpen, onOpenChange, editMode = false, boardId, columnId, taskContent, taskId }: TaskModalProps) {
  const createTask = useBoardsListStore(state => state.addTask)
  const updateTask = useBoardsListStore(state => state.updateTask)

  const [content, setContent] = useState<string>(taskContent || '')
  const [isInvalid, setIsInvalid] = useState<boolean>(false)
  

  const onClickHandler = () => {
    if (content.length === 0 || content.trim().length === 0) {
      setIsInvalid(true)
      return
    }

    if (editMode && taskId) {
      updateTask(boardId, taskId, content)
    } else {
      createTask(boardId, columnId, content)
    }

    onOpenChange(false)
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.shiftKey) {
          onClickHandler()
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{editMode ? "Update" : "Create"} Task</ModalHeader>
            <ModalBody>
              <Textarea
                autoFocus={editMode}
                value={content}
                maxLength={1000}
                label="Content"
                description={`${content.length}/1000`}
                isInvalid={isInvalid}
                errorMessage="Content cannot be empty!"
                onChange={(e) => {
                  if(isInvalid) setIsInvalid(false)

                  setContent(e.target.value)
                }}
              />
            </ModalBody>
            <ModalFooter className='flex justify-between font-semibold'>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
              <Button color="default" className="bg-green-600" onPress={onClickHandler}>
                {editMode ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal >
  )
}

export default TaskModal