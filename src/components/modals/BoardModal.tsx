import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Tooltip } from '@nextui-org/react';
import { fetchRandomImage, IRandImage } from '../../utils';
import { useEffect, useState } from 'react';
import { useBoardsListStore } from '../../store';
import toast from 'react-hot-toast';

interface BoardModalProps {
  editModal?: boolean;
  boardId?: string;
  boardTitle?: string;
  backgroundUrl?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function SettingModal({ editModal = false, boardId, boardTitle, backgroundUrl, isOpen, onOpenChange }: BoardModalProps) {
  const [imgList, setImgList] = useState<IRandImage[]>([])
  const [selectedImg, setSelectedImg] = useState<string>('')
  const [noBg, setNoBg] = useState<boolean>(false)
  const [fetching, setFetching] = useState<boolean>(false)
  const [isInvalid, setIsInvalid] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(boardTitle || '')

  const createBoard = useBoardsListStore((state) => state.addBoard)
  const updateBoard = useBoardsListStore((state) => state.updateBoard)

  const onCreate = () => {
    if (title.length === 0 || title.trim().length === 0) {
      setIsInvalid(true)
      return
    }

    if (editModal && boardId) {
      updateBoard(boardId, title.trim(), imgList.find((img) => img.id === selectedImg)?.download_url || '')
    } else {
      createBoard(title.trim(), imgList.find((img) => img.id === selectedImg)?.download_url || '')
    }
    onOpenChange(false)

    toast.success(`Board ${editModal ? 'updated' : 'created'} successfully!`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
      duration: 2000
    })

    // reset states
    setTitle('')
    setNoBg(false)
    setSelectedImg('')
    setIsInvalid(false)
  }

  useEffect(() => {
    setFetching(true)
    fetchRandomImage().then((data) => {
      if (editModal) {
        if (backgroundUrl) {
          data[0].download_url = backgroundUrl;
          setSelectedImg(data[0].id)
        } else {
          setNoBg(true)
        }
      }

      setImgList(data)
      setFetching(false)
    })
  }, [])

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{editModal ? "Update" : "Create"} Board</ModalHeader>

            <ModalBody>
              <Input
                type="text"
                label="Title"
                maxLength={70}
                endContent={
                  <div className="text-md text-default-400 ">
                    {title.length}/70
                  </div>
                }
                errorMessage={"Title cannot be empty!"}
                isInvalid={isInvalid}
                value={title}
                onChange={(e) => {
                  if (isInvalid) setIsInvalid(false)

                  setTitle(e.target.value)
                }}
                className='border-success-500'
              />

              <div className="flex justify-between mt-3 -mb-3">
                <h4 className='font-bold text-gray-300'>Background</h4>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNoBg(true)
                      setSelectedImg('')
                    }}
                    className={`border-green-600 font-semibold border rounded py-0.5 px-2 hover:bg-green-600 hover:text-black ${noBg ? "bg-green-600 text-black" : ""}`}>
                    No BG
                  </button>

                  <Tooltip showArrow={true} content="Refresh Background" color='danger' closeDelay={100}>
                    <div
                      className='cursor-pointer mt-1'
                      onClick={() => {
                        fetchRandomImage().then((data) => {
                          if (editModal && backgroundUrl) {
                            data[0].download_url = backgroundUrl;
                            setSelectedImg(data[0].id)
                          }
                          setImgList(data)
                        })
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </div>
                  </Tooltip>
                </div>

              </div>

              {fetching && <Spinner color='success' />}


              {/* display image in a grid */}
              <div className="grid grid-cols-4 gap-3">
                {imgList.map((img, index) => (
                  <img
                    key={index}
                    src={img.download_url}
                    alt={"img"}
                    className={`w-32 h-32 object-cover mt-2 rounded-lg cursor-pointer transform transition-transform duration-100 hover:scale-110 ${selectedImg === img.id ? 'border-2 border-success-500 scale-110' : ''}`}
                    onClick={() => {
                      setSelectedImg(img.id)
                      setNoBg(false)
                    }}
                  />
                ))}
              </div>
              {!editModal &&
                <h4 className='-mt-2 font-semibold text-sm text-gray-400 italic'>These can be change in settings later</h4>
              }

            </ModalBody>

            <ModalFooter className='flex justify-between font-semibold'>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
              <Button color="success" onPress={onCreate}>
                {editModal ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>

  );
}

export default SettingModal