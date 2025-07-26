const translateService = require('../services/translateService');

// 통합 번역 처리 컨트롤러
const processTranslation = async (req, res) => {
    try {
        const { inputType, sourceLanguage, targetLanguage, text } = req.body;
        const audioFile = req.file;

        let result;

        if (inputType === 'audio') {
            if (!audioFile) {
                return res.status(400).json({ message: 'No audio file uploaded for audio input type.' });
            }
            result = await translateService.sttTranslateTts(audioFile.path, sourceLanguage, targetLanguage);
        } else if (inputType === 'text') {
            if (!text) {
                return res.status(400).json({ message: 'No text provided for text input type.' });
            }
            result = await translateService.textTranslateTts(text, targetLanguage);
        } else {
            return res.status(400).json({ message: 'Invalid inputType specified.' });
        }

        res.json({
            originalText: result.originalText,
            translatedText: result.translatedText,
            audioContentBase64: result.audioContent ? result.audioContent.toString('base64') : null,
            message: result.tts_unsupported ? 'TTS not supported for this language.' : 'Translation successful.'
        });

    } catch (error) {
        console.error('Error in processTranslation:', error);
        res.status(500).json({ message: 'An error occurred during the translation process.' });
    }
};

module.exports = {
    processTranslation,
};
