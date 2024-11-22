import { Fragment, useEffect, useState } from 'react'
import { useBoardsListStore, IColumn, ITask, useColumnButtonStore } from '../store'
import ColumnContainer from './ColumnContainer'
import { closestCenter, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { Button, ScrollShadow, useDisclosure } from '@nextui-org/react'
import CreateColumnModal from './modals/ColumnModal'
import { Link } from 'wouter'
import BoardDropdown from './BoardDropdown'


interface KanbanProps {
  boardId: string
}

function Kanban({ boardId }: KanbanProps) {
  const boards = useBoardsListStore(state => state.boards)
  const deleteColumn = useBoardsListStore(state => state.deleteColumn)
  const swapColumnPosition = useBoardsListStore(state => state.swapColumnPosition)
  const deleteTask = useBoardsListStore(state => state.deleteTask)
  const swapTaskPosition = useBoardsListStore(state => state.swapTaskPosition)
  const swapTaskColumn = useBoardsListStore(state => state.swapTaskColumn)
  const setShowColumnButton = useColumnButtonStore((state) => state.setShowColumnButton)

  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
  const [activeTask, setActiveTask] = useState<ITask | null>(null)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 4
    }
  }))


  const activeBoard = boards.find(board => board.id === boardId)
  if (!activeBoard) {
    return (
      <div
        className='flex flex-col justify-center items-center w-full h-full font-semibold text-4xl text-gray-200'
      >
        Board not found
        <Button
          size='lg'
          className='mt-4'
        >
          <Link href='/boards'>Go back to boards</Link>
        </Button>
      </div>
    )
  }


  const handleDeleteColumn = (id: string) => {
    deleteColumn(boardId, id)
  }


  const handleDeleteTask = (id: string) => {
    deleteTask(boardId, id)
  }


  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'column') {
      setActiveColumn(e.active.data.current.column)
      return;
    }

    if (e.active.data.current?.type === 'task') {
      setActiveTask(e.active.data.current.task)
      return;
    }
  }


  const onDragEnd = (e: DragEndEvent) => {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = e;
    if (!over) return

    const activeId = active.id
    const overId = over.id


    if (activeId === overId) return;

    const activeIndex = activeBoard.columns.findIndex(column => column.id === activeId)
    const overIndex = activeBoard.columns.findIndex(column => column.id === overId)

    if (activeIndex === -1 || overIndex === -1) return

    swapColumnPosition(boardId, activeIndex, overIndex)
  }

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (active.id === over.id) return;


    const isActiveATask = active.data.current?.type === 'task'
    const isOverATask = over.data.current?.type === 'task'

    if (!isActiveATask) return;

    // dropping a task over another task
    if (isActiveATask && isOverATask) {
      const activeIndex = activeBoard.tasks.findIndex(task => task.id === activeId)
      const overIndex = activeBoard.tasks.findIndex(task => task.id === overId)

      activeBoard.tasks[activeIndex].columnId = activeBoard.tasks[overIndex].columnId
      swapTaskPosition(boardId, activeIndex, overIndex)
      return
    }

    // dropping a task over a column
    if (isActiveATask && !isOverATask) {
      const task = activeBoard.tasks.find(task => task.id === activeId)
      if (!task) return

      swapTaskColumn(boardId, task.id, overId as string)
    }
  }

  useEffect(() => {
    document.title = "TaskLite | " + activeBoard.title

    setShowColumnButton(true) // allow the user to add a column directly from the navbar
  }, [])


  // if there are no columns, show a message to add a column
  if (activeBoard.columns.length === 0) {
    return (
      <Fragment>
        <BoardDropdown activeBoardId={activeBoard.id} />
        <div className='flex flex-col gap-2 mt-[10%] items-center'>
          <h3 className='text-2xl text-gray-300'>You have no task columns</h3>
          <h3 className="text-xl text-gray-400">Click below to add a column</h3>
          <button
            className='flex justify-center gap-2 h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 hover:border-green-600'
            onClick={onOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            Add Column
          </button>

          {isOpen && (
            <CreateColumnModal
              boardId={boardId}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <BoardDropdown activeBoardId={activeBoard.id} />

      <div className='mx-10 mt-6 h-[70%] flex w-full overflow-x-auto overflow-y-hidden m-auto pr-16'>
        <ScrollShadow orientation="horizontal" size={20}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="m-auto flex gap-4">

              <SortableContext items={activeBoard.columns.map(column => column.id)}>
                <div className='flex gap-4'>
                  {activeBoard.columns.map(column => (

                    <ColumnContainer
                      key={column.id}
                      column={column}
                      boardId={boardId}
                      deleteColumn={handleDeleteColumn}
                      deleteTask={handleDeleteTask}
                      tasks={activeBoard.tasks.filter(task => task.columnId === column.id)}
                      grabbing={false}
                    />
                  ))}
                </div>
              </SortableContext>

              <button
                className='flex gap-2 h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 hover:border-green-600'
                onClick={onOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                Add Column
              </button>

            </div>

            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  boardId={boardId}
                  column={activeColumn}
                  deleteColumn={handleDeleteColumn}
                  deleteTask={handleDeleteTask}
                  tasks={activeBoard.tasks.filter(task => task.columnId === activeColumn.id)}
                  grabbing={true}
                />
              )}

              {activeTask && <TaskCard task={activeTask} boardId={boardId} deleteTask={handleDeleteTask} grabbing={true} />}

            </DragOverlay>
          </DndContext>
        </ScrollShadow>

        {isOpen && (
          <CreateColumnModal
            boardId={boardId}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        )}
      </div>
    </Fragment>
  )
}

export default Kanban;