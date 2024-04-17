/* eslint-disable camelcase */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import HomeCard from "./HomeCard";
import Loader from "./Loader";
import MeetingModal from "./MeetingModal";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt";
import { Input } from "./ui/input";

registerLocale("pt", pt);

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
    const [values, setValues] = useState(initialValues);
    const [callDetail, setCallDetail] = useState<Call>();
    const client = useStreamVideoClient();
    const { user } = useUser();
    const { toast } = useToast();

    const createMeeting = async () => {
        if (!client || !user) return;

        try {
            if (!values.dateTime) {
                toast({
                    title: "Por favor selecione uma data e hora válida",
                });
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call("default", id);
            if (!call) throw new Error("Failed to create meeting");
            const startsAt =
                values.dateTime.toISOString() ||
                new Date(Date.now()).toISOString();
            const description = values.description || "Instant Meeting";
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    },
                },
            });

            setCallDetail(call);

            if (!values.description) {
                router.push(`/meeting/${call.id}`);
            }

            toast({
                title: "Reunião criada com sucesso!",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Falha na criação da reunião",
            });
        }
    };

    if (!client || !user) return <Loader />;

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img="/icons/add-meeting.svg"
                title="Nova reunião"
                description="Comece uma reunião instantânea"
                handleClick={() => setMeetingState("isInstantMeeting")}
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Entrar em uma reunião"
                description="Usando um link de convite"
                className="bg-blue-1"
                handleClick={() => setMeetingState("isJoiningMeeting")}
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Marcar reunião"
                description="Marque a data da sua reunião"
                className="bg-purple-1"
                handleClick={() => setMeetingState("isScheduleMeeting")}
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="Gravações"
                description="Gravações de reuniões passadas"
                className="bg-yellow-1"
                handleClick={() => router.push("/gravacoes")}
            />

            {!callDetail ? (
                <MeetingModal
                    isOpen={meetingState === "isScheduleMeeting"}
                    onClose={() => setMeetingState(undefined)}
                    title="Agende uma reunião"
                    handleClick={createMeeting}
                >
                    <div className="flex flex-col gap-2.5">
                        <label className="text-base font-normal leading-[22.4px] text-sky-2">
                            Adicione uma descrição
                        </label>
                        <Textarea
                            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex w-full flex-col gap-2.5">
                        <label className="text-base font-normal leading-[22.4px] text-sky-2">
                            Selecione a data e hora
                        </label>
                        <ReactDatePicker
                            selected={values.dateTime}
                            onChange={(date) =>
                                setValues({ ...values, dateTime: date! })
                            }
                            locale={pt}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Hora"
                            dateFormat="dd/MM/yyyy HH:mm"
                            className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === "isScheduleMeeting"}
                    onClose={() => setMeetingState(undefined)}
                    title="Reaunião agendada com sucesso!"
                    image={"/icons/checked.svg"}
                    buttonIcon="/icons/copy.svg"
                    className="text-center"
                    buttonText="Copiar link da reunião"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({
                            title: "Link copiado com sucesso!",
                        });
                    }}
                />
            )}

            <MeetingModal
                isOpen={meetingState === "isJoiningMeeting"}
                onClose={() => setMeetingState(undefined)}
                title="Type the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(values.link)}
            >
                <Input
                    placeholder="Link da Reunião"
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) =>
                        setValues({ ...values, link: e.target.value })
                    }
                />
            </MeetingModal>

            <MeetingModal
                isOpen={meetingState === "isInstantMeeting"}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    );
};

export default MeetingTypeList;
