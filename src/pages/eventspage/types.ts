export type EventWhen = {
    date?: string;
    from?: string;
    to?: string;
    [key: string]: unknown;
};

export type EventRemote = {
    id?: string;
    name?: string;
    price?: number | string;
    where?: string;
    when?: EventWhen;
    [key: string]: unknown;
};

export type EventMapped = {
    id?: string;
    day: string;
    month: string;
    title: string;
    subtitle: string;
    time: string;
    price: string;
    [key: string]: unknown;
};