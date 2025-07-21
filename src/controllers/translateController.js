const translateService = require('../services/translateService');

const sttTranslateTts = async (req, res) => {
    try {
        // 클라이언트로부터 받은 오디오 파일과 대상 언어
        const { sourceLanguage,targetLanguage } = req.body;
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).send('No audio file uploaded.');
        }
        // 음성 파일을 텍스트로 변환하고 번역 후 음성으로 변환
        const result = await translateService.sttTranslateTts(audioFile.path,sourceLanguage,targetLanguage);

        // 항상 JSON 응답을 보냅니다.
        res.json({
            translatedText: result.translatedText,
            audioContentBase64: result.audioContent ? result.audioContent.toString('base64') : null, // 오디오가 있으면 Base64로 인코딩
            tts_unsupported: result.tts_unsupported,
            message: result.tts_unsupported ? 'TTS not supported for this language.' : 'TTS successful.'
        });
    } catch (error) {
        console.error(error);
        // 서비스 계층에서 넘어온 에러 메시지 키를 사용하거나, 일반적인 에러 메시지 반환
        const errorMessage = 'Error processing audio.';
        res.status(500).send(errorMessage);
    }
};

module.exports = {
    sttTranslateTts,
};
