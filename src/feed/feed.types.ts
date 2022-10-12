
export const POST_TYPES = ["MEDIA", "POLL"];

export enum POST_TYPE_ENUM {
    MEDIA = "MEDIA",
    POLL = "POLL"
}

export enum POST_MEDIA_TYPE_ENUM {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}
export type MEDIA_TYPE = {
    mediaType: string,
    path: string
}