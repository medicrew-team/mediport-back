const speech = require('@google-cloud/speech');
const { Translate } = require('@google-cloud/translate').v2;
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const speechClient = new speech.SpeechClient();
const translate = new Translate();
const ttsClient = new textToSpeech.TextToSpeechClient();

// 언어 코드 매핑 객체 (TTS용)
const languageCodeMap = {
    'en': 'en-US',
    'ko': 'ko-KR',
    'ja': 'ja-JP',
    'zh-cn': 'cmn-CN', // 중국어 간체
    'es': 'es-ES',
    'fr': 'fr-FR',
    'vi': 'vi-VN',
    'th': 'th-TH',
    'fil': 'fil-PH', // 필리핀어
    'km' : 'km-KH', // 크메르어
};

// 음성 파일을 텍스트로 변환 (STT)
async function speechToText(filePath, sourceLanguage) {
    const tempOutputPath = `${filePath}.wav`;
    await new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .toFormat('wav')
            .audioChannels(1)
            .audioFrequency(16000)
            .on('error', (err) => reject(err))
            .on('end', () => resolve())
            .save(tempOutputPath);
    });

    const file = fs.readFileSync(tempOutputPath);
    fs.unlinkSync(tempOutputPath); 

    const audio = { content: file.toString('base64') };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: sourceLanguage, 
    };
    const request = { audio, config };

    const [response] = await speechClient.recognize(request);
    return response.results.map(result => result.alternatives[0].transcript).join('\n');
}

// 텍스트를 번역
async function translateText(text, targetLanguage) {
    let [translations] = await translate.translate(text, targetLanguage);
    return Array.isArray(translations) ? translations[0] : translations;
}

// 텍스트를 음성으로 변환 (TTS)
async function textToSpeechAndSave(text, targetLanguage) {
    const lowerTarget = targetLanguage.toLowerCase(); // 'zh-CN' -> 'zh-cn'
    const languageCode = languageCodeMap[lowerTarget];

    // TTS 지원 여부 확인
    if (!languageCode) {
        return null;
    }

    const request = {
        input: { text: text },
        voice: { languageCode: languageCode, ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await ttsClient.synthesizeSpeech(request);
        return response.audioContent;
    } catch (error) {
        console.error(`TTS synthesis failed for language: ${targetLanguage}`, error);
        return null;
    }
}

// 음성 -> 텍스트 -> 번역 -> 음성
const sttTranslateTts = async (filePath, sourceLanguage, targetLanguage) => {
    try {
        
        const originalText = await speechToText(filePath, sourceLanguage);
        if (!originalText) throw new Error('STT_FAILED');
        const translatedText = await translateText(originalText, targetLanguage);
        if (!translatedText) throw new Error('TRANSLATION_FAILED');
        const audioContent = await textToSpeechAndSave(translatedText, targetLanguage);
        if (audioContent) {
            return { originalText, translatedText, audioContent, tts_unsupported: false };
        } else {
            return { originalText, translatedText, audioContent: null, tts_unsupported: true };
        }
    } catch (error) {
        console.error('Error in sttTranslateTts process:', error);
        throw error;
    } finally {
        // 컨트롤러로 이동하기 전에 항상 임시 파일 삭제
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

// 텍스트 -> 번역 -> 음성
const textTranslateTts = async (text, targetLanguage) => {
    try {
        const translatedText = await translateText(text, targetLanguage);
        if (!translatedText) throw new Error('TRANSLATION_FAILED');

        const audioContent = await textToSpeechAndSave(translatedText, targetLanguage);

        if (audioContent) {
            return { originalText: text, translatedText, audioContent, tts_unsupported: false };
        } else {
            return { originalText: text, translatedText, audioContent: null, tts_unsupported: true };
        }
    } catch (error) {
        console.error('Error in textTranslateTts process:', error);
        throw error;
    }
};

module.exports = {
    sttTranslateTts,
    textTranslateTts,
};