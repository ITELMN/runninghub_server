import express from 'express';
import { RunningHubService } from '../services/runninghub.js';
import { parseImageSize, generateRandomSeed } from '../utils/imageSize.js';

const router = express.Router();

// POST /v1/images/generations
router.post('/generations', async (req, res) => {
  try {
    const {
      prompt,
      negative_prompt = "低分辨率、模糊、失焦、像素化、噪点多、曝光异常、解剖错误、比例失调、多余肢体、不自然光影、饱和度异常、构图混乱、无关元素、纹理失真、版权违规、皮肤瑕疵、透视错误、悬浮物体、色彩违和、低对比度、边缘锯齿、过度对称、主体模糊",
      image_size = process.env.DEFAULT_IMAGE_SIZE || "1024x1024",
      num_inference_steps = parseInt(process.env.DEFAULT_STEPS) || 20,
      guidance_scale = parseFloat(process.env.DEFAULT_CFG_SCALE) || 2.5,
      seed = generateRandomSeed(),
      batch_size = parseInt(process.env.DEFAULT_BATCH_SIZE) || 1
    } = req.body;

    // Validate required fields
    if (!prompt) {
      return res.status(400).json({
        error: {
          code: "invalid_request",
          message: "Missing required field: prompt"
        }
      });
    }

    // Parse image size
    let sizeConfig;
    try {
      sizeConfig = parseImageSize(image_size);
    } catch (error) {
      return res.status(400).json({
        error: {
          code: "invalid_request",
          message: error.message
        }
      });
    }

    // Validate parameters
    if (num_inference_steps < 1 || num_inference_steps > 100) {
      return res.status(400).json({
        error: {
          code: "invalid_request",
          message: "num_inference_steps must be between 1 and 100"
        }
      });
    }

    if (guidance_scale < 1.0 || guidance_scale > 20.0) {
      return res.status(400).json({
        error: {
          code: "invalid_request",
          message: "guidance_scale must be between 1.0 and 20.0"
        }
      });
    }

    // Initialize RunningHub service
    const runningHub = new RunningHubService({
      apiKey: process.env.RUNNINGHUB_API_KEY,
      baseUrl: process.env.RUNNINGHUB_BASE_URL,
      workflowId: process.env.RUNNINGHUB_WORKFLOW_ID,
      instanceType: process.env.INSTANCE_TYPE,
      retainSeconds: process.env.RETAIN_SECONDS ? parseInt(process.env.RETAIN_SECONDS) : undefined,
      webhookUrl: process.env.WEBHOOK_URL
    });

    // Create task
    const taskResponse = await runningHub.createTask({
      prompt,
      negativePrompt: negative_prompt,
      width: sizeConfig.width,
      height: sizeConfig.height,
      aspectRatio: sizeConfig.aspectRatio,
      steps: num_inference_steps,
      cfgScale: guidance_scale,
      seed,
      batchSize: batch_size
    });

    if (taskResponse.code !== 0) {
      return res.status(500).json({
        error: {
          code: "task_creation_failed",
          message: taskResponse.msg
        }
      });
    }

    // Return task info
    res.json({
      task_id: taskResponse.data.taskId,
      status: taskResponse.data.taskStatus,
      client_id: taskResponse.data.clientId,
      seed: seed,
      message: "Task created successfully. Use /v1/images/status/:taskId to check status and /v1/images/result/:taskId to get result."
    });

  } catch (error) {
    console.error('Error creating image generation task:', error);
    res.status(500).json({
      error: {
        code: "internal_error",
        message: error.message
      }
    });
  }
});

// GET /v1/images/status/:taskId
router.get('/status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    const runningHub = new RunningHubService({
      apiKey: process.env.RUNNINGHUB_API_KEY,
      baseUrl: process.env.RUNNINGHUB_BASE_URL,
      workflowId: process.env.RUNNINGHUB_WORKFLOW_ID
    });

    const resultResponse = await runningHub.getTaskResult(taskId);

    // Return status info
    res.json({
      task_id: resultResponse.taskId,
      status: resultResponse.status,
      error_code: resultResponse.errorCode,
      error_message: resultResponse.errorMessage
    });

  } catch (error) {
    console.error('Error getting task status:', error);
    res.status(500).json({
      error: {
        code: "internal_error",
        message: error.message
      }
    });
  }
});

// GET /v1/images/result/:taskId
router.get('/result/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    const runningHub = new RunningHubService({
      apiKey: process.env.RUNNINGHUB_API_KEY,
      baseUrl: process.env.RUNNINGHUB_BASE_URL,
      workflowId: process.env.RUNNINGHUB_WORKFLOW_ID
    });

    const resultResponse = await runningHub.getTaskResult(taskId);

    if (resultResponse.status === 'SUCCESS' && resultResponse.results) {
      // Format response similar to SiliconFlow
      const images = resultResponse.results.map(item => ({
        url: item.url,
        output_type: item.outputType
      }));

      res.json({
        images,
        task_id: resultResponse.taskId,
        status: resultResponse.status
      });
    } else if (resultResponse.status === 'RUNNING' || resultResponse.status === 'QUEUED') {
      res.status(202).json({
        task_id: resultResponse.taskId,
        status: resultResponse.status,
        message: "Task is still processing"
      });
    } else if (resultResponse.status === 'FAILED') {
      res.status(500).json({
        error: {
          code: resultResponse.errorCode || "task_failed",
          message: resultResponse.errorMessage || "Task execution failed"
        },
        task_id: resultResponse.taskId,
        status: resultResponse.status
      });
    } else {
      res.status(404).json({
        error: {
          code: "result_not_found",
          message: "Task result not available"
        },
        task_id: resultResponse.taskId,
        status: resultResponse.status
      });
    }

  } catch (error) {
    console.error('Error getting task result:', error);
    res.status(500).json({
      error: {
        code: "internal_error",
        message: error.message
      }
    });
  }
});

export default router;
