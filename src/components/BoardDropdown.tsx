import { Select, SelectItem } from "@nextui-org/react";
import { useBoardsListStore } from "../store";
import { useLocation } from "wouter";

interface BoardDropdownProps {
  activeBoardId: string;
}

function BoardDropdown({ activeBoardId }: BoardDropdownProps) {
  const boards = useBoardsListStore(state => state.boards)
  const [_, setLocation] = useLocation()

  return (
    <div className="mx-10 mt-4">
      <Select
        size="lg"
        label="Active Board:"
        className="max-w-xs"
        classNames={{
          label: 'text-lg font-semibold mt-1',
          trigger: 'bg-mainBackgroundColor text-white hover:bg-mainBackgroundColor hover:text-white',
          popoverContent: 'bg-mainBackgroundColor text-white',
        }}
        selectedKeys={[activeBoardId]}
        onChange={(e) => {
          if(e.target.value) {
            setLocation(`/boards/${e.target.value}`)
          }
        }}
      >
        {boards.map(board => (
          <SelectItem key={board.id}>
            {board.title}
          </SelectItem>
        ))}

      </Select>
    </div>
  );
}

export default BoardDropdown;