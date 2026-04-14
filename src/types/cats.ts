export type Cat = {
  id: string;
  name: string;
  image: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
};

export type CatsResponse = {
  cats: Cat[];
  totalPages: number;
};