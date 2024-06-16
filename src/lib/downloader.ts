import axios from 'axios';

type Tiktok = {
  status: string;
  by: string;
  message: string;
  author: string;
  url: string;
};

type Youtube = {
  title: string;
  url: string;
  format: string;
  creator_api: string;
};

type TiktokApiResponse = {
  data: Tiktok;
};

type YoutubeApiResponse = {
  data: Youtube;
};


type ResultTiktok = {
  success: boolean;
  message?: string;
  result?: TiktokApiResponse;
};

type ResultYoutube = {
  success: boolean;
  message?: string;
  result?: YoutubeApiResponse;
};

export async function getTiktokVideo(url: string): Promise<ResultTiktok> {
  try {
    const { data } = await axios.get<TiktokApiResponse>(
      `https://api-tools.tribone.my.id/servertiktok3?url=${url}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const result = {
      success: true,
      result: data,
    };

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('[ERROR] Axios: ', error.message);

      const result = {
        success: false,
        message: error.message,
      };
      return result;
    } else {
      console.log('[ERROR]', error);
      const result = {
        success: false,
        message: 'An unexpected error occurred',
      };
      return result;
    }
  }
}

export async function getYoutubeVideo(url: string): Promise<ResultYoutube> {
  try {
    const { data } = await axios.get<YoutubeApiResponse>(
      `https://api-tools.tribone.my.id/servertiktok3?url=${url}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const result = {
      success: true,
      result: data,
    };

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('[ERROR] Axios: ', error.message);

      const result = {
        success: false,
        message: error.message,
      };
      return result;
    } else {
      console.log('[ERROR]', error);
      const result = {
        success: false,
        message: 'An unexpected error occurred',
      };
      return result;
    }
  }
}
