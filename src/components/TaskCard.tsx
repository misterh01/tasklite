import { Fragment, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import { useDisclosure } from "@nextui-org/react";
import TaskModal from "./modals/TaskModal";
import { ITask } from "../store";


interface TaskCardProps {
  grabbing?: boolean;
  boardId: string;
  task: ITask;
  deleteTask: (id: string) => void;
  // updateTask: (id: string, content: string) => void;
}

function TaskCard({ grabbing = false, boardId, task, deleteTask }: TaskCardProps) {
  const [hovered, setHovered] = useState(false);
  // const [editMode, setEditMode] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    },
    disabled: isOpen
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // const toggleEditMode = () => {
  //   setEditMode(!editMode);
  //   setHovered(false);
  // }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='bg-columnBackgroundColor p-2.5 h-[100px] min-h-[100px] rounded-lg opacity-30 border-2 border-green-600'
      ></div>
    )
  }


  // if (editMode) {
  //   return (
  //     <div
  //       ref={setNodeRef}
  //       style={style}
  //       {...attributes}
  //       {...listeners}
  //       className='bg-columnBackgroundColor p-2.5 h-[100px] min-h-[100px] rounded-lg cursor-grab items-center flex text-left relative'
  //     >
  //       <textarea
  //         autoFocus
  //         value={task.content}
  //         placeholder="Task content here"
  //         onBlur={toggleEditMode}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter' && e.shiftKey) {
  //             toggleEditMode()
  //           }
  //         }}
  //         onChange={(e) => updateTask(task.id, e.target.value)}
  //         className='task h-[90%] w-full resize-none border-none rounded bg-transparent focus:outline-none'
  //       />
  //     </div>
  //   )
  // }

  return (
    <Fragment>
      <div
        className={`task bg-columnBackgroundColor p-2.5 h-[100px] min-h-[100px] rounded-lg cursor-grab items-center flex text-left relative hover:ring-2 hover:ring-insert hover:ring-green-600 ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onOpen}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <p className="my-auto w-full h-[90%] overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {task.content}
        </p>

        {/* delete button */}
        {hovered && (
          <button
            className="stroke-gray-300 absolute right-4 top-1/2 -translate-y-1/2 bg-mainBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
            onClick={() => deleteTask(task.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <TaskModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          editMode={true}
          taskContent={task.content}
          taskId={task.id}
          boardId={boardId}
          columnId={task.columnId}
          
        />
      )}
    </Fragment>
  )
}

export default TaskCard