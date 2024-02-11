export interface AttachmentInfo {
    type: 'video' | 'image' | 'audio'
    url: string
    caption?: string
}