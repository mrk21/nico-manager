export class Message {
    message: string;
}

export class Session {
    niconico_id: string;
    nickname: string;
    avatar: string;
}

export class SessionAuth {
    mail: string;
    password: string;
}

export class EntryListItem {
    // mylist
    group_id: number;
    
    // entry
    item_type: string;
    item_id: number;
    created_time: string;
    description: string;
    
    // video
    video: {
        video_id: string;
        watch_id: string;
        title: string;
        thumbnail_url: string;
        group_type: string;
        is_deleting: boolean
        created_time: string;
        play_count?: number;
        mylist_count?: number;
        comment_count?: number;
        seconds?: number;
        latest_comment?: string;
    }
}

export class TagListItem {
    name: string;
    count: number;
}
