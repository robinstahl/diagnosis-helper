import { useState } from 'react';

interface DiagnosisResponse {
  DIAG: string[];
  MED: string[];
  TREAT: string[];
  input: string;
}

interface ClassificationResponse {
  id: string;
  model: string;
  data: DiagnosisResponse;
}

interface UseClassifyTextHook {
  classifyText: (
    model: 'TinyBrollt' | 'GelectraLarge',
    text: string
  ) => Promise<DiagnosisResponse | null>;
  loading: boolean;
  error: string | null;
}

const useClassifyText = (): UseClassifyTextHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const classifyText = async (
    model: 'TinyBrollt' | 'GelectraLarge',
    text: string
  ): Promise<DiagnosisResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3030/classifyText/${model}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ClassificationResponse = await response.json();
      return data.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { classifyText, loading, error };
};

export default useClassifyText;
