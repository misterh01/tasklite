import { create } from "zustand";
import { generateId } from "../utils";

export type IColumn = {
  id: string;
  title: string;
}

export type ITask = {
  id: string;
  columnId: string;
  content: string;
}

export interface IBoard {
  id: string;
  title: string;
  backgroundUrl: string;
  columns: IColumn[];
  tasks: ITask[];
}

type BoardsListStore = {
  boards: IBoard[];
  addBoard: (title: string, backgroundUrl: string) => void;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, title: string, backgroundUrl: string) => void;
  swapBoardPosition: (fromIndex: number, toIndex: number) => void;
  addColumn: (boardId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  updateColumn: (boardId: string, columnId: string, title: string) => void;
  swapColumnPosition: (boardId: string, fromIndex: number, toIndex: number) => void;
  addTask: (boardId: string, columnId: string, content: string) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  updateTask: (boardId: string, taskId: string, content: string) => void;
  swapTaskPosition: (boardId: string, fromIndex: number, toIndex: number) => void;
  swapTaskColumn: (boardId: string, taskId: string, toColumnId: string) => void;
};

export const useBoardsListStore = create<BoardsListStore>((set) => {
  const savedBoards = localStorage.getItem("taskLiteBoards");
  const initialBoards: IBoard[] = savedBoards ? JSON.parse(savedBoards) : [];

  return {
    boards: initialBoards,
    addBoard: (title: string, backgroundUrl: string) => {
      set((state) => {
        const updatedBoards = [
          ...state.boards,
          { id: generateId(), title, backgroundUrl, columns: [], tasks: [] },
        ];
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    updateBoard: (id: string, title: string, backgroundUrl: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === id) {
            return { ...board, title, backgroundUrl };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    swapBoardPosition: (fromIndex: number, toIndex: number) => {
      set((state) => {
        const boards = [...state.boards];
        const [removed] = boards.splice(fromIndex, 1);
        boards.splice(toIndex, 0, removed);
        updateLocalStorage(boards);
        return { boards };
      });
    },
    deleteBoard: (id: string) => {
      set((state) => {
        const updatedBoards = state.boards.filter((board) => board.id !== id);
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    addColumn: (boardId: string, title: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              columns: [...(board.columns || []), { id: generateId(), title }],
            };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    deleteColumn: (boardId: string, columnId: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              columns: board.columns.filter((column) => column.id !== columnId),
            };
          }
          return board;
        });

        // Delete tasks in the column
        const columnTasks = updatedBoards.find((board) => board.id === boardId)?.tasks || [];
        const updatedTasks = columnTasks.filter((task) => task.columnId !== columnId);

        updatedBoards.forEach((board) => {
          if (board.id === boardId) {
            board.tasks = updatedTasks;
          }
        });

        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    updateColumn: (boardId: string, columnId: string, title: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              columns: board.columns.map((column) => {
                if (column.id === columnId) {
                  return { ...column, title };
                }
                return column;
              }),
            };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    swapColumnPosition: (boardId: string, fromIndex: number, toIndex: number) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            const columns = [...board.columns];
            const [removed] = columns.splice(fromIndex, 1);
            columns.splice(toIndex, 0, removed);
            return { ...board, columns };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    addTask: (boardId: string, columnId: string, content: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              tasks: [...(board.tasks || []), { id: generateId(), columnId, content }],
            };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    deleteTask: (boardId: string, taskId: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              tasks: board.tasks.filter((task) => task.id !== taskId),
            };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    updateTask: (boardId: string, taskId: string, content: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === taskId) {
                  return { ...task, content };
                }
                return task;
              }),
            };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    swapTaskPosition: (boardId: string, fromIndex: number, toIndex: number) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            const tasks = [...board.tasks];
            const [removed] = tasks.splice(fromIndex, 1);
            tasks.splice(toIndex, 0, removed);
            return { ...board, tasks };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
    swapTaskColumn: (boardId: string, taskId: string, toColumnId: string) => {
      set((state) => {
        const updatedBoards = state.boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === taskId) {
                  return { ...task, columnId: toColumnId };
                }
                return task;
              }),
            };
          }
          return board;
        });
        updateLocalStorage(updatedBoards);
        return { boards: updatedBoards };
      });
    },
  };
});

// Helper function to update localStorage
const updateLocalStorage = (boards: IBoard[]) => {
  localStorage.setItem("taskLiteBoards", JSON.stringify(boards));
};
