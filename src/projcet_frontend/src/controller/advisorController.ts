import { storage } from '../utils/storage';

const ADVISOR_API_URL = process.env.REACT_APP_ADVISOR_API_URL || "https://34.122.202.222:8002/api/chat";

export const askAdvisor = async (prompt: string): Promise<string> => {
    try {
        // Get current user from storage
        const currentUser = storage.getUser();
        const userId = currentUser?.id || null;

        const payload = {
            message: prompt,
            userId: userId  // Include user ID in the request
        };

        // DEBUG: Log environment and URL details
        console.log('🔍 [ADVISOR DEBUG] Environment check:');
        console.log('🔍 [ADVISOR DEBUG] - Current location protocol:', window.location.protocol);
        console.log('🔍 [ADVISOR DEBUG] - Advisor API URL:', ADVISOR_API_URL);
        console.log('🔍 [ADVISOR DEBUG] - Is HTTPS page with HTTP API?', window.location.protocol === 'https:' && ADVISOR_API_URL.startsWith('http://'));
        console.log('🔍 [ADVISOR DEBUG] Sending message to advisor via REST:', JSON.stringify(payload, null, 2));

        const response = await fetch(ADVISOR_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            // Add timeout and credentials handling
            signal: AbortSignal.timeout(30000), // 30 second timeout
            credentials: 'same-origin'
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
            return "Tidak dapat terhubung ke AI Advisor. Pastikan koneksi internet stabil dan server tersedia di http://34.122.202.222:8002/api/chat";
        } else if (error.message.includes('400')) {
            return "Format permintaan tidak valid. Mohon coba lagi.";
        } else if (error.message.includes('500')) {
            return "Terjadi kesalahan pada server AI Advisor.";
        }
        
        return `Kesalahan: ${error.message}`;
    }
};