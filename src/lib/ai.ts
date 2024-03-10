import axios from 'axios';

export type Response = {
  status: string;
  body: string;
};

export type ApiResponseAi = Response[];

export async function checkCharId(charid: string): Promise<ApiResponseAi> {
  try {
    const { data } = await axios.get<Response[]>(
      `http://localhost:8080/ai?charid=${charid}`,
    );

    const result = data;

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('[ERROR] Axios: ', error.message);

      const result: ApiResponseAi = [
        {
          status: 'error',
          body: error.message,
        },
      ];
      return result;
    } else {
      console.log('[ERROR]', error);

      const result: ApiResponseAi = [
        {
          status: 'error',
          body: 'An unexpected error occurred',
        },
      ];
      return result;
    }
  }
}

export async function chatWithAi(
  charid: string,
  msg: string,
): Promise<ApiResponseAi> {
  try {
    const { data } = await axios.get<Response[]>(
      `http://localhost:8080/message?charid=${encodeURIComponent(charid)}&body=${encodeURIComponent(msg)}`,
    );

    const result = data;

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('[ERROR] Axios: ', error.message);

      const result: ApiResponseAi = [
        {
          status: 'error',
          body: error.message,
        },
      ];
      return result;
    } else {
      console.log('[ERROR]', error);

      const result: ApiResponseAi = [
        {
          status: 'error',
          body: 'An unexpected error occurred',
        },
      ];
      return result;
    }
  }
}
