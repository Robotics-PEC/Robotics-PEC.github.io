import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "../components/ui/calendar";
import { addDays } from "date-fns";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
    title: "Components/Calendar",
    component: Calendar,
    args: {},
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const WithSelectedDate: Story = {
    render: () => {
        const [selected, setSelected] = useState<Date | undefined>(new Date());
        return <Calendar mode="single" selected={selected} onSelect={setSelected} />;
    },
};

export const RangeSelection: Story = {
    render: () => {
        const [range, setRange] = useState<{ from?: Date; to?: Date }>({
            from: new Date(),
            to: addDays(new Date(), 5),
        });

        return (
            <Calendar
                mode="range"
                numberOfMonths={2}
            />
        );
    },
};
