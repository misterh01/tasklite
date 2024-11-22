export interface IRandImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export const fetchRandomImage = async () => {
  const page = Math.floor(Math.random() * 100) + 1
  const url = `https://picsum.photos/v2/list?page=${page}&limit=8`
  const req = await fetch(url)
  const data: IRandImage[] = await req.json()
  return data
}