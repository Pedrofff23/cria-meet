import CallList from "@/components/CallList";

const Gravacoes = () => {
    return (
        <section className="flex size-full flex-col gap-10 text-white ">
            <h1 className="text-3xl font-bold">Gravações</h1>

            <CallList type="recordings" />
        </section>
    );
};

export default Gravacoes;
