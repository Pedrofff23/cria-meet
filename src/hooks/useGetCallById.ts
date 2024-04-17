import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { use, useEffect, useState } from "react";

export const useGetCallById = (id: string | string[]) => {
    const [call, setCall] = useState<Call>();
    const [loading, setLoading] = useState(true);

    const client = useStreamVideoClient();

    useEffect(() => {
        if (!client) return;

        const loadCall = async () => {
            const { calls } = await client.queryCalls({
                filter_conditions: {
                    id,
                },
            });

            if (calls.length > 0) {
                setCall(calls[0]);
            }
            
            setLoading(false);
        };

        loadCall();
    }, [client, id]);


    return { call, loading };
};
