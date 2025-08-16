const ADVISOR_API_URL = "http://127.0.0.1:8002/api/chat";

export const askAdvisor = async (prompt: string): Promise<string> => {
    try {
        const payload = {
            message: prompt
        };

        console.log('Sending message to advisor via REST:', JSON.stringify(payload, null, 2));

        const response = await fetch(ADVISOR_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Received response from advisor:', responseData);
        
        // Handle the REST API response (ChatResponse model)
        if (responseData && responseData.response && responseData.status === "success") {
            return responseData.response;
        }
        
        if (responseData && responseData.status === "error") {
            return `Error from advisor: ${responseData.response}`;
        }

        return "Maaf, format response dari AI Advisor tidak dikenali.";
        
    } catch (error: any) {
        console.error("Error communicating with advisor agent:", error);
        
        // More specific error messages
        if (error.message.includes('Failed to fetch')) {
            return "Tidak dapat terhubung ke AI Advisor. Pastikan server berjalan di http://127.0.0.1:8002";
        } else if (error.message.includes('400')) {
            return "Format permintaan tidak valid. Mohon coba lagi.";
        } else if (error.message.includes('500')) {
            return "Terjadi kesalahan pada server AI Advisor.";
        }
        
        return `Kesalahan: ${error.message}`;
    }
};