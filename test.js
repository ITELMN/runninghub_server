import axios from 'axios';

const optimizedPrompt = `A charming children's illustration poster for '老虎的生日' (Tiger's Birthday).

Main subject: A cute cartoon tiger with big friendly eyes and a warm smile, wearing a festive party hat, sitting happily next to a delightful 3-tier birthday cake with colorful candles.

Art style: High-quality children's book illustration with rich colors and smooth rendering. Professional digital painting style with soft edges and warm lighting. Similar to popular children's books by modern illustrators.

Color scheme: Vibrant warm orange for the tiger with natural brown stripes, golden yellow cake with cream frosting, cheerful balloons in coral, yellow, mint green, and sky blue. Soft cream background with gentle lighting.

Scene elements: Colorful balloons floating around, small confetti pieces, decorative ribbons, simple forest background with soft bokeh effect. Birthday celebration atmosphere.

Composition: Tiger and cake as focal points with balanced placement. Clean space at top for title text. Warm and inviting layout.

Lighting: Soft natural lighting with gentle highlights, creating depth and dimension without harsh shadows.

Quality: Professional children's book illustration quality, smooth color transitions, high detail, warm and joyful mood. 8K resolution, anti-aliased, smooth rendering.`;

async function testImageGeneration() {
  try {
    console.log('🎨 开始测试 Qwen-Image 模型（高质量参数）...\n');
    
    // 创建任务 - 使用更高的步数和引导强度
    const response = await axios.post('http://localhost:4111/v1/images/generations', {
      prompt: optimizedPrompt,
      image_size: "1024x1024"
    });

    console.log('✅ 任务创建成功！');
    console.log('任务ID:', response.data.task_id);
    console.log('状态:', response.data.status);
    console.log('Seed:', response.data.seed);
    console.log('模型: Qwen-Image');
    console.log('\n正在等待生成结果...\n');

    // 轮询检查状态
    const taskId = response.data.task_id;
    let status = 'QUEUED';
    let attempts = 0;
    const maxAttempts = 60;

    while (status !== 'SUCCESS' && status !== 'FAILED' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await axios.get(`http://localhost:4111/v1/images/status/${taskId}`);
      status = statusResponse.data.status;
      attempts++;
      
      console.log(`[${attempts}] 当前状态: ${status}`);
      
      if (status === 'SUCCESS') {
        const resultResponse = await axios.get(`http://localhost:4111/v1/images/result/${taskId}`);
        console.log('\n🎉 图片生成成功！');
        console.log('图片URL:');
        resultResponse.data.images.forEach((img, index) => {
          console.log(`  ${index + 1}. ${img.url}`);
        });
        break;
      } else if (status === 'FAILED') {
        console.log('\n❌ 生成失败');
        console.log('错误:', statusResponse.data.error_message);
        break;
      }
    }

    if (attempts >= maxAttempts) {
      console.log('\n⏱️ 超时：任务执行时间过长');
    }

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

testImageGeneration();
