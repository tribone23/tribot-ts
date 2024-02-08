import axios from 'axios'

type Tiktok = {
    status: string
    by: string
    message: string
    data: {
        author: string
        url: string
    }
}

type TiktokApiResponse = {
    data: Tiktok[]
}

export async function getTiktokVideo(url: string) {
    try {
        const { data } = await axios.get<TiktokApiResponse>(
            `https://api-tools.tribone.my.id/servertiktok3?url=${url}`,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )

        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('[ERROR] Axios: ', error.message)
            return error.message
        } else {
            console.log('[ERROR]', error)
            return 'An unexpected error occurred'
        }
    }
}

