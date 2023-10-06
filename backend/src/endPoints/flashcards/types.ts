

export type Flashcards = {
    frontside: string | null,
    frontside_media: string | null,
    frontside_media_positioning: string | null,
    backside: string | null,
    backside_media: string | null,
    backside_media_positioning: string | null
}

export enum LearningStatus {
    learnable = 1,
    notLearnable = 0
}