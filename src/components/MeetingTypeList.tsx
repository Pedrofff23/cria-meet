/* eslint-disable camelcase */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import HomeCard from "./HomeCard";

const initialValues = {
    dateTime: new Date(),
    description: "",
    link: "",
};

const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<
        | "isScheduleMeeting"
        | "isJoiningMeeting"
        | "isInstantMeeting"
        | undefined
    >(undefined);

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img="/icons/add-meeting.svg"
                title="Nova Reunião"
                description="Comece uma reunião instantânea"
                handleClick={() => setMeetingState("isInstantMeeting")}
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Entrar na Reunião"
                description="Usar link de convite"
                className="bg-blue-1"
                handleClick={() => setMeetingState("isJoiningMeeting")}
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Agendar Reunião"
                description=" Marque uma reunião futura"
                className="bg-purple-1"
                handleClick={() => setMeetingState("isScheduleMeeting")}
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="Ver Gravações"
                description="Gravações de reuniões passadas"
                className="bg-yellow-1"
                handleClick={() => router.push("/gravacoes")}
            />
        </section>
    );
};

export default MeetingTypeList;
