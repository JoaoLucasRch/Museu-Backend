export interface SelectOption {

    value: string;

    label: string;

}

export interface Pagination {

    page: number;

    limit: number;

}

export interface BaseEntity {

    id: string;

    createdAt: string;

    updatedAt: string;

}

export type Status =
    | "ATIVO"
    | "INATIVO";

    export type Nullable<T> = T | null;
    