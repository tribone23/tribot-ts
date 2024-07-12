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

type Facebook = {
  url: string;
  sd: string;
  hd: string;
  title: string;
  thumbnail: string;
};

type TiktokApiResponse = {
  data: Tiktok;
};

type ResultTiktok = {
  success: boolean;
  message?: string;
  result?: TiktokApiResponse;
};

type ResultYoutube = {
  success: boolean;
  message?: string;
  result?: Youtube;
};

type ResultFacebook = {
  success: boolean;
  message?: string;
  result?: Facebook;
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
    const { data } = await axios.get<Youtube>(
      `https://sh.zanixon.xyz/api/downloader/ytmp3?url=${url}`,
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

export async function getFacebookVideo(url: string): Promise<ResultFacebook> {
  try {
    const { data } = await axios.get<Facebook>(
      `https://sh.zanixon.xyz/api/downloader/fbdl?url=${url}`,
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
