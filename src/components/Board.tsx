import { Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Tooltip, useDisclosure } from '@nextui-org/react'
import { FC, Fragment, useState } from 'react'
import { IBoard } from '../store/boardsListStore'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { useLocation } from "wouter";
import SettingModal from './modals/BoardModal';
import DeleteModal from './modals/DeleteModal';


interface BoardProps {
  board: IBoard,
  grabbing: boolean
}

const Board: FC<BoardProps> = (props) => {
  const [_, setLocation] = useLocation();
  const [hovered, setHovered] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.board.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  if (isDragging) {
    if (hovered) setHovered(false)
    return (
      <Card
        className='border-2 border-green-600 h-[240px] opacity-50'
        shadow="sm"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    )
  }


  return (
    <Fragment>
      <Card
        shadow="sm"
        className={`${props.grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onPress={() => setLocation(`/boards/${props.board.id}`)}
        onMouseEnter={() => {
          if (!props.grabbing) setHovered(true)
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <CardBody
          className="relative overflow-visible p-0"
        >
          <div className="relative">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              onClick={() => setLocation(`/boards/${props.board.id}`)}
              alt={props.board.title}
              className="w-full object-cover h-[200px]"
              src={props.board.backgroundUrl}
            />

            {hovered && (
              <Dropdown>
                <DropdownTrigger>
                  <div
                    className="absolute top-2 right-2 z-50 bg-black p-1 rounded-lg opacity-40 hover:opacity-100 hover:cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem 
                    onClick={() => {
                      setHovered(false)
                      onOpen()
                    }}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem 
                    className="bg-red-700 font-semibold"
                    onClick={() => {
                      setHovered(false)
                      onDeleteOpen()
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </CardBody>
        <CardFooter
          className="text-small justify-between cursor-pointer"
        >
          <div className="w-[75%] truncate text-left">
            {props.board.title.length > 20 ? (
              <Tooltip
                content={props.board.title}
                closeDelay={100}
                showArrow={true}
              >
                <b className="text-left">{props.board.title}</b>
              </Tooltip>
            ) : (
              <b>{props.board.title}</b>
            )}
          </div>

          {props.board.columns.length > 0 &&
            <p className="text-default-500">{props.board.columns.length} Cols</p>
          }
        </CardFooter>
      </Card>

      {isOpen && (
        <SettingModal
          editModal={true}
          boardId={props.board.id}
          boardTitle={props.board.title}
          backgroundUrl={props.board.backgroundUrl}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}

      {isDeleteOpen && (
        <DeleteModal
          boardId={props.board.id}
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
        />
      )}
    </Fragment>
  )
}

export default Board