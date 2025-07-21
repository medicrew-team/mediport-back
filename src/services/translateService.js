const speech = require('@google-cloud/speech');
const { Translate } = require('@google-cloud/translate').v2;
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');

const speechClient = new speech.SpeechClient();
const translate = new Translate();
const ttsClient = new textToSpeech.TextToSpeechClient();
// 오디오 파일을 처리하기 위한 라이브러리
const ffmpeg = require('fluent-ffmpeg');

// 언어 코드 매핑 객체
const languageCodeMap = {
    'en': 'en-US',
    'ko': 'ko-KR',
    'ja': 'ja-JP',
    'zh': 'zh-CN',
    'zh-cn': 'zh-CN',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'km': 'km-KH',
    'vi': 'vi-VN',
    'th': 'th-TH',
    'fil': 'fil-PH'
    // 필요에 따라 다른 언어 추가
};

// 음성파일을 텍스트로 변환
async function speechToText(filePath, sourceLanguage) {
    // 오디오 파일을 WAV 형식으로 변환
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
    // 변환된 WAV 파일을 읽어 텍스트로 변환
    const file = fs.readFileSync(tempOutputPath);
    const audioBytes = file.toString('base64');
    fs.unlinkSync(tempOutputPath); // 임시 파일 삭제
    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: languageCodeMap[sourceLanguage.toLowerCase()] || sourceLanguage,
    };
    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    return transcription;
}

// 텍스트를 번역
async function translateText(text, targetLanguage) {
    let [translations] = await translate.translate(text, targetLanguage);
    translations = Array.isArray(translations) ? translations : [translations];
    return translations[0];
}

// 텍스트를 음성으로 변환 후 저장
async function textToSpeechAndSave(text, targetLanguage) {
    const lowerTarget = targetLanguage.toLowerCase();
    const voiceConfig = {
            languageCode: languageCodeMap[lowerTarget] || lowerTarget,
            ssmlGender: 'FEMALE'
        };
    
    const request = {
        input: { text: text },
        voice: voiceConfig,
        audioConfig: { audioEncoding: 'MP3' },
    };

    console.log('Attempting TTS with request:', JSON.stringify(request, null, 2));

    try {
        const [response] = await ttsClient.synthesizeSpeech(request);
        return response.audioContent;
    } catch (error) {
        console.error('TTS synthesis failed for language:', targetLanguage, 'Error:', error.message);
        return null; // TTS 실패 시 null 반환
    }
}

const sttTranslateTts = async (filePath, sourceLanguage, targetLanguage) => {
    try {
        // 음성 파일을 텍스트로 변환
        console.log('1. Starting STT...');
        const text = await speechToText(filePath, sourceLanguage);
        console.log('2. STT Result (Original Text):', text);

        if (!text) {
            throw new Error('STT_FAILED');
        }

        // 텍스트를 번역
        console.log(`3. Translating to ${targetLanguage}...`);
        const translatedText = await translateText(text, targetLanguage);
        console.log('4. Translation Result:', translatedText);

        if (!translatedText) {
            throw new Error('TRANSLATION_FAILED');
        }

        // 번역된 텍스트를 음성으로 변환 시도
        console.log('5. Starting TTS...');
        const audioContent = await textToSpeechAndSave(translatedText, targetLanguage);
        
        // 임시 파일 삭제
        fs.unlinkSync(filePath);

        if (audioContent) {
            console.log('6. TTS finished successfully.');
            return { audioContent: audioContent, translatedText: translatedText, tts_unsupported: false };
        } else {
            console.log('6. TTS 지원을 하지 않는 언어 입니다.');
            return { translatedText: translatedText, tts_unsupported: true, messageKey: 'TTS_NOT_SUPPORTED' };
        }

    } catch (error) {
        console.error('Error in sttTranslateTts process:', error);
        // 임시 파일이 남아있으면 삭제
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error; // 에러를 상위로 전파
    }
};

module.exports = {
    sttTranslateTts,
};