import { client } from "../supabase"

export const getData = async () => {
    const { data, error } = await client.from("hero").select("*").eq("id", "e32e2ff0-8a37-4b44-aded-db033dc95333");

    if (error) {
        console.log(error);
    }

    if (!data) throw new Error("Could not fetch data for hero section");

    return {
        heading: data[0].heading,
        description: data[0].description
    };
}