import axios from 'axios';
import { nodeIds } from '../config/workflow.js';

export class RunningHubService {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.workflowId = config.workflowId;
    this.instanceType = config.instanceType;
    this.retainSeconds = config.retainSeconds;
    this.webhookUrl = config.webhookUrl;
  }

  async createTask(params) {
    const { prompt, width, height, steps, cfgScale, seed, batchSize } = params;

    try {
      // Ensure UTF-8 encoding for Chinese characters
      const utf8Prompt = Buffer.from(prompt, 'utf-8').toString('utf-8');
      
      console.log('Creating task with params:');
      console.log('- workflowId:', this.workflowId);
      console.log('- prompt:', utf8Prompt);
      console.log('- size:', `${width}x${height}`);
      console.log('- steps:', steps);
      
      const nodeInfoList = [
        {
          nodeId: nodeIds.PROMPT,
          fieldName: "text",
          fieldValue: utf8Prompt
        },
        {
          nodeId: nodeIds.KSAMPLER,
          fieldName: "seed",
          fieldValue: seed
        },
        {
          nodeId: nodeIds.KSAMPLER,
          fieldName: "steps",
          fieldValue: steps
        },
        {
          nodeId: nodeIds.KSAMPLER,
          fieldName: "cfg",
          fieldValue: cfgScale
        },
        {
          nodeId: nodeIds.LATENT_IMAGE,
          fieldName: "width",
          fieldValue: width
        },
        {
          nodeId: nodeIds.LATENT_IMAGE,
          fieldName: "height",
          fieldValue: height
        },
        {
          nodeId: nodeIds.LATENT_IMAGE,
          fieldName: "batch_size",
          fieldValue: batchSize
        }
      ];

      const requestBody = {
        apiKey: this.apiKey,
        workflowId: this.workflowId,
        nodeInfoList,
        addMetadata: true
      };

      if (this.webhookUrl) {
        requestBody.webhookUrl = this.webhookUrl;
      }

      if (this.instanceType) {
        requestBody.instanceType = this.instanceType;
      }

      if (this.retainSeconds) {
        requestBody.retainSeconds = this.retainSeconds;
      }

      const response = await axios.post(
        `${this.baseUrl}/task/openapi/create`,
        requestBody,
        {
          headers: {
            'Host': 'www.runninghub.cn',
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`RunningHub API error: ${error.response?.data?.msg || error.message}`);
    }
  }

  async getTaskResult(taskId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/openapi/v2/query`,
        {
          taskId: taskId
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get task result: ${error.response?.data?.errorMessage || error.message}`);
    }
  }

  async getWebhookDetail(taskId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/task/openapi/getWebhookDetail`,
        {
          apiKey: this.apiKey,
          taskId: taskId
        },
        {
          headers: {
            'Host': 'www.runninghub.cn',
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get webhook detail: ${error.response?.data?.msg || error.message}`);
    }
  }
}
