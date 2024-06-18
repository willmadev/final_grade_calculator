import { baseUrl } from "./config";

export const fetchApi = async (
  input: string,
  method: string = "GET",
  body?: any
) => {
  const res = await fetch(`${baseUrl}${input}`, {
    method: method || "GET",
    body: JSON.stringify(body),
    credentials: "include",
    headers:
      method === "GET"
        ? undefined
        : {
            "Content-Type": "application/json",
          },
  });
  if (!res.ok) throw new Error(`Error fetching ${input}`);
  if (res.status === 204) return;
  return await res.json();
};
