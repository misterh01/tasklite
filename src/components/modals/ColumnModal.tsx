import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useBoardsListStore } from "../../store";
import { useState } from "react";

interface ColumnModalProps {
  boardId: string;
  editMode?: boolean;
  columnId?: string;
  columnTitle?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}


function ColumnModal({ boardId, editMode, columnId, columnTitle, isOpen, onOpenChange }: ColumnModalProps) {
  const addColumn = useBoardsListStore(state => state.addColumn)
  const updateColumn = useBoardsListStore(state => state.updateColumn)

  const [title, setTitle] = useState<string>(columnTitle || '')
  const [isInvalid, setIsInvalid] = useState<boolean>(false)


  const onClickHandler = () => {
    if (title.length === 0 || title.trim().length === 0) {
      setIsInvalid(true)
      return
    }

    if (editMode && columnId) {
      updateColumn(boardId, columnId, title.trim())
    } else {
      addColumn(boardId, title.trim())
    }
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClickHandler()
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{editMode ? "Update" : "Create"} Column</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                type="text"
                label="Title"
                maxLength={60}
                endContent={
                  <div className="text-md text-default-400 ">
                    {title.length}/60
                  </div>
                }
                errorMessage={"Title cannot be empty!"}
                isInvalid={isInvalid}
                value={title}
                onChange={(e) => {
                  if (isInvalid) setIsInvalid(false)

                  setTitle(e.target.value)
                }}
                className='border-success-600 active:border-success-600'
              />
            </ModalBody>
            <ModalFooter className='flex justify-between font-semibold'>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
              <Button color="default" className="bg-green-600" onPress={onClickHandler}>
                {columnTitle ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ColumnModal