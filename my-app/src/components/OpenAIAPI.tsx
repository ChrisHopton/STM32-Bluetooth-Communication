import React, { useState, useEffect } from 'react';

const ChatApp: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const resp = await fetch("https://chat.openai.com/api/auth/session");
        if (resp.status === 403) {
          throw new Error('CLOUDFLARE');
        }
        const data = await resp.json();
        if (!data.accessToken) {
          throw new Error('ERROR No token');
        }
        return data.accessToken;
      } catch (err) {
        throw new Error('ERROR idk');
      }
    };

    const getResponse = async (question: string) => {
      try {
        const accessToken = await getToken();
        const res = await fetch("https://chat.openai.com/backend-api/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
          },
          body: JSON.stringify({
            action: "next",
            messages: [
              {
                id: uid(),
                role: "user",
                content: {
                  content_type: "text",
                  parts: [question]
                }
              }
            ],
            model: "text-davinci-002-render",
            parent_message_id: uid()
          })
        });
        const reader = res.body.getReader();
        let responseData = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (done === undefined || value === undefined) {
            throw new Error('ERROR');
          }
          responseData += new TextDecoder().decode(value);
        }

        setResponse(responseData);
      } catch (e) {
        setResponse(e.message);
      }
    };

    // Example usage:
    const question = "Your question goes here";
    getResponse(question);
  }, []);

  return (
    <div>
      {/* Render the response or loading/error messages */}
      {response === null ? 'Loading...' : response}
    </div>
  );
};

export default ChatApp;
