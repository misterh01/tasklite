import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Fragment, useMemo } from 'react'
import TaskCard from './TaskCard';
import { useDisclosure } from '@nextui-org/react';
import ColumnModal from './modals/ColumnModal';
import TaskModal from './modals/TaskModal';
import { IColumn, ITask } from '../store';

interface ColumnContainerProps {
  boardId: string;
  column: IColumn;
  tasks: ITask[];
  grabbing: boolean;
  deleteColumn: (id: string) => void;
  deleteTask: (id: string) => void;
}

function ColumnContainer({ boardId, grabbing, column, deleteColumn, tasks, deleteTask }: ColumnContainerProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: taskIsOpen, onOpen: taskOnOpen, onOpenChange: taskOnOpenChange } = useDisclosure()
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    },
    disabled: isOpen
  })

  const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='bg-columnBackgroundColor text-white w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-lg opacity-40 border-2 border-green-600'
      ></div>
    )
  }

  return (
    <Fragment>
      <div
        ref={setNodeRef}
        style={style}
        className='bg-mainBackgroundColor w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-lg'
      >

        {/* header */}
        <div
          {...attributes}
          {...listeners}
          onClick={onOpen}
          onMouseLeave={() => grabbing = false}
          className={"flex justify-between items-center bg-columnBackgroundColor h-[60px]  rounded-lg rounded-b-none p-3 " + (grabbing ? "cursor-grabbing" : "cursor-grab")}
        >
          <div className='flex gap-2 w-[85%]'>
            <div className="flex justify-center items-center bg-mainBackgroundColor px-2 py-1 text-sm font-semibold rounded-full">
              {tasks.length || 0}
            </div>

            <h3 className=' text-xl font-semibold truncate w-full'>
              {column.title}
            </h3>

          </div>

          {/* delete icon */}
          <div
            className="cursor-pointer stroke-gray-500 hover:stroke-gray-300 hover:bg-mainBackgroundColor rounded-lg p-1"
            onClick={() => deleteColumn(column.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>

        </div>
        {/* content */}
        <div className="flex flex-grow flex-col gap-4 p-4 overflow-x-hidden overflow-y-auto">
          <SortableContext items={tasksIds}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                boardId={boardId}
                task={task}
                deleteTask={deleteTask}
              />
            ))}
          </SortableContext>
        </div>

        {/* footer */}
        <div
          className='bg-mainBackgroundColor h-[60px] rounded-lg rounded-t-none flex gap-2 items-center p-4 cursor-pointer hover:bg-columnBackgroundColor hover:text-green-600'
          onClick={taskOnOpen}
        >
          <div className='flex justify-center items-center h-full'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>

          Add Task
        </div>
      </div>

      {isOpen && (
        <ColumnModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          boardId={boardId}
          editMode={true}
          columnId={column.id}
          columnTitle={column.title}
        />
      )}

      {taskIsOpen && (
        <TaskModal
          isOpen={taskIsOpen}
          onOpenChange={taskOnOpenChange}
          columnId={column.id}
          boardId={boardId}
        />
      )}
    </Fragment>
  )
}

export default ColumnContainer