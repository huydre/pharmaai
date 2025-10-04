/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InferenceSession, Tensor } from 'onnxruntime-node';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnModuleInit {
  private session: InferenceSession;

    getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    try {
      this.session = await InferenceSession.create('./src/assets/skin_model.onnx');
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading ONNX model:', error);
      throw new Error('Failed to load ONNX model');
    }
  }

  async predict(file: Express.Multer.File): Promise<{ label: string; confidence: number }> {
    // Preprocess ảnh
    const imageBuffer = await sharp.default(file.path)
      .resize(224, 224)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelData = new Float32Array(imageBuffer.data);
    // Normalize (giả sử mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    for (let i = 0; i < pixelData.length; i++) {
      pixelData[i] = (pixelData[i] / 255 - 0.5) / 0.5;
    }

    // Chuyển sang tensor [1, 3, 224, 224]
    const tensorData = new Float32Array(1 * 3 * 224 * 224);
    for (let y = 0; y < 224; y++) {
      for (let x = 0; x < 224; x++) {
        for (let c = 0; c < 3; c++) {
          tensorData[c * 224 * 224 + y * 224 + x] = pixelData[(y * 224 + x) * 3 + c];
        }
      }
    }


  const tensor = new Tensor('float32', tensorData, [1, 3, 224, 224]);

  // Lấy đúng tên input/output từ model
  const inputName = this.session.inputNames[0];
  const outputName = this.session.outputNames[0];
  const feeds = { [inputName]: tensor };
  const results = await this.session.run(feeds);
  const output = results[outputName].data as Float32Array;

    // Tính softmax để lấy confidence
    let maxVal = -Infinity;
    let maxIndex = 0;
    for (let i = 0; i < output.length; i++) {
      if (output[i] > maxVal) {
        maxVal = output[i];
        maxIndex = i;
      }
    }
    const expScores = output.map(Math.exp);
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const confidence = expScores[maxIndex] / sumExp;

    // Label map tiếng Anh
    const englishLabels = [
      'acne',
      'acne-vulgaris',
      'actinic-keratosis',
      'basal-cell-carcinoma',
      'basal-cell-carcinoma-morpheiform',
      'dermatofibroma',
      'dermatomyositis',
      'dyshidrotic-eczema',
      'eczema',
      'epidermal-nevus',
      'folliculitis',
      'kaposi-sarcoma',
      'keloid',
      'malignant-melanoma',
      'melanoma',
      'mycosis-fungoides',
      'prurigo-nodularis',
      'pyogenic-granuloma',
      'seborrheic-keratosis',
      'squamous-cell-carcinoma',
      'superficial-spreading-melanoma-ssm',
    ];

    // Ánh xạ sang tiếng Việt
    const vietnameseLabels: { [key: string]: string } = {
      acne: 'Mụn trứng cá',
      'acne-vulgaris': 'Mụn trứng cá thông thường',
      'actinic-keratosis': 'Sừng hóa quang hóa',
      'basal-cell-carcinoma': 'Ung thư biểu mô tế bào đáy',
      'basal-cell-carcinoma-morpheiform': 'Ung thư biểu mô tế bào đáy dạng morpheiform',
      dermatofibroma: 'U xơ da',
      dermatomyositis: 'Viêm da cơ',
      'dyshidrotic-eczema': 'Chàm tổ đỉa',
      eczema: 'Chàm',
      'epidermal-nevus': 'Nốt ruồi biểu bì',
      folliculitis: 'Viêm nang lông',
      'kaposi-sarcoma': 'Sarcoma Kaposi',
      keloid: 'Sẹo lồi',
      'malignant-melanoma': 'U hắc tố ác tính',
      melanoma: 'U hắc tố',
      'mycosis-fungoides': 'Nấm da dạng nấm',
      'prurigo-nodularis': 'Ngứa cục',
      'pyogenic-granuloma': 'U hạt sinh mủ',
      'seborrheic-keratosis': 'Sừng hóa tiết bã',
      'squamous-cell-carcinoma': 'Ung thư biểu mô tế bào vảy',
      'superficial-spreading-melanoma-ssm': 'U hắc tố lan rộng bề mặt',
    };

    const englishLabel = englishLabels[maxIndex];
    const label = vietnameseLabels[englishLabel] || englishLabel;

    // Xóa file upload tạm
    fs.unlinkSync(file.path);

    return { label, confidence };
  }
}