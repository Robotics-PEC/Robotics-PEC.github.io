import { client } from "../supabase";
import { FormEventType } from "@/types";

export const getEvents = async () => {
    const { data, error } = await client.from("events").select("*");

    if (error) {
        console.log(error);
    }

    return data;
};

export const uploadEvent = async (event: FormEventType) => {
    const { id, ...rest } = event;
    const { error } = await client.from("events").insert(rest);

    if (error) {
        console.log(error);
        return error;
    }

    return null;
};

export const deleteEvent = async (id: string) => {
    const response = await client.from("events").delete().eq("id", id);
    return response;
};

export const updateEvent = async (event: FormEventType) => {
    const { id, ...rest } = event;
    const { error } = await client.from("events").update(rest).eq("id", id);

    if (error) {
        console.log(error);
    }
    return error;
};

export const updateEventAttendance = async (id: string, attendanceOpen: boolean) => {
    const { error } = await client.from("events").update({ attendanceOpen }).eq("id", id);
    return error;
};

export const updateEventRegistration = async (id: string, registrationOpen: boolean) => {
    const { error } = await client.from("events").update({ registrationOpen }).eq("id", id);
    return error;
};

export const getEventById = async (id: string) => {
    return await client.from("events").select("*").eq("id", id).single();
};



