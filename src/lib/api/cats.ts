export interface GetCatsParams {
  page?: number;
  search?: string;
  breed?: string;
  age?: string;
  gender?: string;
}

export async function getCats(params: GetCatsParams) {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.search) query.append("search", params.search);
  if (params.breed && params.breed !== "all") query.append("breed", params.breed);
  if (params.age && params.age !== "all") query.append("age", params.age);
  if (params.gender && params.gender !== "all") query.append("gender", params.gender);

  const res = await fetch(`/api/cats?${query.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch cats");

  return res.json();
}