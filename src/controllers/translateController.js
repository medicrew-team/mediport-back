const translateService = require('../services/translateService');

// 통합 번역 처리 컨트롤러
const processTranslation = async (req, res) => {
    try {
        const { sourceLanguage, targetLanguage, text } = req.body;
        const audioFile = req.file;

        let result;

        if (audioFile) {
            // 음성 파일 번역
            result = await translateService.sttTranslateTts(audioFile.path, sourceLanguage, targetLanguage);
        } else if (text) {
            // 텍스트 번역
            result = await translateService.textTranslateTts(text, targetLanguage);
        } else {
            return res.status(400).json({ message: 'No valid input provided (need audio or text).' });
        }

        res.json({
            originalText: result.originalText,
            translatedText: result.translatedText,
            audioContentBase64: result.audioContent ? result.audioContent.toString('base64') : null,
            message: result.tts_unsupported 
                ? 'TTS not supported for this language.' 
                : 'Translation successful.'
        });

    } catch (error) {
        console.error('Error in processTranslation:', error);
        res.status(500).json({ message: 'An error occurred during the translation process.' });
    }
};

module.exports = {
    processTranslation,
};
