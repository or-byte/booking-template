import { JSX } from "solid-js";
import { Image } from "~/lib/product";

type BookingRoomCardProps = {
    image: Image;
    title: string;
    priceLabel?: string;
    class?: string;
};

export default function BookingRoomCard(
    props: BookingRoomCardProps
): JSX.Element {
    return (
        <div
            class={`
            group
            relative
            w-full
            h-[180px]
            sm:h-[220px]
            md:h-[260px]
            lg:h-[300px]
            rounded-2xl
            overflow-hidden
            shadow-md
            hover:shadow-xl
            transition-all duration-300
                ${props.class ?? ""}
            `}
        >
            <img
                src={props.image.url}
                alt={props.image.title}
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div class="absolute bottom-4 left-4 text-white group-hover:shadow-xl">
                {props.priceLabel && (
                    <p class="text-sm opacity-90 text-left">{props.priceLabel}</p>
                )}
                <h2 class="text-2xl font-serif font-semibold">
                    {props.title}
                </h2>
            </div>
        </div>
    );
}