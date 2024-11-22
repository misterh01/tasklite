import { Button, useDisclosure } from "@nextui-org/react"
import { IBoard, useBoardsListStore } from "../store/boardsListStore"
import { Fragment, useEffect, useState } from "react"
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import Board from "./Board"
import BoardModal from "./modals/BoardModal"
import { Toaster } from "react-hot-toast"


function BoardsList() {
  const boardsList = useBoardsListStore((state) => state.boards)
  const swapBoardPosition = useBoardsListStore((state) => state.swapBoardPosition)
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 4
      }
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4
      }
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4
      }
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString())
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = boardsList.findIndex(board => board.id === active.id)
      const newIndex = boardsList.findIndex(board => board.id === over?.id)

      swapBoardPosition(oldIndex, newIndex)
    }

    setActiveId(null)
  }



  useEffect(() => {
    document.title = "Boards | TaskLite"
  }, [])

  return (
    <Fragment>
      <div className="mx-[10%] my-4">
        <div className="flex justify-between">
          <h3 className="text-4xl font-semibold">Boards</h3>
          <Button
            variant='solid'
            color='success'
            onClick={onOpen}
            className="bg-green-700 text-white px-4 py-2 rounded-lg">Create Board</Button>
        </div>

        {/* <div className="hr-line" /> */}
        <hr className="border-[1px] border-default-200 my-2" />



        {boardsList.length === 0 && (
          <div className="flex justify-center items-center h-[50vh]">
            <h3 className="text-2xl text-default-500">You have no boards!</h3>
          </div>
        )}

        {/* boards list */}
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={boardsList.map(board => board.id)}>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {boardsList.map((board) => (
                <Board key={board.id} board={board} grabbing={false} />
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
            {activeId && <Board board={boardsList.find(board => board.id === activeId) || {} as IBoard} grabbing={true} />}
          </DragOverlay>
        </DndContext>

        {isOpen && (
          <BoardModal isOpen={isOpen} onOpenChange={onOpenChange} />
        )}
      </div>


      <Toaster position="bottom-right" />
    </Fragment>
  )
}

export default BoardsList